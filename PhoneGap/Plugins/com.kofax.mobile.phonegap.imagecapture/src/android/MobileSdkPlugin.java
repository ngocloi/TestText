// Copyright (c) 2012-2014 Kofax. Use of this code is with permission pursuant to Kofax license terms.
package com.kofax.mobile.sdk.cordova.plugins;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;

import android.util.Log;

import com.kofax.kmc.kut.utilities.Licensing;
import com.kofax.kmc.kut.utilities.error.ErrorInfo;
import com.kofax.mobile.sdk.cordova.plugins.actions.ActionNames;
import com.kofax.mobile.sdk.cordova.plugins.actions.BarcodeCaptureAction;
import com.kofax.mobile.sdk.cordova.plugins.actions.ImageAction;
import com.kofax.mobile.sdk.cordova.plugins.actions.ImageCaptureAction;
import com.kofax.mobile.sdk.cordova.plugins.actions.ImageProcessorAction;
import com.kofax.mobile.sdk.cordova.plugins.actions.ImageReviewAction;
import com.kofax.mobile.sdk.cordova.plugins.actions.MobileActionExecutor;
import com.kofax.mobile.sdk.cordova.plugins.actions.SpinnerAction;

public class MobileSdkPlugin extends CordovaPlugin {
    public static final String PLUGIN_VERSION = "1.1.0.0.0.0";
    private static final String TAG = MobileSdkPlugin.class.getName();

    private static boolean licensed;
    private static boolean pageDetect;

    private ImageCaptureAction imageCaptureAction;
    private ImageReviewAction imageReviewAction;
    private ImageProcessorAction imageProcessorAction;
    private BarcodeCaptureAction barcodeCaptureAction;
    private ImageAction imageAction;

    static {
        pageDetect = true;
    }

    @Override
    public void initialize(CordovaInterface cordova, final CordovaWebView webView) {
        cordova.getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                webView.clearCache(true);
            }
        });

        super.initialize(cordova, webView);
    }

    @Override
    public void onReset() {
        if (imageCaptureAction != null) {
            imageCaptureAction.destroy(webView);
            imageCaptureAction = null;
        }

        if (imageReviewAction != null) {
            imageReviewAction.destroy(webView);
            imageReviewAction = null;
        }

        if (imageProcessorAction != null) {
            imageProcessorAction.destroy(webView);
            imageProcessorAction = null;
        }

        if (barcodeCaptureAction != null) {
            barcodeCaptureAction.destroy(webView);
            barcodeCaptureAction = null;
        }

        if (imageAction != null) {
            imageAction.destroy(webView);
            imageAction = null;
        }
        super.onReset();
    }

    public static ErrorInfo setLicenseKey(String licenseKey) {
        ErrorInfo error;
        
        if (!licensed) {
            error = Licensing.setMobileSDKLicense(licenseKey);
            if (error.getErr() == ErrorInfo.KMC_SUCCESS.getErr()) {
                licensed = true;
            }
        } else {
            error = ErrorInfo.KMC_SUCCESS;
        }
        
        return error;
    }

    public static void enablePageDetect(boolean enable) {
        MobileSdkPlugin.pageDetect = enable;
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (!licensed) {
            Log.e(TAG, "Plugin is not licensed");
            return false;
        }

        Log.w(TAG, String.format("%s action called", action));

        if (ActionNames.Echo.equals(action)) {
            String message = args.optString(0);
            echo(message, callbackContext);
        } else if (ActionNames.PluginGetNativeVersion.equals(action)) {
            getNativeVersion(callbackContext);
        } else if (ActionNames.CreateImageCaptureControl.equals(action)) {
            if (imageCaptureAction == null) {
                imageCaptureAction = new ImageCaptureAction(pageDetect);
            } else {
                Log.w(TAG, "Attempted to create multiple instances of an ImageCaptureControl");
            }
            MobileActionExecutor.execute(cordova, imageCaptureAction, webView, callbackContext, action, args);
        } else if (ActionNames.ImageCaptureSetOptions.equals(action)) {
            MobileActionExecutor.execute(cordova, imageCaptureAction, webView, callbackContext, action, args);
        } else if (ActionNames.ImageCaptureStartContinuousCapture.equals(action)) {
            MobileActionExecutor.execute(cordova, imageCaptureAction, webView, callbackContext, action, args);
        } else if (ActionNames.ImageCaptureStopContinuousCapture.equals(action)) {
            MobileActionExecutor.execute(cordova, imageCaptureAction, webView, callbackContext, action, args);
        } else if (ActionNames.ImageCaptureTakePhoto.equals(action)) {
            MobileActionExecutor.execute(cordova, imageCaptureAction, webView, callbackContext, action, args);
        } else if (ActionNames.CreateImageReviewControl.equals(action)) {
            if (imageReviewAction == null) {
                imageReviewAction = new ImageReviewAction(cordova, imageCaptureAction);
            } else {
                Log.i(TAG, "Creating multiple instances of review control.");
            }
            MobileActionExecutor.execute(cordova, imageReviewAction, webView, callbackContext, action, args);
        } else if (ActionNames.ImageReviewSetOptions.equals(action)) {
            MobileActionExecutor.execute(cordova, imageReviewAction, webView, callbackContext, action, args);
        } else if (ActionNames.CreateImageProcessor.equals(action)) {
            imageProcessorAction = new ImageProcessorAction(imageCaptureAction);
            MobileActionExecutor.execute(cordova, imageProcessorAction, webView, callbackContext, action, args);
        } else if (ActionNames.ImageProcessorProcessImage.equals(action)) {
            MobileActionExecutor.execute(cordova, imageProcessorAction, webView, callbackContext, action, args);
        } else if (ActionNames.ImageProcessorSetOptions.equals(action)) {
            MobileActionExecutor.execute(cordova, imageProcessorAction, webView, callbackContext, action, args);
        } else if (ActionNames.ImageGetBase64ImageData.equals(action)) {
            if (imageAction == null) {
                imageAction = new ImageAction(imageCaptureAction);
            }
            MobileActionExecutor.execute(cordova, imageAction, webView, callbackContext, action, args);
        } else if (ActionNames.CreateBarcodeCaptureControl.equals(action)) {
            barcodeCaptureAction = new BarcodeCaptureAction();
            MobileActionExecutor.execute(cordova, barcodeCaptureAction, webView, callbackContext, action, args);
        } else if (ActionNames.BarcodeCaptureSetOptions.equals(action)) {
            MobileActionExecutor.execute(cordova, barcodeCaptureAction, webView, callbackContext, action, args);
        } else if (ActionNames.SpinnerSetOptions.equals(action)) {
            SpinnerAction spinnerAction = new SpinnerAction(imageCaptureAction, true);
            MobileActionExecutor.execute(cordova, spinnerAction, webView, callbackContext, action, args);
        } else if (ActionNames.PluginReset.equals(action)) {
            final CallbackContext internalContext = callbackContext;
            cordova.getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    onReset();
                    internalContext.success();
                }
            });
        } else {
            Log.w(TAG, "Returning false for action " + action);
            return false;
        }

        return true;
    }

    private void echo(String message, CallbackContext callbackContext) {
        if (message != null && message.length() > 0) {
            if ("nativeVersion".equals(message)) {
                getNativeVersion(callbackContext);
            } else {
                callbackContext.success(message);
            }
        } else {
            callbackContext.error("Expected one non-empty string argument.");
        }
    }
    
    private void getNativeVersion(CallbackContext callbackContext) {
        callbackContext.success(PLUGIN_VERSION);
    }
}