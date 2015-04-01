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

import android.view.View;

import com.kofax.kmc.ken.engines.ImageProcessor;
import com.kofax.kmc.ken.engines.ImageProcessor.AnalysisCompleteEvent;
import com.kofax.kmc.ken.engines.ImageProcessor.AnalysisCompleteListener;
import com.kofax.kmc.ken.engines.data.Image;
import com.kofax.kmc.kui.uicontrols.ImgReviewEditCntrl;
import com.kofax.kmc.kut.utilities.error.KmcException;
import com.kofax.mobile.sdk.cordova.plugins.MobileException;

public class ImageReviewAction extends MobileActionBase implements AnalysisCompleteListener {
    private ImageCaptureAction captureAction;
    private ImgReviewEditCntrl reviewControl;
    private ImgReviewEditCntrl postReviewControl;

    private ImgReviewEditCntrl lastUsed;

    private String controlID;
    private String postControlID;

    private CallbackContext analysisCompleteCallback;
    private CordovaInterface cordova;

    public ImageReviewAction(CordovaInterface cordova, ImageCaptureAction imageCaptureAction) {
        this.cordova = cordova;
        this.captureAction = imageCaptureAction;
    }

    @Override
    public MobileActionResult execute(
            CordovaInterface cordova,
            CordovaWebView webView,
            CallbackContext callbackContext,
            String actionName,
            JSONArray parameters) throws MobileException {
        if (parameters.length() < 1) {
            throw new MobileException("Missing parameter object");
        }

        JSONObject args;
        try {
            args = parameters.getJSONObject(0);
        } catch (JSONException e) {
            throw new MobileException("Unable to read argument", e);
        }

        if (ActionNames.CreateImageReviewControl.equals(actionName)) {
            try {
                args.put("SetImage", true);
            } catch (JSONException e) {
            }
        }

        ImgReviewEditCntrl reviewControl;
        String controlID;
        if (args.has("Mode")) {
            reviewControl = this.postReviewControl;
            controlID = this.postControlID;
        } else {
            reviewControl = this.reviewControl;
            controlID = this.controlID;
        }

        if (reviewControl == null || actionName == ActionNames.CreateImageReviewControl) {
            reviewControl = new ImgReviewEditCntrl(webView.getContext());
            controlID = null;
        }

        JSONObject layout = args.optJSONObject("Layout");
        adjustView(cordova, layout, reviewControl);

        if (controlID == null) {
            View spinner = captureAction.getProgressSpinner();
            if (spinner != null) {
                webView.addView(reviewControl, webView.indexOfChild(spinner));
            } else {
                webView.addView(reviewControl);
            }

            controlID = UUID.randomUUID().toString();
        }

        JSONObject result = new JSONObject();
        try {
            result.put("id", controlID);
        } catch (JSONException e) {
            assert (false);
        }

        if (args.has("Mode")) {
            this.postReviewControl = reviewControl;
            this.postControlID = controlID;
        } else {
            this.reviewControl = reviewControl;
            this.controlID = controlID;
        }

        Status status;
        boolean keepCallback;
        if (args.has("SetImage")) {
            try {
                reviewControl.setImage(captureAction.getImage());
            } catch (KmcException e) {
                throw new MobileException("Unable to set image", e);
            }

            ImageProcessor imageProcessor = ImageProcessor.getInstance();
            lastUsed = reviewControl;
            // ImageProcessor is a singleton, remove the complete listener first.
            imageProcessor.addAnalysisCompleteEventListener(this);
            try {
                analysisCompleteCallback = callbackContext;
                imageProcessor.doQuickAnalysis(captureAction.getImage(), true);
            } catch (KmcException e) {
                // Remove the analysis complete listener if there was an exception
                imageProcessor.removeAnalysisCompleteEventListener(this);
                PluginResult pluginResult = new PluginResult(Status.ERROR, e.getMessage());
                MobileActionResult actionResult = new MobileActionResult(pluginResult);
                return actionResult;
            }

            status = Status.NO_RESULT;
            keepCallback = true;
        } else {
            status = Status.OK;
            keepCallback = false;
        }

        PluginResult pluginResult = new PluginResult(status, result);
        pluginResult.setKeepCallback(keepCallback);
        MobileActionResult actionResult = new MobileActionResult(pluginResult);
        return actionResult;
    }

    @Override
    public boolean requiresUIThread() {
        return true;
    }

    @Override
    public void destroy(CordovaWebView webView) {
        if (reviewControl != null) {
            webView.removeView(reviewControl);
        }
        if (postReviewControl != null) {
            webView.removeView(postReviewControl);
        }
    }

    @Override
    public void analysisComplete(final AnalysisCompleteEvent event) {
        ImageProcessor.getInstance().removeAnalysisCompleteEventListener(this);

        cordova.getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                JSONObject result = new JSONObject();
                try {
                    ImgReviewEditCntrl reviewControl = lastUsed;
                    lastUsed = null;
                    Image image = new Image(event.getImage().getImageQuickAnalysisFeedBack().getViewBoundariesImage());
                    reviewControl.setImage(image);
                    result.put("id", event.getImage().getImageID());

                    // Return an OK result - this causes the review control to appear with the captured
                    // image
                    PluginResult pluginResult = new PluginResult(Status.OK, result);
                    MobileActionExecutor.finish(analysisCompleteCallback, pluginResult);
                    analysisCompleteCallback = null;
                } catch (KmcException e) {
                } catch (JSONException e) {
                }
            }
        });
    }
}
