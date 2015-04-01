// Copyright (c) 2012-2014 Kofax. Use of this code is with permission pursuant to Kofax license terms.
package com.kofax.mobile.sdk.cordova.plugins.actions;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;

import com.kofax.mobile.sdk.cordova.plugins.MobileException;

public interface MobileAction {
    public MobileActionResult execute(CordovaInterface cordova, CordovaWebView webView, CallbackContext callbackContext, String actionName, JSONArray parameters) throws MobileException;

    public void destroy(CordovaWebView webView);

    public boolean requiresUIThread();
}
