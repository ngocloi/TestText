// Copyright (c) 2012-2014 Kofax. Use of this code is with permission pursuant to Kofax license terms.
package com.kofax.mobile.sdk.cordova.plugins.actions;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;

import com.kofax.mobile.sdk.cordova.plugins.MobileException;

public class MobileActionExecutor implements Runnable {
    private CordovaInterface cordova;
    private MobileAction action;
    private CordovaWebView webView;
    private CallbackContext context;
    private String actionName;
    private JSONArray arguments;

    public MobileActionExecutor(
            CordovaInterface cordova,
            MobileAction action,
            CordovaWebView webView,
            CallbackContext context,
            String actionName,
            JSONArray arguments) {
        this.cordova = cordova;
        this.action = action;
        this.webView = webView;
        this.context = context;
        this.actionName = actionName;
        this.arguments = arguments;
    }

    public static void execute(
            CordovaInterface cordova,
            MobileAction action,
            CordovaWebView webView,
            CallbackContext callbackContext,
            String actionName,
            JSONArray args) {
        MobileActionExecutor executor = new MobileActionExecutor(cordova, action, webView, callbackContext, actionName, args);
        if (action.requiresUIThread()) {
            cordova.getActivity().runOnUiThread(executor);
        } else {
            cordova.getThreadPool().execute(executor);
        }
    }

    public static void finish(CallbackContext captureContext, PluginResult pluginResult) {
        captureContext.sendPluginResult(pluginResult);
    }

    @Override
    public void run() {
        try {
            MobileActionResult result = action.execute(cordova, webView, context, actionName, arguments);
            if (result != null) {
                context.sendPluginResult(result.getPluginResult());
            }
        } catch (MobileException e) {
            context.error(e.getMessage());
        }
    }
}
