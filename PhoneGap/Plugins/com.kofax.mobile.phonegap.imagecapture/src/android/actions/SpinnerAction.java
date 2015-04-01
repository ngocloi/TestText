// Copyright (c) 2012-2014 Kofax. Use of this code is with permission pursuant to Kofax license terms.
package com.kofax.mobile.sdk.cordova.plugins.actions;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONArray;
import org.json.JSONObject;

import com.kofax.mobile.sdk.cordova.plugins.MobileException;

public class SpinnerAction implements MobileAction {
    private ImageCaptureAction captureAction;
    private boolean create;

    public SpinnerAction(ImageCaptureAction captureAction, boolean create) {
        this.captureAction = captureAction;
        this.create = create;
    }

    @Override
    public MobileActionResult execute(
            CordovaInterface cordova,
            CordovaWebView webView,
            CallbackContext callbackContext,
            String actionName,
            JSONArray parameters) throws MobileException {
        if (captureAction == null) {
            return null;
        }

        if (create) {
            captureAction.createSpinner();
        }

        JSONObject options = parameters.optJSONObject(0);
        if (options.has("visible")) {
            if (options.optBoolean("visible")) {
                captureAction.setSpinnerOptions(true);
            } else {
                captureAction.setSpinnerOptions(false);
            }
        }

        PluginResult pluginResult = new PluginResult(Status.OK);
        MobileActionResult actionResult = new MobileActionResult(pluginResult);
        return actionResult;
    }

    @Override
    public void destroy(CordovaWebView webView) {
    }

    @Override
    public boolean requiresUIThread() {
        return true;
    }
}
