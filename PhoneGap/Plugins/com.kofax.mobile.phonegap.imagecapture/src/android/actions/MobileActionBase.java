// Copyright (c) 2012-2014 Kofax. Use of this code is with permission pursuant to Kofax license terms.
package com.kofax.mobile.sdk.cordova.plugins.actions;

import org.apache.cordova.CordovaInterface;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.DisplayMetrics;
import android.util.TypedValue;
import android.view.View;
import android.view.ViewGroup.LayoutParams;

public abstract class MobileActionBase implements MobileAction {
    public void adjustView(
            CordovaInterface cordova,
            JSONObject layout,
            View captureView) {
        adjustView(cordova, layout, captureView, null, 0, 0, 0, 0);
    }

    public void adjustView(
            CordovaInterface cordova,
            JSONObject layout,
            View view,
            View offsetView,
            int offsetX,
            int offsetY,
            int frameWidth,
            int frameHeight) {

        // Update from device independent pixels to absolute pixels
        updatePixels(cordova, layout);

        if (layout != null) {
            int width = view.getWidth();
            int height = view.getHeight();

            if (layout.has("height")) {
                height = layout.optInt("height", 0);
            }

            if (layout.has("width")) {
                width = layout.optInt("width", 0);
            }

            int x = view.getLeft();
            int y = view.getTop();

            if (layout.has("x")) {
                x = layout.optInt("x", 0);
                view.setX(x);
                if (offsetView != null) {
                    int framePadding = 0;
                    if (frameWidth > 0) {
                        framePadding = (width - frameWidth) / 2;
                    }

                    offsetView.setX(x + offsetX + framePadding);
                }
            }

            if (layout.has("y")) {
                y = layout.optInt("y", 0);
                view.setY(y);
                if (offsetView != null) {
                    int framePadding = 0;
                    if (frameHeight > 0) {
                        framePadding = (height - frameHeight) / 2;
                    }

                    offsetView.setY(y + offsetY + framePadding);
                }
            }

            LayoutParams layoutParams = view.getLayoutParams();
            if (layoutParams == null) {
                layoutParams = new LayoutParams(width, height);
            } else {
                layoutParams.width = width;
                layoutParams.height = height;
            }
            view.setLayoutParams(layoutParams);

            if (layout.has("visible")) {
                boolean visible = layout.optBoolean("visible");
                view.setVisibility(visible ? View.VISIBLE : View.INVISIBLE);
                if (offsetView != null) {
                    offsetView.setVisibility(visible ? View.VISIBLE : View.INVISIBLE);
                }
            }
        }
    }

    private void updatePixels(CordovaInterface cordova, JSONObject layout) {
        DisplayMetrics metrics = new DisplayMetrics();
        cordova.getActivity().getWindowManager().getDefaultDisplay().getMetrics(metrics);

        if (layout != null) {
            convertLayoutValue(metrics, layout, "x");
            convertLayoutValue(metrics, layout, "y");
            convertLayoutValue(metrics, layout, "width");
            convertLayoutValue(metrics, layout, "height");
        }
    }

    public void updatePixel(CordovaInterface cordova, JSONObject object, String name) {
        DisplayMetrics metrics = new DisplayMetrics();
        cordova.getActivity().getWindowManager().getDefaultDisplay().getMetrics(metrics);

        if (object != null) {
            convertLayoutValue(metrics, object, name);
        }
    }

    private void convertLayoutValue(DisplayMetrics metrics, JSONObject layout, String name) {
        if (layout.has(name)) {
            int x = layout.optInt(name, 0);
            x = convertDipToPixel(metrics, x);
            try {
                layout.put(name, x);
            } catch (JSONException e) {
                // Not possible
            }
        }
    }

    private int convertDipToPixel(DisplayMetrics metrics, int dip) {
        int px = (int) TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, dip, metrics);
        return px;
    }
}
