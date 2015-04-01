// Copyright (c) 2012-2014 Kofax. Use of this code is with permission pursuant to Kofax license terms.
package com.kofax.mobile.sdk.cordova.plugins.actions;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;

import com.kofax.kmc.ken.engines.ImageProcessor;
import com.kofax.kmc.ken.engines.ImageProcessor.ImageOutEvent;
import com.kofax.kmc.ken.engines.ImageProcessor.ImageOutListener;
import com.kofax.kmc.ken.engines.ImageProcessor.ProcessProgressEvent;
import com.kofax.kmc.ken.engines.ImageProcessor.ProcessProgressListener;
import com.kofax.kmc.ken.engines.data.BasicSettingsProfile;
import com.kofax.kmc.ken.engines.data.BasicSettingsProfile.CropType;
import com.kofax.kmc.ken.engines.data.BasicSettingsProfile.OutputBitDepth;
import com.kofax.kmc.ken.engines.data.BasicSettingsProfile.RotateType;
import com.kofax.kmc.ken.engines.data.Image;
import com.kofax.kmc.ken.engines.data.Image.ImageMimeType;
import com.kofax.kmc.ken.engines.data.Image.ImageRep;
import com.kofax.kmc.ken.engines.data.ImagePerfectionProfile;
import com.kofax.kmc.kut.utilities.error.ErrorInfo;
import com.kofax.kmc.kut.utilities.error.KmcException;
import com.kofax.mobile.sdk.cordova.plugins.MobileException;

public class ImageProcessorAction implements MobileAction, ImageOutListener, ProcessProgressListener {
    private static final String TAG = ImageProcessorAction.class.getName();
    private ImageProcessor imageProcessor;
    private ImageCaptureAction imageCaptureAction;
    private CallbackContext processCallback;

    //private ProgressBar progressBar;

    public ImageProcessorAction(ImageCaptureAction captureAction) {
        this.imageCaptureAction = captureAction;
    }

    @Override
    public MobileActionResult execute(
            CordovaInterface cordova,
            CordovaWebView webView,
            CallbackContext callbackContext,
            String actionName,
            JSONArray parameters) throws MobileException {
        if (ActionNames.ImageProcessorProcessImage.equals(actionName)) {
            processCallback = callbackContext;
            return processImage();
        }

        if (imageProcessor == null) {// || ActionNames.CreateImageProcessor.equals(actionName)) {
            imageProcessor = ImageProcessor.getInstance();
            imageProcessor.addProcessProgressEventListener(this);
            imageProcessor.addImageOutEventListener(this);
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

        JSONObject advancedOptions = args.optJSONObject("AdvancedOptions");
        boolean optionsFound = false;
        if (advancedOptions != null) {
            String evrsString = advancedOptions.optString("advancedSettings", null);
            if (evrsString != null && evrsString.length() > 0) {
                ImagePerfectionProfile profile = new ImagePerfectionProfile();
                profile.setIpOperations(evrsString);
                optionsFound = true;
                imageProcessor.setImagePerfectionProfile(profile);
            }
        }

        if (!optionsFound) {
            JSONObject basicOptions = args.optJSONObject("BasicOptions");
            if (basicOptions == null) {
                // TODO: Exception
                throw new MobileException("No vrs options specified");
            }

            // TODO: modify existing if exists
            BasicSettingsProfile profile = new BasicSettingsProfile();

            int desiredColorMode = basicOptions.optInt("desiredColorMode", Integer.MAX_VALUE);
            switch (desiredColorMode) {
            case -2:
            case 2:
                profile.setOutputBitDepth(OutputBitDepth.COLOR);
                break;
            case 1:
                profile.setOutputBitDepth(OutputBitDepth.GRAYSCALE);
                break;
            case -1:
            case 0:
                profile.setOutputBitDepth(OutputBitDepth.BITONAL);
                break;
            default:
                // TODO: error
                break;
            }

            int desiredResolution = basicOptions.optInt("desiredResolution", -1);
            if (desiredResolution >= 0) {
                profile.setOutputDPI(desiredResolution);
            }

            if (basicOptions.has("enableCrop")) {
                if (basicOptions.optBoolean("enableCrop")) {
                    profile.setCropType(CropType.CROP_AUTO);
                } else {
                    profile.setCropType(CropType.CROP_NONE);
                }
            }

            if (basicOptions.has("enableDeskew")) {
                profile.setDoDeskew(basicOptions.optBoolean("enableDeskew"));
            }

            if (basicOptions.has("enableRotate")) {
                if (basicOptions.optBoolean("enableRotate")) {
                    profile.setRotateType(RotateType.ROTATE_AUTO);
                } else {
                    profile.setRotateType(RotateType.ROTATE_NONE);
                }
            }

            imageProcessor.setBasicSettingsProfile(profile);
            imageProcessor.setProcessedImageJpegQuality(75);
        }

        imageProcessor.setProcessedImageRepresentation(ImageRep.IMAGE_REP_BITMAP);
        imageProcessor.setProcessedImageMimeType(ImageMimeType.MIMETYPE_JPEG);

        PluginResult pluginResult = new PluginResult(Status.OK);
        MobileActionResult actionResult = new MobileActionResult(pluginResult);
        return actionResult;
    }

    private MobileActionResult processImage() throws MobileException {
        try {
            imageCaptureAction.createSpinner();
            imageCaptureAction.setSpinnerOptions(true);
            imageProcessor.processImage(imageCaptureAction.getImage());

            //SpinnerAction action = new SpinnerAction(imageCaptureAction, true);
        } catch (KmcException e) {
            throw new MobileException("unable to processImage", e);
        }

        PluginResult pluginResult = new PluginResult(Status.NO_RESULT);
        pluginResult.setKeepCallback(true);
        MobileActionResult actionResult = new MobileActionResult(pluginResult);
        return actionResult;
    }

    @Override
    public boolean requiresUIThread() {
        return true;
    }

    @Override
    public void processProgress(ProcessProgressEvent event) {
        Log.d(TAG, String.format("Image processing %d%% complete", event.getProgressPct()));
    }

    @Override
    public void imageOut(ImageOutEvent event) {
        if (event.getStatus().getErr() != ErrorInfo.KMC_SUCCESS.getErr()) {
            PluginResult pluginResult = new PluginResult(Status.ERROR, event.getStatus().getErrMsg());
            pluginResult.setKeepCallback(false);
            MobileActionExecutor.finish(processCallback, pluginResult);

            Log.e(TAG, "Error processing image");
            return;
        }

        imageCaptureAction.setImage(event.getImage());

        Image image = imageCaptureAction.getImage();

        JSONObject result = new JSONObject();
        JSONObject captureObject = new JSONObject();
        JSONObject imageObject = new JSONObject();
        try {
            imageObject.put("id", image.getImageID());
            captureObject.put("image", imageObject);
            result.put("ProcessResult", captureObject);
        } catch (JSONException e) {
        }

        PluginResult pluginResult = new PluginResult(Status.OK, result);
        pluginResult.setKeepCallback(false);
        MobileActionExecutor.finish(processCallback, pluginResult);
    }

    @Override
    public void destroy(CordovaWebView webView) {
    }
}
