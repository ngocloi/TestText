// Copyright (c) 2012-2014 Kofax. Use of this code is with permission pursuant to Kofax license terms.
package com.kofax.mobile.sdk.phonegap.TotalAgility;

import org.apache.cordova.CordovaActivity;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.kofax.kmc.kut.utilities.error.ErrorInfo;
import com.kofax.mobile.sdk.cordova.plugins.MobileSdkPlugin;

public class TotalAgility extends CordovaActivity {
    private static final String LICENSE_KEY = "MYLICENSE";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.init();

        // Set the license key
        ErrorInfo errorInfo = MobileSdkPlugin.setLicenseKey(LICENSE_KEY);
        if (errorInfo.getErr() != ErrorInfo.KMC_SUCCESS.getErr()){
            Intent intent = new Intent();
            intent.putExtra("ErrorMessage", errorInfo.getErrMsg());
            setResult(-1, intent);
            finish();
            return;
        }
        
        // Enable page detection
        MobileSdkPlugin.enablePageDetect(true);


        String url = "";
        Intent intent = this.getIntent();
        if (intent != null) {
            String remoteUrl = intent.getStringExtra(RemoteUrlActivity.KEY_REMOTE_URL);
            if (remoteUrl != null && remoteUrl.length() > 0) {
                url = remoteUrl;
            }
        }

        String cordovaData = "cordovaVersion=3.1&cordovaPlatform=android";
        if (url.contains("?")) {
            url = String.format("%s&%s", url, cordovaData);
        } else {
            url = String.format("%s?%s", url, cordovaData);
        }

        super.loadUrl(url);
    }

    @Override
    public Activity getActivity() {
        return this;
    }
}
