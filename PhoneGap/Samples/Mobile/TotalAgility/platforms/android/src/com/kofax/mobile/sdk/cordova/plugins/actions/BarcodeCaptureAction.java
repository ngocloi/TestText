// Copyright (c) 2012-2014 Kofax. Use of this code is with permission pursuant to Kofax license terms.
package com.kofax.mobile.sdk.cordova.plugins.actions;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;

import com.kofax.kmc.kui.uicontrols.BarCodeCaptureView;
import com.kofax.kmc.kui.uicontrols.BarCodeFoundEvent;
import com.kofax.kmc.kui.uicontrols.BarCodeFoundListener;
import com.kofax.kmc.kui.uicontrols.data.GuidingLine;
import com.kofax.kmc.kui.uicontrols.data.SearchDirection;
import com.kofax.kmc.kui.uicontrols.data.Symbology;
import com.kofax.mobile.sdk.cordova.plugins.MobileException;

public class BarcodeCaptureAction extends MobileActionBase implements BarCodeFoundListener {
    private static final String TAG = BarcodeCaptureAction.class.getName();

    private BarCodeCaptureView barcodeControl;
    private CallbackContext barcodeCallback;
    private String controlID;

    private static final Map<String, Symbology> barcodeMap;

    static {
        Map<String, Symbology> map = new HashMap<String, Symbology>();
        map.put("code39", Symbology.CODE39);
        map.put("pdf417", Symbology.PDF417);
        map.put("qr", Symbology.QR);
        map.put("datamatrix", Symbology.DATAMATRIX);
        map.put("code128", Symbology.CODE128);
        map.put("code25", Symbology.CODE25);
        map.put("ean", Symbology.EAN);
        map.put("upc", Symbology.UPC);
        map.put("codabar", Symbology.CODABAR);
        map.put("aztec", Symbology.AZTEC);
        map.put("code93", Symbology.CODE93);

        barcodeMap = Collections.unmodifiableMap(map);
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

        if (barcodeControl == null || actionName == ActionNames.CreateBarcodeCaptureControl) {
            barcodeControl = new BarCodeCaptureView(webView.getContext());
            barcodeControl.addBarCodeFoundEventListener(this);
            controlID = null;
        }

        JSONObject layout = args.optJSONObject("Layout");
        adjustView(cordova, layout, barcodeControl);

        JSONObject barcodeOptions = args.optJSONObject("BarcodeOptions");
        if (barcodeOptions != null) {
            JSONArray symbologies = barcodeOptions.optJSONArray("symbologies");
            if (symbologies != null) {
                List<Symbology> symbologyList = new ArrayList<Symbology>(2);
                for (int i = 0; i < symbologies.length(); i++) {
                    String symbology = symbologies.optString(i);
                    if (symbology == null) {
                        Log.w(TAG, String.format("Unrecognized symbology at index %d", i));
                        continue;
                    }

                    Symbology symbol = barcodeMap.get(symbology.toLowerCase(Locale.US));
                    if (symbol != null) {
                        symbologyList.add(symbol);
                    } else {
                        Log.w(TAG, String.format("Unrecognized symbology %s", symbology));
                    }
                }
                barcodeControl.setSymbologies(symbologyList.toArray(new Symbology[symbologyList.size()]));
            }

            int barcodeDirection = barcodeOptions.optInt("searchDirection", -1);
            if (barcodeDirection >= 0) {
                List<SearchDirection> directionList = new ArrayList<SearchDirection>(2);
                // 1 left-to-right, 2 right-to-left, 4 top-to-bottom, 8 bottom-to-top
                if ((barcodeDirection & (0x1 | 0x2)) > 0) {
                    directionList.add(SearchDirection.HORIZONTAL);
                }
                if ((barcodeDirection & (0x4 | 0x8)) > 0) {
                    directionList.add(SearchDirection.VERTICAL);
                }
                barcodeControl.setSearchDirection(directionList.toArray(new SearchDirection[directionList.size()]));
            }

            int guidingLineMode = barcodeOptions.optInt("guidingLineMode", -1);
            switch (guidingLineMode) {
            case -1:
                break;
            case 0:
                barcodeControl.setGuidingLine(GuidingLine.OFF);
                break;
            case 1:
                barcodeControl.setGuidingLine(GuidingLine.LANDSCAPE);
                break;
            case 2:
                barcodeControl.setGuidingLine(GuidingLine.PORTRAIT);
                break;
            default:
                // TODO: error;
                break;
            }
        }

        if (controlID == null) {
            webView.addView(barcodeControl);
            controlID = UUID.randomUUID().toString();
            barcodeControl.readBarcode();
            barcodeCallback = callbackContext;
        }

        JSONObject result = new JSONObject();
        try {
            result.put("id", controlID);
        } catch (JSONException e) {
            assert (false);
        }

        PluginResult pluginResult = new PluginResult(Status.OK, result);
        pluginResult.setKeepCallback(true);
        MobileActionResult actionResult = new MobileActionResult(pluginResult);
        return actionResult;
    }

    @Override
    public boolean requiresUIThread() {
        return true;
    }

    @Override
    public void barCodeFound(BarCodeFoundEvent event) {
        String barcodeValue = event.getBarCode().getValue();
        Log.d(this.getClass().getName(), String.format("Found barcode: %s", barcodeValue));

        JSONObject result = new JSONObject();
        try {
            result.put("barcodeValue", barcodeValue);
        } catch (JSONException e) {
            // Impossible exception - name is valid
        }
        PluginResult pluginResult = new PluginResult(Status.OK, result);

        pluginResult.setKeepCallback(true);
        barcodeCallback.sendPluginResult(pluginResult);

        barcodeControl.readBarcode();
    }

    @Override
    public void destroy(CordovaWebView webView) {
        if (barcodeControl != null) {
            webView.removeView(barcodeControl);
            barcodeControl = null;
            barcodeCallback = null;
        }
    }
}
