// Copyright (c) 2012-2014 Kofax. Use of this code is with permission pursuant to Kofax license terms.
package com.kofax.mobile.sdk.cordova.plugins.actions;

import java.nio.ByteBuffer;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Base64;

import com.kofax.kmc.ken.engines.data.Image;
import com.kofax.kmc.ken.engines.data.Image.ImageMimeType;
import com.kofax.kmc.kut.utilities.error.ErrorInfo;
import com.kofax.kmc.kut.utilities.error.KmcException;
import com.kofax.kmc.kut.utilities.error.KmcRuntimeException;
import com.kofax.mobile.sdk.cordova.plugins.MobileException;

public class ImageAction implements MobileAction {
    private ImageCaptureAction captureAction;

    public ImageAction(ImageCaptureAction captureAction) {
        this.captureAction = captureAction;
    }

    @Override
    public MobileActionResult execute(
            CordovaInterface cordova,
            CordovaWebView webView,
            CallbackContext callbackContext,
            String actionName,
            JSONArray parameters) throws MobileException {
        try {
            JSONObject object;
            object = parameters.getJSONObject(0);

            boolean compressionEnabled = object.getBoolean("CompressionEnabled");
            int quality;
            String mimeType = object.getString("CompressionFormat");

            if (compressionEnabled) {
                quality = object.getInt("CompressionQuality");
            } else {
                quality = 75;
            }

            Image image = captureAction.getImage();
            image.setImageMimeType(ImageMimeType.MIMETYPE_TIFF);
            image.setImageJpegQuality(quality);

            ErrorInfo errorInfo = image.imageWriteToFileBuffer();

            ByteBuffer buffer = image.getImageFileBuffer();

            String imageData;
            if (buffer.hasArray()) {
                imageData = Base64.encodeToString(buffer.array(), Base64.NO_WRAP);
            } else {
                byte[] byteBuffer = new byte[buffer.limit()];
                buffer.get(byteBuffer, 0, buffer.limit());

                imageData = Base64.encodeToString(byteBuffer, Base64.NO_WRAP);
            }

            JSONObject result = new JSONObject();
            result.put("imageData", imageData);
            result.put("mimeType", mimeType);

            PluginResult pluginResult = new PluginResult(Status.OK, result);
            pluginResult.setKeepCallback(false);
            MobileActionResult actionResult = new MobileActionResult(pluginResult);
            return actionResult;
        } catch (JSONException e) {
            throw new MobileException(e);
        } catch (KmcRuntimeException e) {
            throw new MobileException(e);
        } catch (KmcException e) {
            throw new MobileException(e);
        }
    }

    @Override
    public void destroy(CordovaWebView webView) {
        captureAction = null;
    }

    @Override
    public boolean requiresUIThread() {
        return false;
    }
}
