// Copyright (c) 2012-2014 Kofax. Use of this code is with permission pursuant to Kofax license terms.
package com.kofax.mobile.sdk.cordova.plugins.actions;

import org.apache.cordova.PluginResult;

public class MobileActionResult {
    private PluginResult pluginResult;

    public MobileActionResult(PluginResult pluginResult) {
        this.pluginResult = pluginResult;
    }

    public PluginResult getPluginResult() {
        return pluginResult;
    }
}
