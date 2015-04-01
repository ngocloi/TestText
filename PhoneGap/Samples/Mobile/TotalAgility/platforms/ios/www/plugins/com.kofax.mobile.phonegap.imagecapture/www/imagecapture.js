cordova.define("com.kofax.mobile.phonegap.imagecapture.MobileSdk", function (require, exports, module) {
    // Copyright (c) 2012-2014 Kofax.  Use of this code is with permission pursuant to Kofax license terms.
    var pluginExport = (function (window, cordova) {
        var moduleName = "MobileSdk";
        var showAlertOnDebugLog = false;

        var actionNames = {
            // Control creation
            CreateImageCaptureControl: "createImageCaptureControl",
            CreateImageProcessor: "createImageProcessor",
            CreateImageReviewControl: "createImageReviewControl",
            CreateBarcodeCaptureControl: "createBarcodeCaptureControl",

            // Image Capture api
            ImageCaptureSetOptions: "imageCapture_setOptions",
            ImageCaptureStartContinuousCapture: "imageCapture_startContinuousCapture",
            ImageCaptureStopContinuousCapture: "imageCapture_stopContinuousCapture",
            ImageCaptureTakePhoto: "imageCapture_takePhoto",

            // Image Processor api
            ImageProcessorProcessImage: "imageProcessor_processImage",
            ImageProcessorSetOptions: "imageProcessor_setOptions",

            // Image Review api
            ImageReviewSetOptions: "imageReview_setOptions",

            // Barcode Capture api
            BarcodeCaptureSetOptions: "barcodeCapture_setOptions",

            // Image api
            ImageGetBase64ImageData: "image_getBase64ImageData",
            Echo: "echo"
        };

        var errors = {
            ImageCapture_AlreadyExists: "ImageCaptureControl can only be instantiated once."
        };

        // ImageCaptureControl API constructor
        var ImageCaptureControl = function (id) {
            this.id = id;
        };

        // There can only be a single instance of a capture control, which is tracked here.
        var imageCaptureControl;

        // ImageProcessor API constructor
        var ImageProcessor = function (id) {
            this.id = id;
        };

        // ImageReviewControl API constructor
        var ImageReviewControl = function (id) {
            this.id = id;
        };

        // There can only be a single instance of a barcode capture control, which is tracked here.
        var barcodeCaptureControl;

        var BarcodeCaptureControl = function (id) {
            this.id = id;
        };

        var getTimestamp = function () {
            var now = new Date();
            var year = "" + now.getFullYear();
            var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
            var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
            var hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
            var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
            var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
            return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
        };

        // Core plugin API (kofaxMobileSdk)
        var plugin = {
            enable: function () {
                document.addEventListener('deviceready', plugin.loaded, false);
            },
            // Called when the plugin is loaded
            loaded: function () {
                plugin.debugAlert('Loaded module: ' + moduleName);
            },
            // Default success handler for native call
            defaultExecuteSuccess: function (message) {
                plugin.debugAlert("Success: " + message);
            },
            // Default failure handler for native call
            defaultExecuteFailure: function (message) {
                plugin.debugAlert("Fail: " + message);
            },
            // Debug handler to show messages - writes to consone and shows an alert.
            debugAlert: function (message) {
                console.log(message);
                if (showAlertOnDebugLog) {
                    alert(message);
                }
            },
            initLog: function (id) {
                this.logID = id;
            },
            log: function (message) {
                if (this.logID) {
                    var element = window.document.getElementById(this.logID);
                    if (element) {
                        var entry = getTimestamp() + ': ' + message;
                        element.innerHTML = entry + '<br />' + element.innerHTML;
                    }
                }
            },
            // Simple echo function to verify the plugin is working
            echo: function (message) {
                cordova.exec(plugin.defaultExecuteSuccess, plugin.defaultExecuteFailure, moduleName, actionNames.Echo, [message]);
            },
            getVersion: function () {
                return '1.0.0.0.0.0';
            },
            // Actual APIs
            // params - JSON object containing dimensions
            createImageCaptureControl: function (successCallback, errorCallback, params) {
                // Singleton, surround with guard.  If already created, error?.
                if (!imageCaptureControl) {
                    cordova.exec(
                        function (callbackArguments) {
                            imageCaptureControl = new ImageCaptureControl();
                            if (successCallback) {
                                successCallback(imageCaptureControl, callbackArguments);
                            }
                        },
                        plugin.defaultExecuteFailure,
                        moduleName,
                        actionNames.CreateImageCaptureControl,
                        [params]
                    );
                } else {
                    if (errorCallback) {
                        errorCallback(errors.ImageCapture_AlreadyExists);
                    } else {
                        plugin.defaultExecuteFailure(errors.ImageCapture_AlreadyExists);
                    }
                }
            },
            createImageCaptureControlParams: function () {
                return {
                    // Coordinates and size of the control itself
                    Layout: {
                        x: 10,
                        y: 30,
                        width: 135,
                        height: 150,
                        visible: false
                    },
                    // Properties of the frame - see Mobile SDK 2.0 documentation for more detail
                    FrameOptions: {
                        enabled: true,
                        borderColor: 0,
                        borderWidth: 0,
                        outerColor: 0,
                        width: 0,
                        height: 0
                    },
                    // Leveling/stability options - see Mobile SDK 2.0 documentation for more detail
                    LevelingOptions: {
                        enabled: true,
                        levelThresholdPitch: 0,
                        levelThresholdRoll: 0,
                        deviceDeclinationPitch: 0,
                        deviceDeclinationRoll: 0,
                        stabilityDelay: 0
                    },
                    CaptureOptions: {
                        // Enable/disable flash on the camera
                        FlashMode: 0, // 0 off, 1 on, 2 auto
                        ImageCapturedHandler: function (event) {
                        }
                    }
                };
            },
            createImageReviewControl: function (successCallback, errorCallback, params) {
                cordova.exec(
                    function (callbackArguments) {
                        var imageReviewControl = new ImageReviewControl(callbackArguments.id);
                        if (successCallback) {
                            successCallback(imageReviewControl, callbackArguments);
                        }  
                    },
                    plugin.defaultExecuteFailure,
                    moduleName,
                    actionNames.CreateImageReviewControl,
                    [params]
                );
            },
            createImageReviewControlParams: function () {
                return {
                    // Coordinates and size of the control itself
                    Layout: {
                        x: 10,
                        y: 30,
                        width: 135,
                        height: 150,
                        visible: true
                    },
                    ReviewOptions: {
                        // Base64Encoded image
                        Image: '',
                        ImageAcceptedHandler: null,
                        ImageRejectedHandler: null
                    }
                };
            },
            createImageProcessor: function (successCallback, errorCallback, params) {
                cordova.exec(
                    function (callbackArguments) {
                        var imageProcessor = new ImageProcessor(callbackArguments.id);
                        if (successCallback) {
                            successCallback(imageProcessor, callbackArguments);
                        }
                    },
                    plugin.defaultExecuteFailure,
                    moduleName,
                    actionNames.CreateImageProcessor,
                    [params]
                );
            },
            createImageProcessorParams: function () {
                return {
                    ImageProcessingOptions: {
                        desiredColorMode: -2, // -2 automatic, -1 binarize, 0 bw, 1 gray, 2 color
                        desiredResolution: 100,
                        enableCrop: true,
                        enableDeskew: true,
                        enableRotate: true,
                        enableBlankPageRemoval: true,
                        enableCompression: true,
                        compressionQuality: 75,
                        // EVRS string from KTA VRS profile
                        advancedSettings: "",
                        ImageProcessedHandler: function (event) {
                        }
                    }
                };
            },
            createBarcodeCaptureControl: function (successCallback, errorCallback, params) {
                cordova.exec(
                    function(callbackArguments) {
                        var barcodeCaptureControl = new BarcodeCaptureControl(callbackArguments.id);
                        if (successCallback) {
                            successCallback(barcodeCaptureControl, callbackArguments);
                        }
                    },
                    errorCallback,
                    moduleName,
                    actionNames.CreateBarcodeCaptureControl,
                    [params]
                );
            },
            createBarcodeCaptureControlParams: function () {
                return {
                    // Coordinates and size of the control itself
                    Layout: {
                        x: 10,
                        y: 30,
                        width: 135,
                        height: 150,
                        visible: true
                    },
                    // Leveling/stability options - see Mobile SDK 2.0 documentation for more detail
                    LevelingOptions: {
                        enabled: true,
                        levelThresholdPitch: 0,
                        levelThresholdRoll: 0,
                        deviceDeclinationPitch: 0,
                        deviceDeclinationRoll: 0,
                        stabilityDelay: 0
                    },
                    CaptureOptions: {
                        // Enable/disable flash on the camera
                        FlashMode: 0, // 0 off, 1 on, 2 auto
                        ImageCapturedHandler: null
                    },
                    BarcodeOptions: {
                        symbologies: ["PDF417", "Code39"],
                        searchDirection: 0, // flags (bitwise or to combine) 1 left-to-right, 2 right-to-left, 4 top-to-bottom, 8 bottom-to-top
                        guidingLineMode: 0, // 0 off, 1 landscape, 2 portrait
                        BarcodeCapturedHandler: function (event) {
                        }
                    }
                };
            }
        };

        // ImageCaptureControl API definition
        ImageCaptureControl.prototype.setOptions = function (params, successCallback, errorCallback) {
            cordova.exec(
                function (callbackArguments) {
                    if (successCallback) {
                        successCallback(callbackArguments);
                    }
                },
                function (callbackArguments) {
                    if (errorCallback) {
                        errorCallback(callbackArguments);
                    }
                },
                moduleName,
                actionNames.ImageCaptureSetOptions,
                [params]
            );
        };

        ImageCaptureControl.prototype.takePhoto = function (callback) {
            cordova.exec(
               function (callbackArguments) {
                   // On success, call the callback (if specified)
                   if (callback) {
                       callback(callbackArguments);
                   }
               },
               plugin.defaultExecuteFailure,
               moduleName,
               actionNames.ImageCaptureTakePhoto,
               []
           );
        };

        ImageCaptureControl.prototype.startContinuousCapture = function (callback) {
            cordova.exec(
                function (callbackArguments) {
                    // On success, call the callback (if specified)
                    if (callback) {
                        callback(callbackArguments);
                    }
                },
                plugin.defaultExecuteFailure,
                moduleName,
                actionNames.ImageCaptureStartContinuousCapture,
                []
            );
        };

        ImageCaptureControl.prototype.stopContinuousCapture = function () {
            cordova.exec(plugin.defaultExecuteSuccess, plugin.defaultExecuteFailure, moduleName, actionNames.ImageCaptureStopContinuousCapture, []);
        };

        // ImageProcessor API definition
        ImageProcessor.prototype.processImage = function (callback) {
            cordova.exec(
                function (callbackArguments) {
                    if (callback) {
                        callback(callbackArguments);
                    }
                },
                plugin.defaultExecuteFailure,
                moduleName,
                actionNames.ImageProcessorProcessImage,
                []
            );
        };

        ImageProcessor.prototype.setOptions = function (params, successCallback, errorCallback) {
            cordova.exec(
                function (callbackArguments) {
                    if (successCallback) {
                        successCallback(callbackArguments);
                    }
                },
                function (callbackArguments) {
                    if (errorCallback) {
                        errorCallback(callbackArguments);
                    }
                },
                moduleName,
                actionNames.ImageProcessorSetOptions,
                [params]
            );
        };

        // ImageReviewControl API definition
        ImageReviewControl.prototype.setOptions = function (params, successCallback, errorCallback) {
            cordova.exec(
                function (callbackArguments) {
                    if (successCallback) {
                        successCallback(callbackArguments);
                    }
                },
                function (callbackArguments) {
                    if (errorCallback) {
                        errorCallback(callbackArguments);
                    }
                },
                moduleName,
                actionNames.ImageReviewSetOptions,
                [params]
            );
        };

        // BarcodeCaptureControl API definition
        BarcodeCaptureControl.prototype.setOptions = function (params, successCallback, errorCallback) {
            cordova.exec(
                function (callbackArguments) {
                    if (successCallback) {
                        successCallback(callbackArguments);
                    }
                },
                function (callbackArguments) {
                    if (errorCallback) {
                        errorCallback(callbackArguments);
                    }
                },
                moduleName,
                actionNames.BarcodeCaptureSetOptions,
                [params]
            );
        };

        var image = function () {
        };

        image.prototype.getId = function () {
            return this.id;
        };

        image.prototype.getBase64ImageData = function (params) {
            cordova.exec(plugin.defaultExecuteSuccess, plugin.defaultExecuteFailure, moduleName, actionNames.ImageGetBase64ImageData, [params]);
        };

        plugin.loaded();

        return plugin;
    }(window, cordova));
    module.exports = pluginExport;
});
