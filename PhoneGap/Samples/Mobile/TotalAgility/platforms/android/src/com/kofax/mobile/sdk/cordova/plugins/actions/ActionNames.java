// Copyright (c) 2012-2014 Kofax. Use of this code is with permission pursuant to Kofax license terms.
package com.kofax.mobile.sdk.cordova.plugins.actions;

public class ActionNames {
    public static final String CreateImageCaptureControl = "createImageCaptureControl";
    public static final String CreateImageProcessor = "createImageProcessor";
    public static final String CreateImageReviewControl = "createImageReviewControl";
    public static final String CreateBarcodeCaptureControl = "createBarcodeCaptureControl";

    // Image Capture api
    public static final String ImageCaptureSetOptions = "imageCapture_setOptions";
    public static final String ImageCaptureStartContinuousCapture = "imageCapture_startContinuousCapture";
    public static final String ImageCaptureStopContinuousCapture = "imageCapture_stopContinuousCapture";
    public static final String ImageCaptureTakePhoto = "imageCapture_takePhoto";

    // Image Processor api
    public static final String ImageProcessorProcessImage = "imageProcessor_processImage";
    public static final String ImageProcessorSetOptions = "imageProcessor_setOptions";

    // Image Review api
    public static final String ImageReviewSetOptions = "imageReview_setOptions";

    // Barcode Capture api
    public static final String BarcodeCaptureSetOptions = "barcodeCapture_setOptions";

    // Image api
    public static final String ImageGetBase64ImageData = "image_getBase64ImageData";

    // Spinner API
    public static final String SpinnerSetOptions = "spinner_setOptions";

    public static final String Echo = "echo";
    
    public static final String PluginReset = "plugin_reset";
    public static final String PluginGetNativeVersion = "plugin_getNativeVersion";
}
