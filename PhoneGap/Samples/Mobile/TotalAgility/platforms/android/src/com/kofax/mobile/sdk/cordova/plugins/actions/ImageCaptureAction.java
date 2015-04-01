// Copyright (c) 2012-2014 Kofax. Use of this code is with permission pursuant to Kofax license terms.
package com.kofax.mobile.sdk.cordova.plugins.actions;

import java.util.UUID;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.view.ViewGroup.LayoutParams;
import android.webkit.WebView;
import android.widget.ProgressBar;

import com.kofax.kmc.ken.engines.data.Image;
import com.kofax.kmc.kui.uicontrols.ImageCaptureView;
import com.kofax.kmc.kui.uicontrols.ImageCapturedEvent;
import com.kofax.kmc.kui.uicontrols.ImageCapturedListener;
import com.kofax.kmc.kui.uicontrols.data.Flash;
import com.kofax.kmc.kui.uicontrols.data.ImageCaptureFrame;
import com.kofax.mobile.sdk.cordova.plugins.MobileException;
import com.kofax.mobile.sdk.cordova.plugins.controls.CaptureFlashControl;

public class ImageCaptureAction extends MobileActionBase implements ImageCapturedListener {
    private WebView webView;
    private ImageCaptureView captureView;
    private CaptureFlashControl flashSettingsView;
    private String controlID;

    private Image image;

    private CallbackContext captureContext;

    private ProgressBar progressSpinner;
    private boolean pageDetectEnabled;

    public ImageCaptureAction(boolean pageDetectEnabled) {
        this.pageDetectEnabled = pageDetectEnabled;
    }

    @Override
    public MobileActionResult execute(
            CordovaInterface cordova,
            CordovaWebView webView,
            CallbackContext callbackContext,
            String actionName,
            JSONArray parameters) throws MobileException {
        this.webView = webView;
        if (ActionNames.ImageCaptureStartContinuousCapture.equals(actionName)) {
            captureContext = callbackContext;
            return startContinuousCapture();
        } else if (ActionNames.ImageCaptureStopContinuousCapture.equals(actionName)) {
            captureContext = callbackContext;
            return stopContinuousCapture();
        } else if (ActionNames.ImageCaptureTakePhoto.equals(actionName)) {
            captureContext = callbackContext;
            return takePhoto();
        }

        if (parameters.length() < 1) {
            throw new MobileException("Missing parameter object");
        }

        JSONObject args;
        try {
            args = parameters.getJSONObject(0);
        } catch (JSONException e) {
            throw new MobileException("Unable to read argument", e);
        }

        if (captureView == null || actionName == ActionNames.CreateImageCaptureControl) {
            captureView = new ImageCaptureView(webView.getContext());
            captureView.setPageDetect(pageDetectEnabled);
            captureView.addOnImageCapturedListener(this);

            flashSettingsView = new CaptureFlashControl(webView, captureView);
            controlID = null;
        }

        JSONObject levelingOptions = args.optJSONObject("LevelingOptions");
        if (levelingOptions != null) {
            if (levelingOptions.has("enabled")) {
                boolean levelingEnabled = levelingOptions.optBoolean("enabled");
                captureView.setLevelIndicator(levelingEnabled);
            }

            if (levelingOptions.has("levelThresholdPitch")) {
                int levelThresholdPitch = levelingOptions.optInt("levelThresholdPitch");
                captureView.setLevelThresholdPitch(levelThresholdPitch);
            }

            if (levelingOptions.has("levelThresholdRoll")) {
                int levelThresholdRoll = levelingOptions.optInt("levelThresholdRoll");
                captureView.setLevelThresholdRoll(levelThresholdRoll);
            }

            if (levelingOptions.has("deviceDeclinationPitch")) {
                int deviceDeclinationPitch = levelingOptions.optInt("deviceDeclinationPitch");
                captureView.setDeviceDeclinationPitch(deviceDeclinationPitch);
            }

            if (levelingOptions.has("deviceDeclinationRoll")) {
                int deviceDeclinationRoll = levelingOptions.optInt("deviceDeclinationRoll");
                captureView.setDeviceDeclinationRoll(deviceDeclinationRoll);
            }

            if (levelingOptions.has("stabilityDelay")) {
                int stabilityDelay = levelingOptions.optInt("stabilityDelay");
                captureView.setStabilityDelay(stabilityDelay);
            }
        }

        JSONObject captureOptions = args.optJSONObject("CaptureOptions");
        if (captureOptions != null) {
            if (captureOptions.has("FlashMode")) {
                int value = captureOptions.optInt("FlashMode");
                switch (value) {
                case 0:
                    captureView.setFlash(Flash.ON);
                    break;
                case 1:
                    captureView.setFlash(Flash.OFF);
                    break;
                case 2:
                    captureView.setFlash(Flash.AUTO);
                    break;
                default:
                    // TODO: error - bad value
                    break;
                }
            }

            if (captureOptions.has("pageDetectEnabled")) {
                pageDetectEnabled = captureOptions.optBoolean("pageDetectEnabled");
                captureView.setPageDetect(pageDetectEnabled);
            }
        }

        JSONObject layout = args.optJSONObject("Layout");
        int frameWidth = 0;
        int frameHeight = 0;

        JSONObject frameOptions = args.optJSONObject("FrameOptions");
        if (frameOptions != null) {
            if (frameOptions.has("enabled")) {
                boolean enabled = frameOptions.optBoolean("enabled");
                if (enabled) {
                    updatePixel(cordova, frameOptions, "borderWidth");
                    updatePixel(cordova, frameOptions, "width");
                    updatePixel(cordova, frameOptions, "height");

                    int frameThickness = frameOptions.optInt("borderWidth");
                    frameWidth = frameOptions.optInt("width");
                    frameHeight = frameOptions.optInt("height");

                    ImageCaptureFrame frame = new ImageCaptureFrame();
                    frame.setFrameBorderWidth(frameThickness);
                    frame.setFrameWidth(frameWidth);
                    frame.setFrameHeight(frameHeight);

                    String colorString = frameOptions.optString("borderColor");
                    if (colorString != null && colorString.length() > 0) {
                        int color = hexToInt(colorString);
                        frame.setFrameBorderColor(color);
                    }

                    colorString = frameOptions.optString("outerColor");
                    if (colorString != null && colorString.length() > 0) {
                        int color = hexToInt(colorString);
                        frame.setFrameOuterColor(color);
                    }
                    captureView.setImageCaptureFrame(frame);
                } else {
                    captureView.setImageCaptureFrame(null);
                }
            }
        }

        adjustView(cordova, layout, captureView, flashSettingsView.getView(), 4, 4, frameWidth, frameHeight);

        if (controlID == null) {
            webView.addView(captureView);
            webView.addView(flashSettingsView.getView());
            controlID = UUID.randomUUID().toString();
        }

        JSONObject result = new JSONObject();
        try {
            result.put("id", controlID);
        } catch (JSONException e) {
            assert (false);
        }

        PluginResult pluginResult = new PluginResult(Status.OK, result);
        pluginResult.setKeepCallback(false);
        MobileActionResult actionResult = new MobileActionResult(pluginResult);
        return actionResult;
    }

    private MobileActionResult takePhoto() {
        captureView.takePicture();

        PluginResult pluginResult = new PluginResult(Status.NO_RESULT);
        pluginResult.setKeepCallback(true);
        MobileActionResult actionResult = new MobileActionResult(pluginResult);
        return actionResult;
    }

    private MobileActionResult startContinuousCapture() {
        if (image != null) { 
            image.imageClearBitmap();
            image = null;
        }
        
        captureView.doContinuousMode(true);

        PluginResult pluginResult = new PluginResult(Status.NO_RESULT);
        pluginResult.setKeepCallback(true);
        MobileActionResult actionResult = new MobileActionResult(pluginResult);
        return actionResult;
    }

    private MobileActionResult stopContinuousCapture() {
        captureView.doContinuousMode(false);

        PluginResult pluginResult = new PluginResult(Status.OK);
        pluginResult.setKeepCallback(true);
        MobileActionResult actionResult = new MobileActionResult(pluginResult);
        return actionResult;
    }

    @Override
    public boolean requiresUIThread() {
        return true;
    }

    public void createSpinner() {
        if (progressSpinner == null) {
            progressSpinner = new ProgressBar(captureView.getContext());
        }

        if (captureView != null) {
            progressSpinner.setX(captureView.getX() + captureView.getWidth() / 2 - 40);
            progressSpinner.setY(captureView.getY() + captureView.getHeight() / 2 - 40);
            LayoutParams layoutParams = progressSpinner.getLayoutParams();
            if (layoutParams == null) {
                layoutParams = new LayoutParams(80, 80);
            } else {
                layoutParams.width = 80;
                layoutParams.height = 80;
            }
            progressSpinner.setLayoutParams(layoutParams);
        }
    }

    public void setSpinnerOptions(boolean visible) {
        createSpinner();
        webView.removeView(progressSpinner);
        if (visible) {
            webView.addView(progressSpinner);
        }
    }

    @Override
    public void onImageCaptured(ImageCapturedEvent event) {
        // Disable continuous capture 
        captureView.doContinuousMode(false);
        // Cache the image
        image = event.getImage();

        createSpinner();
        setSpinnerOptions(true);//visible

        JSONObject result = new JSONObject();
        JSONObject captureObject = new JSONObject();
        JSONObject imageObject = new JSONObject();

        try {
            imageObject.put("id", image.getImageID());
            captureObject.put("image", imageObject);
            result.put("CaptureResult", captureObject);
        } catch (JSONException e1) {
        }

        // Return an OK result - this causes the review control to appear with the captured
        // image
        PluginResult pluginResult = new PluginResult(Status.OK, result);
        pluginResult.setKeepCallback(true);
        MobileActionExecutor.finish(captureContext, pluginResult);
    }

    private int hexToInt(String hex) {
        if (hex == null) {
            throw new IllegalArgumentException("'hex' cannot be null");
        } else if (hex.length() != 8) {
            throw new IllegalArgumentException(String.format("'hex' (%s) length must be 8 characters long", hex));
        }

        // Android colors are ARGB and iOS are RGBA
        // SDK plugin exposes colors as RGBA
        int red = Integer.parseInt(hex.substring(0, 2), 16);
        int green = Integer.parseInt(hex.substring(2, 4), 16);
        int blue = Integer.parseInt(hex.substring(4, 6), 16);
        int alpha = Integer.parseInt(hex.substring(6, 8), 16);

        int value = (alpha & 0xFF) << 24;
        value |= (red & 0xFF) << 16;
        value |= (green & 0xFF) << 8;
        value |= blue & 0xFF;
        return value;
    }

    public Image getImage() {
        return image;
    }

    public ProgressBar getProgressSpinner() {
        return progressSpinner;
    }

    public void setImage(Image image) {
        this.image = image;
    }

    @Override
    public void destroy(CordovaWebView webView) {
        if (captureView != null) {
            webView.removeView(captureView);
            captureView = null;
        }

        if (flashSettingsView != null) {
            webView.removeView(flashSettingsView.getView());
            flashSettingsView = null;
        }

        if (progressSpinner != null) {
            webView.removeView(progressSpinner);
            progressSpinner = null;
        }

        if (image != null) {
            image.imageClearBitmap();
            image = null;
        }
    }
}
