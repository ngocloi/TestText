cordova.define("com.kofax.cordova.kfxMobilePlugin", function(require, exports, module) {var exec = require('cordova/exec');

var serviceName = "kfxPlugin";
               
var kfxVersion = "1.0.0";

var actionNames = {

        // Image Capture Control Action Names
        addCameraView : "kuiAddCameraView",
        removeCameraView : "kuiRemoveCameraView",
        takePicture : "kuiTakePicture",
        continousCapture : "kuiContinousCapture",
        setImageCaptureOptions : "kuiSetImageCaptureOptions",
        getImageCaptureOptions : "kuiGetImageCaptureOptions",
        addStabilityDelayListener : "kuiAddStablityDelayListener",
        removeStabilityDelayListener : "kuiRemoveStablityDelayListener",
        addLevelnessListener : "kuiAddLevelnessListener",
        removeLevelnessListener : "kuiRemoveLevelnessListener",
        addFocusListener : "kuiAddFocusListener",
        removeFocusListener : "kuiRemoveFocusListener",
        addImageCapturedListener : "kuiAddImageCapturedListener",
        removeImageCapturedListener : "kuiRemoveImageCapturedListener",
        addPageDetectionListener:"kuiAddPageDetectionListener",
        removePageDetectionListener:"kuiRemovePageDetectionListener",

        // Barcode Capture Control Action Names
        addBarcodeView : "kbcAddView",
        removeBarcodeView : "kbcRemoveView",
        setBarcodeOptions : "kbcSetOptions",
        getBarcodeOptions : "kbcGetOptions",
        readBarcode : "kbcReadBarcode",
        kbcAddEventListener : "kbcAddEventListener",
        kbcRemoveEventListener : "kbcRemoveEventListener",

        //Image Array Action Names
        getTotalImages:"kedGetTotalImages",
        getImageIds:"kedGetImageIds",
        getImagePropertiesWithId:"kedGetImageProperties",
        getImageFromBase64:"kedGetImageFromBase64",
        getImageFromFilepath:"kedGetImageFromFilePath",
        getBase64ImageWithId:"kedGetImageToBase64",
        removeImages:"kedRemoveImages",
        setImagePropertiesWithId:"kedSetImageProperties",

        // License Action Names
        setSDKLicense : "kutSetMobileSDKLicense",
        getDaysRemaining : "kutGetDaysRemaining",
        getSDKVersions: "kutGetSDKVersions",

        // ImageEditReview Names
        addImageReviewEditView : "kuiAddImageReviewView",
        removeImageReviewEditView : "kuiRemoveImageReviewView",
        setImageReviewEditOptions : "kuiSetImageReviewEditOptions",
        getImageReviewEditOptions : "kuiGetImageReviewEditOptions",
        getImage : "kuiGetImage",
        setImage : "kuiSetImage",

        // Image Processor Action Names
        processImage : "kenProcessImage",
        cancelImageProcess : "kenCancelImageProcess",
        setImageProcessorOptions : "kenImageProcessorSetOptions",
        getImageProcessorOptions : "kenImageProcessorGetOptions",
        doQuickAnalysis : "kenImageProcessorDoQuickAnalysis",
        specifyProcessedImageFilePath : "kenSpecifyProcessedImageFilePath",
        getProcessedImageFilePath:"kenGetProcessedImageFilePath",
        addImageOutEventListener : "kenImageProcessorAddImageOutEventListener",
        addProcessProgressListener : "kenImageProcessorAddProcessProgressListener",
        addAnalysisCompleteListener : "kenImageProcessorAddAnalysisCompleteListener",
        addAnalysisProgressListener : "kenImageProcessorAddAnalysisProgressListener",
        removeImageOutEventListener : "kenImageProcessorRemoveImageOutEventListener",
        removeProcessProgressListener : "kenImageProcessorRemoveProcessProgressListener",
        removeAnalysisCompleteListener : "kenImageProcessorRemoveAnalysisCompleteListener",
        removeAnalysisProgressListener : "kenImageProcessorRemoveAnalysisProgressListener"
};

//License constructor and corresponding methods
var License = function(){
    
};

/// To set the License of the native SDK.
/** Method to set the License of the native SDK.
 
 The input to this method is the VRS license string. If the license string is valid and days remain in the license, this method returns KMC_SUCCESS .
 If the license string is valid but no days remain in the license, this method returns KMC_IP_LICENSE_EXPIRED. If the license string is not valid, this method returns KMC_IP_LICENSE_INVALID.
 Any failure to set the license would automatically set the daysRemaining to zero.The license can only be set once.
 
 @param successCB: Default Success call back function name
 @param errorCB: Default Error call back function name
 @param License: is the valid license string that was contained in a distributed header file that you received from Kofax.
 
 
 @return
 The return value is captured in the 'successCB' for a successful operation, and might return in 'errorCB' for an incomplete/invalid operation. Returns the following values in the corresponding functions
 successCB :  KMC_SUCCESS    The license string was set successfully .
 errorCB :    KMC_IP_LICENSE_INVALID if the license string used is nil.
 KMC_IP_LICENSE_ALREADY_SET if you have already set the license.
 EVRS_IP_LICENSING_FAILURE if the license string is invalid for setting a license.
 EVRS_IP_LICENSE_EXPIRATION_ERROR if the time limit of your license has expired.
 
 Example code follows showing how to set your license.
 
 @code
 var LicenseStr = 'pasteyourlicensestringhere!';
 function mySucessCB(result){
 alert(result);
 }
 function myerrorCB(error){
 alert(JSON.stringify(error));
 }
 
 var LicObj = kfxCordova.kfxUtilities.createLicense();
 LicObj.setMobileSDKLicense(mySucessCB,myerrorCB,LicenseStr);
 @endcode
 */
License.prototype.setMobileSDKLicense = function(successCallback,errorCallback,parameters){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.setSDKLicense,
         [parameters]
     );
};

/// To get  the number of days the License of the SDK is valid
/** Method to get the remaining  days that the SDK license would be valid to use.

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name


@return The return value is captured in the 'successCB' function and will be having the number of valid days for a valid license.
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code
function mySucessCB(numofdays){
    alert(numofdays);
}
function myerrorCB(error){
    alert(JSON.stringify(error));
}

var LicObj = kfxCordova.kfxUtilities.createLicense();
LicObj.setMobileSDKLicense(mySucessCB,myerrorCB,LicenseStr);
LicObj.getDaysRemaining(mySucessCB,myerrorCB);
@endcode
*/
License.prototype.getDaysRemaining = function(successCallback,errorCallback){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.getDaysRemaining,
         []
     );
};
               
License.prototype.getSDKVersions = function(successCallback,errorCallback){
    exec(
        function(result){
           if(successCallback)
               successCallback(result);
        },
        function(error){
           if(errorCallback)
               errorCallback(error);
        },
        serviceName,
        actionNames.getSDKVersions,
        []
    );
};
//End of License Methods

/// The Plugin object for the native BarCodeCapture Control  
/**  This BarCodeview is responsible for handling the corresponding plugin js to interact with the native BarCodeCaptureControl
To set and get the properties, and to access the instance methods, corresponding JS methods are written under this class which  
are used by the  end user in application script.
 */
var BarcodeCaptureControl = function(){
    
};

/// To set the Options/properties of the BarCodeCaptureControl class .
/** Method to set the properties of the native BarCodeCaptureControl class.

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name
@param params:  a 'barcodeCaptureControlParams'  variable conting the properties  to be set to the BarCodeCaptureControl

@return The return value is captured in the 'successCB' function and for a successful operation result is a 0(zero).
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code
var barCodeCaptureControl = kfxCordova.kfxUicontrols.createBarcodeCaptureControl();

var  barcodeCaptureControlParams =  barCodeCaptureControl.getBarcodeCaptureControlparameters();
barcodeCaptureControlParams.searchDirection = "VERTICAL";
barcodeCaptureControlParams.symbologies = ["CODE39", "PDF147"];
barcodeCaptureControlParams.guidingLine = "LANDSCAPE";

barCodeCaptureControl.setOptions(mySucessCB,myerrorCB,barcodeCaptureControlParams);
@endcode
*/
BarcodeCaptureControl.prototype.setOptions = function(successCallback,errorCallback,parameters){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.setBarcodeOptions,
         [parameters]
     );
};

/// To get the Options/properties of the BarCodeCaptureControl class .
/** Method to get the properties of the native BarCodeCaptureControl class.

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name

@return The return value is captured in the 'successCB' function and will have the  'barcodeCaptureControlParams'
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code

function mySucessCB(options){
    alert(JSON.stringify(options));
    // Optionally you can get the properties and map to the application UI to show the user 
}

var barCodeCaptureControl = kfxCordova.kfxUicontrols.createBarcodeCaptureControl();

barCodeCaptureControl.getOptions(mySucessCB,myerrorCB);

@endcode
 */
BarcodeCaptureControl.prototype.getOptions = function(successCallback,errorCallback){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.getBarcodeOptions,
         []
     );
};

///  Reads a single barcode from the camera preview. 
/** This call returns immediately and starts asynchronously searching for a barcode with the current camera and barcode parameters. The search will continue indefinitely until a barcode is found, allowing time for the device to further stabilize and focus if necessary.

Once a barcode is positively read, the event listener "addEventListener" will be invoked and the results are in the event listener success call back.
License Required: This is a licensed method. You cannot use this method until you have set a valid SDK license.

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name


@return 
    The return value is captured in the 'successCB' for a successful operation, and might return in 'errorCB' for an incomplete/invalid operation. Returns the following values in the corresponding functions
    successCB :  KMC_SUCCESS    The bar code was successfully read. 
    errorCB :    KMC_EV_LICENSING The bar code was not set successfully read, and returned the licensing error code.
    
     //ANDROID- no success and error codes mentioned in doxygen for android
    
The barcode result is returned in the success call back of the event listener listed below. 
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code

var barCodeCaptureControl = kfxCordova.kfxUicontrols.createBarcodeCaptureControl();
barCodeCaptureControl.readBarcode(mySucessCB,myerrorCB);
@endcode
 */
BarcodeCaptureControl.prototype.readBarcode = function(successCallback,errorCallback){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.readBarcode,
         []
     );
};

/// Method to add the   BarCodeReader view to the screen method 
/** Method to add the BarCodeReader view to the screen. This method is responsible for adding the view on the visisble screen 
with the specified Layout values.

@param successCB: Default Success Call back function name
@param errorCB: Default Error call back function name
@param params: a 'Layout' object mentioning the Frame values for the BarCodeReader object. Refere to 'Layout' object for 
containing values.

@return The return value is captured in the 'successCB' function and will have a zero(0) for successful operation.

@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code
var Layout = kfxCordova.getLayoutProperties();
var point1 = kfxCordova.getPointProperties();
Layout.x = 10;
Layout.y =10;
Layout.width= 300;
Layout.height = 400;
Layout.visibility = true; // By default visibility is 'true'

var barCodeCaptureControl = kfxCordova.kfxUicontrols.createBarcodeCaptureControl();

barCodeCaptureControl.addView(mySucessCB,myerrorCB, Layout);

@endcode
 */
BarcodeCaptureControl.prototype.addView = function(successCallback,errorCallback,parameters){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.addBarcodeView,
         [parameters]
     );
};

/// Method to remove the   BarCodeReader view off the screen  
/** Method to remove  the BarCodeReader view off the screen. This method is responsible for removing and making it nill.

@param successCB: Default Success Call back function name
@param errorCB: Default Error call back function name


@return The return value is captured in the 'successCB' function and will have a zero(0) for successful operation.

@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code
var barCodeCaptureControl = kfxCordova.kfxUicontrols.createBarcodeCaptureControl();
barCodeCaptureControl.removeView(mySucessCB,myerrorCB);
@endcode
*/
BarcodeCaptureControl.prototype.removeView = function(successCallback,errorCallback){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.removeBarcodeView,
         []
     );
};

/// Method to add the event listener to the 'readBarcode' method of the   BarCodeReader 
/** The get the result back from the 'readBarcode' method's delegate, this method would be added as listner
And the corresponding result from the delegate are returned in the  success call back.

@param successCB: Default Success Call back function name, called when the event is registered successfully
@param errorCB: Default Error Call back function name
@param barcodeCallback: function variable to hold the return value once the event is triggered


@return The return value is captured in the 'successCB' function and will have a zero(0) for successful event registered.
The 'barcodeCallback' will have the barcode data read from the barcode. The following is th eformat of the result.

JSON object:
{
    boundingBox =     {
        bottomLeft =         {
            x = "279.0027";
            y = "238.6505";
        };
        bottomRight =         {
            x = "285.7726";
            y = "813.2451";
        };
        topLeft =         {
            x = "348.4976";
            y = "232.2123";
        };
        topRight =         {
            x = "355.2836";
            y = "832.2803";
        };
    };
    dataFormat = "BASE_64";
    direction = "TOP_DOWN";
    imageID = "A1315979-F12F-4A0B-B9C7-3B12086EAB7C";
    type = PDF417;
    value = "barcoderesultstring";
}

@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code
var barCodeCaptureControl = kfxCordova.kfxUicontrols.createBarcodeCaptureControl();

barCodeCaptureControl.addEventListener(mySucessCB,myerrorCB,barcodeCallback);
@endcode
*/
BarcodeCaptureControl.prototype.addEventListener = function(successCallback,errorCallback,barcodeCallback){
    exec(
         function(result){
             if(result.eventType === "eventRegistered"){
                if(successCallback)
                    successCallback(result);
             }else if(result.eventType === "eventRaised"){
                if(barcodeCallback)
                    barcodeCallback(result);
             }
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.kbcAddEventListener,
         []
     );
};

/// Method to remove the event listener to the 'readBarcode' method of the   BarCodeReader 
/** The method would remove the listener to the delegate call back of the readbarcode method. After removing the listener, 
there will not be any call backs from native from the 'readbarcode' delegate methods though it is being called at native.

@param successCB: Default Success Call back function name
@param errorCB: Default Error Call back function name


@return The return value is captured in the 'successCB' function and will have a zero(0) for successful operation. 
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code

// create your bar code object
var barCodeCaptureControl = kfxCordova.kfxUicontrols.createBarcodeCaptureControl();

// read your bar code..

//to reove the barcodereader listener 

barCodeCaptureControl.removeEventListener(mySucessCB,myerrorCB);
@endcode
*/
BarcodeCaptureControl.prototype.removeEventListener = function(successCallback,errorCallback){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.kbcRemoveEventListener,
         []
     );
};
/// A getter  method of properties of the 'BarCodeCaptureControl' class
/**  Method returning the BarCode properties that can be set by the user. Use this object as an input parameter to set the 
properties of the BarCodeCaptureControl. 
 */
BarcodeCaptureControl.prototype.getBarcodeCaptureControlparameters = function() {
    var barcodeCaptureControlparameters = {
        /// The set of directions currently being searched for barcodes
            /**  Searching multiple directions slows down the speed of barcode recognition. If you expect barcodes to only be oriented in certain directions, you should specify only those directions. By default, all directions will be searched, 
        represented by the array ["HORIZONTAL", "VERTICAL"]. 
             */
        searchDirection:[],

        /// The set of symbologies currently being searched for. 
            /**  Searching for multiple symbologies slows down the speed of barcode recognition. You should only specify the symbologies that you are interested in reading. The set of selected symbologies is empty by default. 
        Acceptable values are: "code39", "pdf417", "qr", "datamatrix", "code128", "code25", "ean", "upc", "codabar", "aztec" and "code93".
             */
        symbologies:[],

        /// A Guiding line to align the barcode(s)
            /**  The guiding line is a visual aid for aligning barcodes within the preview. A guiding line is rendered as a straight line splitting the preview into two equal parts. The intention is for the line to cross through all the bars of a barcode, like the laser of a linear scanner. 
        The guiding line is turned off by default. 
        Acceptable values are: "OFF", "LANDSCAPE", and "PORTRAIT". 
             */
        guidingLine:"OFF"
    };
    return barcodeCaptureControlparameters;
};
//End of BarcodeCaptureControl methods

/// The Plugin object for the native ImageCaptureControl class  
/**  This ImageCaptureControl class is responsible for handling the corresponding plugin js to interact with the native ImageCaptureControl 
class. To set and get the properties, and to access the instance methods, corresponding JS methods are written under this class which  
are used by the  end user in application script.
 */

//ImageCaptureControl constructor and corresponding methods
var ImageCaptureControl = function(){
    
};

/// Method to add the   ImageCaptureControl view to the screen method 
/** Method to add the ImageCaptureControl view to the screen. This method is responsible for adding the view on the visisble screen 
with the specified Layout values.

@param successCB: Default Success Call back function name
@param errorCB: Default Error call back function name
@param params: a 'Layout' object mentioning the Frame values for the ImageCaptureControl object. Refere to 'Layout' object for 
containing values.

@return The return value is captured in the 'successCB' function and will have a zero(0) for successful operation.

@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code
var Layout = kfxCordova.getLayoutProperties();
var point1 = kfxCordova.getPointProperties();
Layout.x = 10;
Layout.y =10;
Layout.width= 300;
Layout.height = 400;
Layout.visibility = true; // By default visibility is 'true'

var imgCaptureControl =  kfxCordova.kfxUicontrols.createImageCaptureControl();
imgCaptureControl.addCameraView(mySucessCB,myerrorCB, Layout);
@endcode
*/
ImageCaptureControl.prototype.addCameraView = function(successCallback, errorCallback, parameters){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.addCameraView,
         [parameters]
     );
};

/// Begins the image capture process. 
/** Calling this method will start the process of monitoring the various sensors to determine when a level, focused, and non-blurry shot of the document can be taken. The default level indicator will not be rendered unless the levelIndicator property is set to true. 
The event listener  "addImageCapturedListener" will receive the delegate call back message and will have the corresponding capture image details.

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name


@return The return value is captured in the 'successCB' for a successful operation, and might return in 'errorCB' for an incomplete/invalid operation. Returns the following values in the corresponding functions
    successCB :  KMC_SUCCESS    The picture was successfully captured. 
    errorCB :    KMC_EV_LICENSING The picture was not successfully captured, and returns the licensing error code. 

    //ANDROID- no success and error codes mentioned in doxygen for android

@see 

@code

var imgCaptureControl =  kfxCordova.kfxUicontrols.createImageCaptureControl();

imgCaptureControl.takePicture(mySucessCB,myerrorCB);
@endcode
*/
ImageCaptureControl.prototype.takePicture = function(successCallback,errorCallback){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.takePicture,
         []
     );
};

/// Starts or stops the continuous capture of images.  
/** Calling this method will start or stop the continuous capture of images. Images will automatically be captured when levelness and stability criteria are satisfied. Between each image capture event, the device must be tilted away from its set device declination. This signals the device to capture a new image when levelness and stability criteria are again satisfied.

Continuous mode can only be enabled when the levelness thresholds for pitch and roll are less than 75 degrees.

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name
@param parameters: a BOOL value whether to enable continoue capture or not


@return The return value is captured in the 'successCB' for a successful operation, and might return in 'errorCB' for an incomplete/invalid operation. Returns the following values in the corresponding functions
    successCB :  KMC_SUCCESS    The picture was successfully captured. 
    errorCB :    KMC_EV_LICENSING The picture was not successfully captured, and returns the licensing error code. 

    //ANDROID- no success and error codes mentioned in doxygen for android

@see 

@code

var imgCaptureControl =  kfxCordova.kfxUicontrols.createImageCaptureControl();

imgCaptureControl.continousCapture(mySucessCB,myerrorCB,true);
@endcode
*/

ImageCaptureControl.prototype.continousCapture = function(successCallback, errorCallback, parameters){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.continousCapture,
         [parameters]
     );
};

/// This method will add an event listener which will be triggered whenever a picture is taken.
/** A listener that will be called when an image was captured. This will only be sent after the control receives a takePicture message.
The control will wait until the desired stability, levelness, and camera adjustments are met and then capture an image. It would then send the
imageID of the captured image to success call back method.

Add this event listener before calling the 'takePicture' method.

@param successCB: Default Success Call back function name
@param errorCB: Default Error Call back function name
@param imageCaptureCallback: A JSON object containg the properties of the captured image object. Check the 'Image'  object for its properties.


@return The return value is captured in the 'successCB' function and will have a zero(0) for successful operation. 
The 'imageCaptureCallback' will have the JSON object of the captured KfxKEDImage propeties. The captured KEDImage is stored in ImageArray
which will return thr images on thier imageids, and the captured image(KEDImage)'s ID(string) is returned for furthur processing.

@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. by Default,  the error call back 
would return a JSON object giving ErrMsg & ErrDesc  giving the description of the error.

@code
function mysucessCB(imageid)
{
    // imageid is a string variable;
    alert(imageid);
}

var imgCaptureControl =  kfxCordova.kfxUicontrols.createImageCaptureControl();

imgCaptureControl.addImageCapturedListener(mysucessCB,myerrorCB, imageCaptureCallback);
@endcode
*/
ImageCaptureControl.prototype.addImageCapturedListener = function(successCallback,errorCallback,imageCaptureCallback){
    exec(
         function(result){
             if(result.eventType === "eventRegistered"){
                if(successCallback)
                    successCallback(result);
             }else if(result.eventType === "eventRaised"){
                var imgObject = new ImageObject(result);
                if(imageCaptureCallback)
                    imageCaptureCallback(imgObject);
             }
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.addImageCapturedListener,
         []
     );
};

/// Method to remove the event listener to the 'takePicture' method of the   ImageCaptureControl 
/** The method would remove the listener to the delegate call back of the takePicture method. After removing the listener, 
there will not be any call backs from native from the 'takePicture' delegate methods even when  it is being called in native.

@param successCB: Default Success Call back function name
@param errorCB: Default Error Call back function name


@return The return value is captured in the 'successCB' function and will have a zero(0) for successful operation. 
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code

var imgCaptureControl =  kfxCordova.kfxUicontrols.createImageCaptureControl();
// after taking picture
imgCaptureControl.removeImageCapturedListener(mySucessCB,myerrorCB);
@endcode
*/
ImageCaptureControl.prototype.removeImageCapturedListener = function(successCallback,errorCallback){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.removeImageCapturedListener,
         []
     );
};

/// Method to add the event listener to the 'Stabilitydelay' changed delegate method of the   ImageCaptureControl 
/** This method would receive the Stability delay changed/updated at the ImageCaptureControl and the new corresponding details 
are captured in success call back.

@param successCB: Default Success Call back function name
@param errorCB: Default Error Call back function name
@param stabilityCallback: a JSON object returning the current stability od the device


@return The return value is captured in the 'successCB' function and will have a zero(0) for successful registering of the event.
 'stabilityCallback' will have the current stability of the device.

Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. by Default,  the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.
@see 
@code
var imgCaptureControl =  kfxCordova.kfxUicontrols.createImageCaptureControl();
imgCaptureControl.addStabilityDelayListener(mysucessCB,myerrorCB,stabilityCallback);
@endcode
*/
ImageCaptureControl.prototype.addStabilityDelayListener = function(successCallback,errorCallback,stabilityCallback){
    exec(
         function(result){
             if(result.eventType === "eventRegistered"){
                if(successCallback)
                    successCallback(result);
             }else if(result.eventType === "eventRaised"){
                if(stabilityCallback)
                    stabilityCallback(result);
             }
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.addStabilityDelayListener,
         []
     );
};

/// Method to remove the event listener to the  'Stabilitydelay' changed delegate method of the ImageCaptureControl 
/** The method would remove the listener and would not receive the Stability delay changed/updated. After removing the listener, 
there will not be any call backs from native .

@param successCB: Default Success Call back function name
@param errorCB: Default Error Call back function name


@return The return value is captured in the 'successCB' function and will have a zero(0) for successful operation. 
 Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.
@see
@code

// Create an ImageCaptureControl obj
var imgCaptureControl =  kfxCordova.kfxUicontrols.createImageCaptureControl();

// to remove the stability listener
imgCaptureControl.removeStabilityDelayListener(mySucessCB,myerrorCB);
@endcode
*/
ImageCaptureControl.prototype.removeStabilityDelayListener = function(successCallback,errorCallback){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.removeStabilityDelayListener,
         []
     );
};

/// Method to add the event listener to the 'Levelness' changed delegate method of the   ImageCaptureControl 
/** This method would receive the levelness at the ImageCaptureControl and the new corresponding details 
are captured in success call back.

@param successCB: Default Success Call back function name
@param errorCB: Default Error Call back function name
@param levelnessCallback: a JSON variable to hold the levelness of device


@return The return value is captured in the 'successCB' function and will have a zero(0) for successful event registration.
 'levelnessCallback' is JSON object returned for every levelness  chanegd event, and contains the current levelness of the device.

Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. by Default,  the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.
@see 

@code
var imgCaptureControl =  kfxCordova.kfxUicontrols.createImageCaptureControl();
imgCaptureControl.addLevelnessListener(mysucessCB,myerrorCB,levelnessCallback);
@endcode
*/
ImageCaptureControl.prototype.addLevelnessListener = function(successCallback,errorCallback,levelnessCallback){
    exec(
         function(result){
             if(result.eventType === "eventRegistered"){
                if(successCallback)
                    successCallback(result);
             }else if(result.eventType === "eventRaised"){
                if(levelnessCallback)
                    levelnessCallback(result);
             }
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.addLevelnessListener,
         []
     );
};

/// Method to remove the event listener to the  'Levelness' changed delegate method of the ImageCaptureControl 
/** The method would remove the listener and would not receive the Stability delay changed/updated. After removing the listener, 
there will not be any call backs from native .

@param successCB: Default Success Call back function name
@param errorCB: Default Error Call back function name


@return The return value is captured in the 'successCB' function and will have a zero(0) for successful operation. 
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code
var imgCaptureControl =  kfxCordova.kfxUicontrols.createImageCaptureControl();
imgCaptureControl.removeLevelnessListener(mySucessCB,myerrorCB);
@endcode
*/
ImageCaptureControl.prototype.removeLevelnessListener = function(successCallback,errorCallback){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
             if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.removeLevelnessListener,
         []
     );
};

/// Method to add the event listener to the 'AutoFocus' changed delegate method of the   ImageCaptureControl 
/** This method would receive the AutoFocus at the ImageCaptureControl and the new corresponding details 
are captured in success call back.

@param successCB: Default Success Call back function name
@param errorCB: Default Error Call back function name
@param focusCallback: a var to hold the focus value returned from the ImageCaptureControl


@return The return value is captured in the 'successCB' function and will have a zero(0) for successful event registration.
'focusCallback' will have the JSON object giving the current focuslevel of the Camera, whenever focus changes the value will be changing. 


@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. by Default,  the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code
var imgCaptureControl =  kfxCordova.kfxUicontrols.createImageCaptureControl();
imgCaptureControl.addFocusListener(mysucessCB,myerrorCB,focusCallback);
@endcode
*/
ImageCaptureControl.prototype.addFocusListener = function(successCallback,errorCallback,focusCallback){
    exec(
         function(result){
             if(result.eventType === "eventRegistered"){
                if(successCallback)
                    successCallback(result);
             }else if(result.eventType === "eventRaised"){
                focusCallback(result);
             }
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.addFocusListener,
         []
     );
};

/// Method to remove the event listener to the  'AutoFocus' changed delegate method of the ImageCaptureControl 
/** The method would remove the listener and would not receive the AutoFocus. After removing the listener, 
there will not be any call backs from native .

@param successCB: Default Success Call back function name
@param errorCB: Default Error Call back function name


@return The return value is captured in the 'successCB' function and will have a zero(0) for successful operation. 
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code
var imgCaptureControl =  kfxCordova.kfxUicontrols.createImageCaptureControl();
imgCaptureControl.removeFocusListener(mySucessCB,myerrorCB);
@endcode
*/
ImageCaptureControl.prototype.removeFocusListener = function(successCallback,errorCallback){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.removeFocusListener,
         []
     );
    
};

/// Method to add the event listener to the 'Page detection' changed delegate method of the   ImageCaptureControl 
/** This method would receive the Page detection at the ImageCaptureControl and the new corresponding details 
are captured in success call back.

@param successCB: Default Success Call back function name
@param errorCB: Default Error Call back function name
@param pageDetectionCallback: a var to hold the pageDetection params returned by CaptureControl object


@return The return value is captured in the 'successCB' function and will have a zero(0) for successful event registration.
'pageDetectionCallback' a JSON object returned whenever a page is detected and will have the boundaries of the detected page. 


@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. by Default,  the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code
var imgCaptureControl =  kfxCordova.kfxUicontrols.createImageCaptureControl();

imgCaptureControl.addPageDetectionListener(mysucessCB,myerrorCB,pageDetectionCallback);
@endcode
*/ 
ImageCaptureControl.prototype.addPageDetectionListener = function(successCallback,errorCallback,pageDetectionCallback){
    exec(
         function(result){
             if(result.eventType === "eventRegistered"){
                if(successCallback)
                    successCallback(result);
             }else if(result.eventType === "eventRaised"){
                pageDetectionCallback(result);
             }
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.addPageDetectionListener,
         []
     );
};

/// Method to remove the event listener to the  'Page detection' changed delegate method of the ImageCaptureControl 
/** The method would remove the listener and would not receive the Page detection events. After removing the listener, 
there will not be any call backs from native .

@param successCB: Default Success Call back function name
@param errorCB: Default Error Call back function name


@return The return value is captured in the 'successCB' function and will have a zero(0) for successful operation. 
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code
var imgCaptureControl =  kfxCordova.kfxUicontrols.createImageCaptureControl();
imgCaptureControl.removePageDetectionListener(mySucessCB,myerrorCB);
@endcode
*/ 
ImageCaptureControl.prototype.removePageDetectionListener = function(successCallback,errorCallback){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.removePageDetectionListener,
         []
     );
    
};

/// To set the Options/properties of the ImageCaptureControl class .
/** Method to set the properties of the native ImageCaptureControl class.

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name
@param params:  a 'imageCaptureViewOptions'  variable conting the properties  to be set to the ImageCaptureControl 

@return The return value is captured in the 'successCB' function and for a successful operation result is a 0(zero).
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code

// create the Capture Control Object
var imgCaptureControl =  kfxCordova.kfxUicontrols.createImageCaptureControl();

// get default options object

var  ImageCaptureViewOptions =  imgCaptureControl.getImageCaptureViewOptions();
// specify the values for the Capture view settings/properties
ImageCaptureViewOptions.FrameOptions.enabled=false;
...

// set the options to capture view
imgCaptureControl.setOptions(successCB,errorCB,ImageCaptureViewOptions)

@endcode
*/ 
ImageCaptureControl.prototype.setOptions = function(successCallback,errorCallback,parameters){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.setImageCaptureOptions,
         [parameters]
     );
};

/// To get the Options/properties of the ImageCaptureControl class .
/** Method to get the properties of the native ImageCaptureControl class.

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name

@return The return value is captured in the 'successCB' function and will have the  'imageCaptureViewOptions' object
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code

function mySucessCB(options){
    alert(JSON.stringify(options));
    // Optionally you can get the properties and map to the application UI to show the user 
}

var imgCaptureControl =  kfxCordova.kfxUicontrols.createImageCaptureControl();

imgCaptureControl.getOptions(mySucessCB,myerrorCB);
@endcode
*/
ImageCaptureControl.prototype.getOptions = function(successCallback,errorCallback){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.getImageCaptureOptions,
         []
     );
};

/// Method to remove the   ImageCaptureControl view off the screen  
/** Method to remove  the ImageCaptureControl view off the screen. This method is responsible for removing and making it nill.

@param successCB: Default Success Call back function name
@param errorCB: Default Error call back function name


@return The return value is captured in the 'successCB' function and will have a zero(0) for successful operation.

@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code

// Create a ImageCaptureControl object

var imgCaptureControl =  kfxCordova.kfxUicontrols.createImageCaptureControl();

imgCaptureControl.removeCameraView(mySucessCB,myerrorCB);
@endcode
*/
ImageCaptureControl.prototype.removeCameraView = function(successCallback,errorCallback){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.removeCameraView,
         []
     );
};
///A getter  method of properties of the 'ImageCaptureControl' class
/**  Method returning the 'ImageCaptureControl'  class properties that can be set by the user. Use this object as an input 
parameter to set the properties of the ImageCaptureControl class. The parameters are grouped, and has the below mentioned 
default values. 
 */
ImageCaptureControl.prototype.getImageCaptureViewOptions = function(){
    var imageCaptureViewOptions = {
        FrameOptions: {
             /// This variable defines a frame that can be applied to a capture control. 
            /**  This class is responsible for defining a frame that will be drawn in a capture control to indicate the desired size of the target image inside of a capture control. 
            */
            enabled: true,

            /// The color of the border.  
            /**  A color that is used to draw the border around the visible area of the frame. A hex value for a colour to be provided as values which would be converted to RGB/ARGB as per platform(iOS/Android)
            */
            borderColor: "#FF0000",

            /// The width of the border. 
            /**  A line width in pixel units that sets the width of the border that is drawn around the visible area of the frame 
            */
            borderWidth: 3.0,

            /// The color of the frame.  
            /**  A color that is used to the area outside the visible area to the edges of the control. A hex value for a colour to be provided as values which  would be converted to RGB/ARGB as per platform(iOS/Android)
             */
            outerColor: "#FFFF00",

            /// The width of the visible area of the frame  in pixel units..   
            /**  The width of the area inside the frame in points that represents the visible area. It will be centered inside the area of the control that it is set on and the area outside this size will be colored using the borderColor and the outerColor;   
             */
            width: 0,
            /// The height of the visible area of the frame in pixel units.   
            /**  The height of the area inside the frame in points that represents the visible area. 
             */
            height: 0
        },
        LevelingOptions: {
            /// Whether the level indicator is enabled.    
            /**  A boolean that indicates whether the level indicator is enabled. 
             */
            enabled: true,

            /// The threshold to use determine if the device is level enough.     
            /**  An angle in degrees that is used when comparing the actual pitch of the device to the deviceDeclinationPitch. If the difference is less than the threshold, the device is considered level with respect to pitch. The default value is 7.
            Valid values are in the range [0, 45]. Values outside this range will be interpreted as 0 or 45. A value of 45 disables level checking for pitch.  
             */
            levelThresholdPitch: 7,

            /// The threshold to use determine if the device is level enough.     
            /**  An angle in degrees that is used when comparing the actual roll of the device to the deviceDeclinationRoll. If the difference is less than the threshold, the device is considered level with respect to roll. The default value is 7.
            Valid values are in the range [0, 45]. Values outside this range will be interpreted as 0 or 45. A value of 45 disables level checking for roll. 
             */
            levelThresholdRoll: 7,

            /// The reference pitch that indicates what angle means that the device is level.      
            /**  A property to get or set an angle in degrees that will be used to determine that the device is level. The default value is 0, which indicates that the top and bottom of the device are in the same horizontal plane. A positive value indicates that the top of the device should be higher than the bottom for the device to be considered level, 
            and a negative value means that the bottom should be higher.  
             */
            deviceDeclinationPitch: 0,

            /// The reference roll that indicates what angle means that the device is level.     
            /**  A property to get or set an angle in degrees that will be used to determine that the device is level. The default value is 0, which indicates that the left and right sides of the device are in the same horizontal plane. A positive value indicates that the left side of the device should be higher than the right for the device to be considered level, 
            and a negative value means that the right side should be higher.   
             */
            deviceDeclinationRoll: 0,

            /// The current stability delay.      
            /**  A property to get or set an angle in degrees that will be used to determine that the device is level. The default value is 0, which indicates that the left and right sides of the device are in the same horizontal plane. A positive value indicates that the left side of the device should be higher than the right for the device to be considered level, 
            and a negative value means that the right side should be higher.   
             */
            //ANDROID
            /**The stability delay property is a threshold that determines how stable the device has to be before an image will captured. 
             *  Valid values are in the range [0, 100], where 0 is completely unstable and 100 is completely stable. 
             *  A setting of 0 will turn off stability checking, and in practice a device will rarely be stable enough to satisfy a value of 100. 
             *  The default setting is 75.
             *  */
            stabilityDelay: 75,

            /// The color used by the level indicator to show the device is out of focus.     
            /**  The level indicator will be drawn with this color when the device is trying to focus or unable to focus. If the device is out of level or unstable in addition to being out of focus, those indicator colors take precedence.  
            All color values(hexvalues) are valid. This status color defaults to yellow. 
             */
            indicatorColorFocusing:"#FFFF00",

            /// The color used by the level indicator to show the device is level, stable, and focused.    
            /**  The level indicator will be drawn with this color when the device is within acceptable thresholds for levelness, stability, and focus.
            All color values(hexvalues)  are valid. This status color defaults to green.  
             */
            indicatorColorGood:"#008000",

             /// The color used by the level indicator to show the device is not level.     
            /**  The level indicator will be drawn with this color when the device is tilted outside the limits of the level thresholds for pitch and roll. This indicator color takes precedence over stability and focus, if the device is either unstable or out of focus, in addition to being out of level.
            All color values (hexvalues) are valid. This status color defaults to red.   
             */
            indicatorColorNotLevel:"#FF0000",

            /// The color used by the level indicator to show the device is not stable.      
            /**  The level indicator will be drawn with this color when the device is less stable than what is allowed by the set stabilityDelay threshold. This indicator color takes precedence over focus if the device is also out of focus. If the device is out of level, the level indicator color takes precedence instead.
            All color values(hexvalues)  are valid. This status color defaults to blue.    
             */
            indicatorColorNotStable:"#0000FF"
        },
        CaptureOptions: {

            /// The current camera flash mode.       
            /**  A property to get or set the flash mode, with three values: ON, OFF, and AUTO.    
             */
            FlashMode: "OFF",

            /// Whether the video frame is retured, or a full-resolution image is captured.        
            /**  A boolean that indicates whether the video frame, or a full-resolution image is returned when capture is requested. Using the video frame may speed up image classification, but will result in less accurate results, as there is less image data to work with.     
             */
            videoFrame: false,

            /// Gets or sets the the page detection behavior of the control.        
            /**This property controls the page detection mode of the control.
            Page detection adds an additional constraints to image capture such that an image will not be captured until a documented is detected within the viewfinder. When running, page detection will also raise events each time a page is detected if the corresponding delegate has been set. 
            The supported modes are:  
            OFF: Turns off the page detection algorithm and its associated capture constraints.
            AUTOMATIC: Enables page detection and applies the page detection constraint to image capture. Use of the algorithm is minimized to conserve resources, and events events will not be generated until other capture constraints are satisfied. Usually, only a single event will be raised at the time an image is captured.
            CONTINUOUS: Enables page detection and runs it continuously in the background while the control is active. The page detection constraint is applied to image capture. The control will provide events releated to page detection as they become available.
            When deciding to enable any of the page detection modes, consider the impacts on processing resources and battery life. The continuous mode provides more flexibility to the developer than the automatic mode, but will consume more resources as well. 
             */
            pageDetectMode: "OFF",

            /// Starts or stops the continuous capture of images.         
            /**
            Calling this method will start or stop the continuous capture of images. Images will automatically be captured when levelness and stability criteria are satisfied. Between each image capture event, the device must be tilted away from its set device declination. This signals the device to capture a new image 
            when levelness and stability criteria are again satisfied. Continuous mode can only be enabled when the levelness thresholds for pitch and roll are less than 75 degrees.
            If continuous mode is disabled, a call to takePicure() is required before this view will request a photo from the camera.
            Defaults to false.
            */
            continuousMode:false
        }
    };
    return imageCaptureViewOptions;
};
//End of ImageCaptureControl Methods

/// The Plugin object for the native ImageReviewEditView class  
/**  This ImageReviewEditViewControl class is responsible for handling the corresponding plugin js to interact with the native ImageCaptureControl 
class. To set and get the properties, and to access the instance methods, corresponding JS methods are written under this class which  
are used by the  end user in application script.
*/
//ImageReviewControl constructor and corresponding methods
var ImageReviewControl = function(){
    
};

/// Method to add the   ImageReviewEditControl view to the screen  
/** This method is to create and show the "KfxKUIImageReviewEditControl" object on the web view. This would create 
a "KfxKUIImageReviewEditControl" object in the native and will add the object to the web view.

@param successCB: Default Success Call back function name
@param errorCB: Default Error call back function name
@param params: a 'Layout' object mentioning the Frame values for the ImageCaptureControl object. Refere to 'Layout' object for 
containing values.

@return The return value is captured in the 'successCB' function and will have a zero(0) for successful operation.

@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code
var Layout = kfxCordova.getLayoutProperties();
Layout.x = 10;
Layout.y =10;
Layout.width= 300;
Layout.height = 400;
Layout.visibility = true; // By default visibility is 'true'

var imgReviewControl =  kfxCordova.kfxUicontrols.createImageReviewControl();
imgReviewControl.addImageReviewEditView(mySucessCB,myerrorCB, Layout);
@endcode
*/
ImageReviewControl.prototype.addImageReviewEditView = function(successCallback,errorCallback,parameters){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
             if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.addImageReviewEditView,
         [parameters]
     );
};

/// Method to remove the   ImageReviewEditControl view off the screen  
/** Method to remove  the ImageReviewEditControl view off the screen. This method is responsible for removing and making it nill.

@param successCB: Default Success Call back function name
@param errorCB: Default Error call back function name


@return The return value is captured in the 'successCB' function and will have a zero(0) for successful operation.

@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.
@code

var imgReviewControl =  kfxCordova.kfxUicontrols.createImageReviewControl();
imgReviewControl.removeView(mySucessCB,myerrorCB);
@endcode
*/
ImageReviewControl.prototype.removeView = function(successCallback,errorCallback){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.removeImageReviewEditView,
         []
     );
};

/// To set image to review.
/** This method call is used to load the image object to be reviewed.
It also calculates a default crop rectangle (tetragon) based on the size and layout of the imageObjectToReview.
If you want to override the default crop rectangle, change the cropTetragon property prior to calling showCropRectangle.
This method will not succeed if a valid image processing license is not set.

@param successCB: Default Success Call back function name
@param errorCB: Default Error call back function name
@param params: an imageID(string) in the imagearray class, to be set for review

@return The return value is captured in the 'successCB' for a successful operation, and might return in 'errorCB' for an incomplete/invalid operation. Returns the following values in the corresponding functions
    successCB :  KMC_SUCCESS, success
    errorCB :    KMC_IP_LICENSE_INVALID:  no license found, KMC_IP_NO_REPRESENTATION: not bitmap or file based, or buffered image
    
     //ANDROID- no success and error codes mentioned in doxygen for android

@see 

@code
var imageid = 'imageid of the kedImage image from ImageArray class';
var imgReviewControl =  kfxCordova.kfxUicontrols.createImageReviewControl();
imgReviewControl.setImage(mySucessCB,myerrorCB,imageid);
@endcode
*/
ImageReviewControl.prototype.setImage = function(successCallback,errorCallback,parameters){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.setImage,
         [parameters]
     );
};

/// Method to get the  image being set for review/edit to  the   ImageReviewEditControl class 
/** This method would get the imageid of the KEDImage set for review. As the native SDK(for ios) do not provide any method to 
get the already set image, it is necessary to store the id of the image for reference. This method would return the store 
imageid.

@param successCB: Default Success Call back function name
@param errorCB: Default Error call back function name


@return The return value is captured in the 'successCB' function and will have the imageid of the kedImage set for review.
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code
function mysucessCB(imageid)
{
    alert(imageid);
}

var imgReviewControl =  kfxCordova.kfxUicontrols.createImageReviewControl();
imgReviewControl.getImage(mySucessCB,myerrorCB,params);
@endcode
*/
ImageReviewControl.prototype.getImage = function(successCallback,errorCallback,parameters){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(result){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.getImage,
         [parameters]
     );
};

/// To set the Options/properties of the ImageReviewEditControl class .
/** Method to set the properties of the native ImageReviewEditControl class.

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name
@param params:  a 'imageReviewEditViewOptions'  variable containing the properties  to be set to the ImageCaptureControl 

@return The return value is captured in the 'successCB' function and for a successful operation result is a 0(zero).
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code

var imgReviewControl =  kfxCordova.kfxUicontrols.createImageReviewControl();
var  imageReviewEditViewOptions =  imgReviewControl.getImageReviewEditViewOptions();
var point1 = kfxCordova.getPointProperties();
point1.x = 10; point1.y=10;
var point2 = kfxCordova.getPointProperties();
point2.x=20; point2.y=200;
var point3 = kfxCordova.getPointProperties();
point3.x=200; point3.y=20;
var point4 = kfxCordova.getPointProperties();
point4.x=250; point4.y=320;

imageReviewEditViewOptions.Tetragon.TopLeft=point1;
imageReviewEditViewOptions.Tetragon.TopRight=point2;
imageReviewEditViewOptions.Tetragon.BottomLeft=point3;
imageReviewEditViewOptions.Tetragon.BottomRight=point4;

imageReviewEditViewOptions.Crop.lineColor = 'hexvalueof a color';
imageReviewEditViewOptions.Crop.cornorColor= 'hex value of a color';
imageReviewEditViewOptions.Crop.lineStyle= kfxCordova.LineStyle.SOLID;

imgReviewControl.setOptions(successCB,errorCB,imageReviewEditViewOptions)

@endcode
*/ 
ImageReviewControl.prototype.setOptions = function(successCallback,errorCallback,parameters){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.setImageReviewEditOptions,
         [parameters]
     );
};

/// To get the Options/properties of the ImageReviewEditControl class .
/** Method to get the properties of the native ImageReviewEditControl class.

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name

@return The return value is captured in the 'successCB' function and will have the  'imageReviewEditViewOptions' object
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code

function mySucessCB(options){
    alert(JSON.stringify(options));
    // Optionally you can get the properties and map to the application UI to show the user 
}
var imgReviewControl =  kfxCordova.kfxUicontrols.createImageReviewControl();
imgReviewControl.getOptions(mySucessCB,myerrorCB);
@endcode
*/
ImageReviewControl.prototype.getOptions = function(successCallback,errorCallback){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.getImageReviewEditOptions,
         []
     );
};

/// A getter  method of properties of the 'ImageReviewEditControl' class
/**  Method returning the 'ImageReviewEditControl'  class properties that can be set by the user. Use this object as an input 
parameter to set the properties of the ImageReviewEditControl class. The parameters are grouped, and has the below mentioned 
default values. 
 */
ImageReviewControl.prototype.getImageReviewEditViewOptions = function(){
    var imageReviewEditViewOptions =  {
        /// The crop tetragon specified during edit operations. 
        /**  Developer can set the tetragon coordinates to initialize the control before displaying bounding tetragon (crop rectangle), or allow the control to set it to a default. The library returns this crop tetragon while edit is in progress. After the user closes the view, 
        this object contains the users final corner points after editing is complete.. 
         */
        Tetragon : {

            /// Whether to show tetragon.    
            /**  A boolean that indicates whether the level indicator is enabled. 
             */
            show : true,

            /// Represents the coordinates of the top left corner. 
            /**  This CGPoint structure holds the the top left X and Y coordinates of the tetragon point in pixels. The X coordinate may be less than or greater than the bottomRight the X coordinate.
        Avoid fractions. The library converts to whole integers in use. Default: 0,0  
             */
            TopLeft :{
                x : 0,
                y : 0
            },

            /// Represents the coordinates of the top right corner. 
            /**  This CGPoint structure holds the top right X and Y coordinates of the tetragon, and the X value must always be greater than top left X.
        Avoid fractions. The library converts to whole integers in use. Default: 0,0  
             */
            TopRight :{
                x : 0,
                y : 0
            },

            /// Represents the coordinates of the bottom left corner.  
                /**  This CGPoint structure holds the bottom left X and Y coordinates of the tetragon, and the X value must always be less than the bottom right X.
            Avoid fractions. The library converts to whole integers in use. Default: 0,0  
                 */
            BottomLeft : {
                x : 0,
                y : 0
            },

            /// Represents the coordinates of the bottom right corner.   
                /**  This CGPoint structure holds the bottom right X and Y coordinates of the tetragon, and the X value must always be greater than the bottom left X.
            Avoid fractions. The library converts to whole integers in use. Default: 0,0   
                 */
            BottomRight : {
                x : 0,
                y : 0
            }
        },
        Crop :{

            /// Color of lines in cropping rectangle/tetragon.  
            lineColor : "#AABBCCDD",

            /// Color of corner handles (circles) in cropping rectangle/tetragon. 
            cornerColor : "#AABBCCDD",

            /// Whether crop rectangle lines should be solid or dashed. 
            lineStyle : "LINE_STYLE_SOLID",
        }
    };
    return imageReviewEditViewOptions;
};
//End of ImageReviewControl methods

/// A variable/Object to access the native SDK methods of ImageProcessor class(es)  
/**  An instance of this class contains methods to process images. It holds the profile that specifies the kind of 
image processing to perform based on a selected image processing profile. Use the methods on this object to do standard 
image processing, perform a quick quality analysis and to find a signature in the image for a particular area. 
*/ 
//ImageProcessor constructor and corresponding methods
var ImageProcessor = function(){
    
};

/// To process the specified image. 
/** Use this method when you want to perform standard image processing on the image supplied with the method. The library 
processes the image using the processing options contained in the profile you specified. You can specify either a basic 
settings profile or an image perfection profile. If the input image representation is file based, and a bitmap is not supplied,
the library will load and process the image from the file in the image object. If the image is represented by a bitmap, 
then the library uses that image, even if the image representation indicates both (bitmap and file).
License Required: this is a licensed method. You cannot use this method until you have set a valid SDK license. In order to set your license, you need to use the setMobileSDKLicense method on the kfxKUTLicensing object. You must obtain a valid license from Kofax in order to use licensed methods. An example of setting your license can be found in the licensing class.
This method generates a brand new kfxKEDImage object, if the image processing completes without error. The library notifies you by calling the imageOut delegate. The output image object does not retain much from the input image.
When the processing completes normally, the library sets the following output image object properties:
imageMimeType, to the MIMETYPE_UNKNOWN setting.
imageBitMap, to the new processed bitmap.
imageRepresentation, to IMAGE_REP_BITMAP, because the bitmap is stored.
imageSourceID, to the imageID of the input image.
imageMetaData, to the metadata created by the image processor.
imagePerfectionProfileUsed or basicSettingsProfileUsed, to the one that was used to produce the output image.
imageGPSLat, to the preserved latitude of the source input file.
imageGPSLon, to the preserved longitude of the source input file.
imageFileOutputColor, to the new color definition of the output image generated.
imageHeight, to the height of the new output image.
imageWidth, to the width of the new output image.
All other image object properties are set to the default.

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name
@params : imageToProcess,the actual input image object that you want to process. An image id in the ImageArray is to be passes as argument


@return 
    The return value is captured in the 'successCB' function. This method returns KMC_SUCCESS when the image processing was started up successfully. 
    Several error codes are returned for this method when the image processing request could not be started, due to such things as memory limitations. In these cases, the method
    generates no final completion notification by calling your imageOut delegate. But, if the library returns KMC_SUCCESS, then image processing has started successfully. 
    Your imageOut delegate is called after the image processing completes, in which case a processing error may be indicated in the delegate. So you should always check this 
    return value to detect if you should expect progress delegate calls or completion delegate calls. One of these error codes may be returned immediately, in which case the 
    background processing is not started.

    The possible error codes are:
    KMC_IP_LICENSE_INVALID if you have not set a valid license yet. KMC_ED_NO_MEMORY_FOR_METADATA if memory could not be allocated to store image metadata.
    KMC_ED_NOIMAGE if you did not include an image in the input image object.
    KMC_IP_NO_PROFILE if you forgot to include a profile, either a basic settings or perfection profile.
    KMC_ED_FILEPATH if the image object is represented by a file, but the file path is missing.
    KMC_ED_NONEXISTENT_FILE If the file name in the input object was set to the name of a non-existant file, and you try to process it.
    KMC_IP_NO_REPRESENTATION if the image representation in the input image object is invalid.
    KMC_ED_IMAGE_COLOR_SPACE if the library could not create a color space reference, usually a system resource issue.
    KMC_ED_IMAGE_CONTEXT if an image bitmap could not be created, normally caused by a resource issue.
    
    //ANDROID ERROR CODES
    NullPointerException    ('image' parameter is null).
    KmcRuntimeException (KMC_IP_NO_PROFILE).
    KmcRuntimeException (KMC_ED_NOIMAGE).
    KmcRuntimeException (KMC_ED_FILEPATH).
    KmcRuntimeException (KMC_ED_MIMETYPE).
    KmcRuntimeException (KMC_ED_IMAGE_PERFECTION_PROFILE_EMPTY).
    KmcException    (KMC_ED_NONEXISTENT_FILE). 
@see 
    Use - cancelProcessing to cancel an image processing operation if necessary. 
@code

var imageProcessor = kfxCordova.kfxEngine.createImageProcessor();

imageProcessor.processImage(mySucessCB,myerrorCB, 'imageid');
@endcode
*/
ImageProcessor.prototype.processImage = function(successCallback,errorCallback,parameters)  {
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.processImage,
         [parameters]
     );
};


/// To  stop image processing. 
/** Use the cancelProcessing method to cancel an image processing operation that is underway. In, this way, the app can respond to low-memory events or, for any reason, the app user manually stops processing while the image is being processed in background. To do this, asynchronously call a cancel method in the Image Processor engine. Note that there may be a delay between cancelling and the imageOut delegate because the image processor will only cancel the balance of processing tasks on functional boundaries. The image out event will indicate that the processing was cancelled if the image processing operation was incomplete.

The library ignores the cancelProcessing call if the operation has already completed or hasn't started yet. If you cancel processing beforehand, the library will not cancel immediately if you then call processImage.
Background image processing and the cancel operation are both asynchronous. Depending on the current percentage last reported by the progress delegate, the image processing operation may be nearly complete. Therefore, the library may not necessarily cancel an operation, and the cancel error status may not occur. If the operation is cancelled, the imageOut delegate will indicate the KMC_EV_USER_ABORT status. In this case, there will be no image object included with the imageOut delegate.

The cancelProcessing method will cancel either a quick analysis or an image processing operation. 
@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name


@return 
    The return value is captured in the 'successCB' function. Returns zero by default status. 
    
    //ANDROID 
     The return value is captured in the 'successCB' function. This method returns KMC_EV_CANCEL_OPERATION_SUCCESS when the image processing cancelled successfully. 
@see 

@code
var imageProcessor = kfxCordova.kfxEngine.createImageProcessor();

imageProcessor.cancelImageProcess(successCB, errorCB);
@endcode
*/
ImageProcessor.prototype.cancelImageProcess = function(successCallback,errorCallback)  {
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.cancelImageProcess,
         []
     );
};

/// To set the Options/properties of the ImageProcessor class .
/** Method to set the properties of the native ImageProcessor class.

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name
@param params:  a 'imageProcessorOptions'  variable containing the properties  to be set to the ImageCaptureControl 

@return The return value is captured in the 'successCB' function and for a successful operation result is a 0(zero).
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code
var imageProcessor = kfxCordova.kfxEngine.createImageProcessor();
var  imageProcessorOptions =  imageProcessor.getImageProcessingOptions();
imageProcessor.setImageProcessorOptions(successCB,errorCB,imageProcessorOptions)

@endcode
*/
ImageProcessor.prototype.setImageProcessorOptions = function(successCallback,errorCallback,parameters){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.setImageProcessorOptions,
         [parameters]
     );
};

/// To get the Options/properties of the ImageProcessor class .
/** Method to get the properties of the native ImageProcessor class.

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name

@return The return value is captured in the 'successCB' function and will have the  'imageProcessorOptions' object
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code

function mySucessCB(options){
    alert(JSON.stringify(options));
    // Optionally you can get the properties and map to the application UI to show the user 
}

var imageProcessor = kfxCordova.kfxEngine.createImageProcessor();
imageProcessor.getImageProcessorOptions(appSuccessCB,appErrorCB);
@endcode
*/
ImageProcessor.prototype.getImageProcessorOptions = function(successCallback,errorCallback){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.getImageProcessorOptions,
         []
     );
};

/// To Specify a file path for use with the object. 
/** Use this method to specify the fully qualified path to a file name that you want to contain the output processed image. Usually this file should not already exist. You should always check for returned error codes because this specifyProcessedImageFilePath method returns errors for certain cases. When this method returns an error, the libary will not save the file path. The valid file path extensions are: jpg, jpeg, tif, tiff, png and their upper-case equivalents.
If the file name extension is valid, then the library sets up the imageMimetype setting for you.
This value is only used when the processedImageRepresentation is set to IMAGE_REP_FILE or IMAGE_REP_BOTH.

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name
@params : a string specifying a fully qualified path to a file name


@return 
    The return value is captured in the 'successCB' function. Returns KMC_ED_OBJECT_REP_BITMAP_MISMATCH, when you try to set a file name for an existing file, when there is already a bitmap set for the object.
    KMC_ED_FILE_EXTENSION, when you try to set a file name with an illegal file extension. 
@see 

@code
var imageProcessor = kfxCordova.kfxEngine.createImageProcessor();

imageProcessor.specifyProcessedImageFilePath(mysucCB, myerrCB,'filepath')
@endcode
*/
ImageProcessor.prototype.specifyProcessedImageFilePath = function(successCallback,errorCallback,parameters){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.specifyProcessedImageFilePath,
         [parameters]
     );
};

/// To get the current processed image file path. 
/** Use this method to retrieve the current file path associated with this object. In some cases, the file name may not have been set if the specifyProcessedImageFilePath method returned an error. 

@param successCB: Default Success call back function name. Return values of the exec call is captured here.
@param errorCB: Default Error call back function name, and any failure in executing the 'exec' call are captured here.s

@return 
    The return value is captured in the 'successCB' function. Returns the file path specified for 'specifyProcessedImageFilePath' method. 
@see 

@code

@endcode
*/
ImageProcessor.prototype.getProcessedImageFilePath = function(successCallback,errorCallback){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.getProcessedImageFilePath,
         []
     );
};

/// To  check image quality.  
/** Use this method to specify the image upon which you want to perform a quick analysis. The image processor will check image quality and determine the page edges of a document in the image.
The doQuickAnalysis method does not use a profile. The library uses an internally generated opString, and ignores the basic settings profile and the image perfection profile set in the image processor object.
License Required: this is a licensed method. You cannot use this method until you have set a valid SDK license. In order to set your license, you need to use the setMobileSDKLicense method on the kfxKUTLicensing object. An example of setting your license can be found in the licensing class.

The method returns KMC_SUCCESS if the process starts without any error. In this case you should expect multiple analysis process progress delegate calls to indicate the progress of the analysis. You should never make any assumptions about completion of the process when you get to 100% completion, because the library performs several post process steps and then calls the analysisComplete delegate. You should always check the status in the analysis complete delegate to know if the process completed without error.
If the call to doQuickAnalysis method does not return KMC_SUCCESS, then the library will not have stored the kfxKEDQuickAnalysisFeedback object, and you will not receive any progress delegate calls nor a analysisComplete delegate call. Therefore, you should always check the return value to make sure you have correctly initialized objects for the process and analysis starts up ok.
Quick analysis always returns a kfxKEDImage in the analysisComplete delegate, and this is a reference to the same input image given to quick analysis with the imageToAnalyze parameter. When Quick Analysis completes without error, it stores a kfxKEDQuickAnalysisFeedback object in the input image for your use. If you request a reference image, by setting the generateRefImage to true, then the library returns a UIImage reference in the kfxKEDQuickAnalysisFeedback object.
Quick Analysis Results are always stored in the kfxKEDQuickAnalysisFeedback object in the input image specified with the imageToAnalyze parameter. Then you can decide what to do with the results. You should examine the various settings in the kfxKEDQuickAnalysisFeedback object, to see if the image is blurry, over saturated, under saturated or not. The library also sets the bounding tetragon corners and side equasions for the page boundaries in the feedback object and the metadata. Then if the image looks good, you can also display the reference UIImage * if you requested one. You could display this image for user confirmation, and then a new picture could be taken if the user decides he doesn't like the results, or the green bordered image of the page seems incorrect.
Otherwise, if your user accepts the image, you could then process the image using a standard processImage call. When you do so, if you want to crop to the page detection referenced by the quick analysis process, you should use a basic settings profile, and set the doCrop setting to KED_CROP_WITH_QUICK_ANALYSIS_RESULTS, and your image processing will complete sooner than if you did normal processing because the library already knows the page boundaries.
Note: The library ignores any supplied profiles and uses internal settings instead. This data is returned in the quick analysis feedback object in the input imageToAnalyze object.
The analysisComplete delegate returns your input image, and everything in it is retained.
When the processing completes normally, the library sets the following image object properties:
imageQuickAnalysisFeedback, set to an object created by the analysis, indicating the results, and a reference image if requested. imageMetaData, to the quick analysis metadata created by the image processor for quick analysis.

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name
@params : 
    'imageToAnalyze'    the actual input image object that you want to check. The image to be analysed is to added to the ImageArray class and the corresponding id is to be provided as input to this method for analysis.
    generateRefImage    is a bool, when set to true, causes the image processor to return a native UIImage object. This image incluces a green border around the page boundaries. You can use this image to detect the correct orientation and edges, to decide if the image should be used for further processing or not. 


@return The return calue is captured in the 'successCB' and can have any of the  following results.
    This method returns KMC_SUCCESS when image processing started without error. Otherwise it may return one of these error codes if processing was not started. No delegates are generated if the method returns an error.
    KMC_IP_LICENSE_INVALID if you have not set a valid license yet. KMC_ED_NOIMAGE If you did not include an image in the input image object.
    KMC_ED_FILEPATH If the image object is represented by a file, but the file path is missing.
    KMC_ED_NONEXISTENT_FILE If the file name in the input object was specified so that the image representation is set to IMAGE_REP_FILE, an then the file used to represent the image is later deleted. The the library returns this error if you try to process it.
    KMC_IP_NO_REPRESENTATION If the image representation in the input image object is invalid, and not set to IMAGE_REP_FILE, or IMAGE_REP_BITMAP or BOTH. This indicates that there is no image to process. This is returned even if you set a file path to a non-existant file.
    KMC_ED_NO_MEMORY_FOR_METADATA if memory could not be allocated to store image metadata.
    KMC_ED_IMAGE_COLOR_SPACE If the library could not create a color space reference, usually a system resource issue.
    KMC_ED_IMAGE_CONTEXT, If an image bitmap could not be created, normally caused by a resource issue.
    KMC_EV_PROCESS_PAGE_BUSY/KMC_IP_CONTEXT, Another thread is calling the image processor for page process operation. Application can either retry after certain period of time, or cancel the operation
    
    //ANDROID ERROR CODES
    NullPointerException    ('image' parameter is null).
    KmcException    (KMC_EV_PROCESS_PAGE_BUSY).
    KmcException    (KMC_ED_NONEXISTENT_FILE).
    KmcRuntimeException (KMC_ED_FILEPATH).
    
    
@see 
    Use - cancelProcessing to cancel an ongoing quick analysis process if necessary.  
@code

var imageProcessor = kfxCordova.kfxEngine.createImageProcessor();
imageProcessor.doQuickAnalysis(mySucessCB,myerrorCB, 'imageid');

@endcode
*/
ImageProcessor.prototype.doQuickAnalysis = function(successCallback,errorCallback,parameters){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.doQuickAnalysis,
         [parameters]
     );
};

/// Method to add the event listener to the 'on image processed  ' of ImageProcessor 
/** This method would receive the on image processed at the ImageProcessor and the new corresponding details 
are captured in success call back.

@param successCB: Default Success Call back function name
@param errorCB: Default Error Call back function name
@param imageOutCallback: the processed image properties are returned in this variable in the form a JSOn object


@return The return value is captured in the 'successCB' function and will have a zero(0) for successful operation. 
'imageOutCallback' will have the the processed image properties are returned in this variable in the form a JSOn object


@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. by Default,  the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code
var imageProcessor = kfxCordova.kfxEngine.createImageProcessor();
imageProcessor.addImageOutEventListener(appSuccessCB,appErrorCB);
@endcode
*/
ImageProcessor.prototype.addImageOutEventListener = function(successCallback,errorCallback,imageOutCallback)  {
    exec(
         function(result){
             if(result.eventType === "eventRegistered"){
                if(successCallback)
                    successCallback(result);
             }else if(result.eventType === "eventRaised"){
                var imgObject = new ImageObject(result);
                if(imageOutCallback)
                    imageOutCallback(imgObject);
             }
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.addImageOutEventListener,
         []
     );
};

/// Method to add the event listener to the 'Image process progress' of ImageProcessor 
/** This method would receive the Image process progress at the ImageProcessor and the new corresponding details 
are captured in success call back.

@param successCB: Default Success Call back function name
@param errorCB: Default Error Call back function name
@param processCallback: a variable to hold any value returned from the progresschanegs listener of the processor class


@return The return value is captured in the 'successCB' function and will have a zero(0) for successful operation. 


@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. by Default,  the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.
'processCallback' a variable to hold any value returned from the progresschanegs listener of the processor class

@code
var imageProcessor = kfxCordova.kfxEngine.createImageProcessor();
imageProcessor.addProcessProgressListener(appSuccessCB,appErrorCB);
@endcode
*/
ImageProcessor.prototype.addProcessProgressListener = function(successCallback,errorCallback,processCallback)    {
    exec(
         function(result){
             if(result.eventType === "eventRegistered"){
                if(successCallback)
                    successCallback(result);
             }else if(result.eventType === "eventRaised"){
                if(processCallback)
                    processCallback(result);
             }
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.addProcessProgressListener,
         []
     );
};

/// Method to add the event listener to the 'Image Analysis complete' of ImageProcessor 
/** This method would receive the Image Analysis complete at the ImageProcessor and the new corresponding details 
are captured in success call back.

@param successCB: Default Success Call back function name
@param errorCB: Default Error Call back function name
@param analysisCallback: a var to hold any value returned from the anaylis complete listener of the processor class


@return The return value is captured in the 'successCB' function and will have a zero(0) for successful operation. 


@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. by Default,  the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.
analysisCallback: a var to hold  value returned from the anaylis completed listener of the processor class

@code
var imageProcessor = kfxCordova.kfxEngine.createImageProcessor();
ImageProcessor.prototype.addAnalysisCompleteListener(appSuccessCB,appErrorCB);
@endcode
*/
ImageProcessor.prototype.addAnalysisCompleteListener = function(successCallback,errorCallback,analysisCallback)   {
    exec(
         function(result){
             if(result.eventType === "eventRegistered"){
                if(successCallback)
                    successCallback(result);
             }else if(result.eventType === "eventRaised"){
                var imgObject = new ImageObject(result.image);
                result.image = imgObject;
                if(analysisCallback)
                    analysisCallback(result);
             }
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.addAnalysisCompleteListener,
         []
     );
};

/// Method to add the event listener to the 'Image Analysis progress' of ImageProcessor 
/** This method would receive the Image Analysis progress at the ImageProcessor and the new corresponding details 
are captured in success call back.

@param successCB: Default Success Call back function name
@param errorCB: Default Error Call back function name
@param progressCallback: a var to hold the curren analysis progress listener call from processor


@return The return value is captured in the 'successCB' function and will have a zero(0) for successful operation. 
'progressCallback' to show the current analysis progress for a 'doQuickAnalysis' method


@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. by Default,  the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code

var imageProcessor = kfxCordova.kfxEngine.createImageProcessor();
imageProcessor.addAnalysisProgressListener(appSuccessCB,appErrorCB);
@endcode
*/
ImageProcessor.prototype.addAnalysisProgressListener = function(successCallback,errorCallback,progressCallback)   {
    exec(
         function(result){
             if(result.eventType === "eventRegistered"){
                if(successCallback)
                    successCallback(result);
             }else if(result.eventType === "eventRaised"){
                if(processCallback)
                    processCallback(result);
             }
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.addAnalysisProgressListener,
         []
     );
};

/// Method to remove the event listener to the  'Processed image out' changed delegate method of the ImageCaptureControl 
 /** The method would remove the listener and would not receive the processed image events. After removing the listener, 
there will not be any call backs from native .

@param successCB: Default Success Call back function name
@param errorCB: Default Error Call back function name


@return The return value is captured in the 'successCB' function and will have a zero(0) for successful operation. 
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code

var imageProcessor = kfxCordova.kfxEngine.createImageProcessor();
imageProcessor.removeImageOutEventListener(mySucessCB,myerrorCB);
@endcode
*/
ImageProcessor.prototype.removeImageOutEventListener = function(successCallback,errorCallback)  {
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.removeImageOutEventListener,
         []
     );
};

/// Method to remove the event listener to the  'Processed image progress' changed delegate method of the ImageCaptureControl 
/** The method would remove the listener and would not receive the Processed image progress events. After removing the listener, 
there will not be any call backs from native .

@param successCB: Default Success Call back function name
@param errorCB: Default Error Call back function name



@return The return value is captured in the 'successCB' function and will have a zero(0) for successful operation. 
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code

var imageProcessor = kfxCordova.kfxEngine.createImageProcessor();
imageProcessor.removeProcessProgressListener(mySucessCB,myerrorCB);
@endcode
*/
ImageProcessor.prototype.removeProcessProgressListener = function(successCallback,errorCallback)    {
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.removeProcessProgressListener,
         []
     );
};

/// Method to remove the event listener to the  'Analysis complete' changed delegate method of the ImageCaptureControl 
/** The method would remove the listener and would not receive the Analysis complete events. After removing the listener, 
there will not be any call backs from native .

@param successCB: Default Success Call back function name
@param errorCB: Default Error Call back function name


@return The return value is captured in the 'successCB' function and will have a zero(0) for successful operation. 
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code
var imageProcessor = kfxCordova.kfxEngine.createImageProcessor();
imageProcessor.removeAnalysisCompleteListener(mySucessCB,myerrorCB);
@endcode
*/
ImageProcessor.prototype.removeAnalysisCompleteListener = function(successCallback,errorCallback)   {
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.removeAnalysisCompleteListener,
         []
     );
};

/// Method to remove the event listener to the  'Analysis progress' changed delegate method of the ImageCaptureControl 
/** The method would remove the listener and would not receive the Analysis progress events. After removing the listener, 
there will not be any call backs from native .

@param successCB: Default Success Call back function name
@param errorCB: Default Error Call back function name


@return The return value is captured in the 'successCB' function and will have a zero(0) for successful operation. 
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code

var imageProcessor = kfxCordova.kfxEngine.createImageProcessor();
imageProcessor.removeAnalysisProgressListener(mySucessCB,myerrorCB);
@endcode
*/
ImageProcessor.prototype.removeAnalysisProgressListener = function(successCallback,errorCallback)   {
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.removeAnalysisProgressListener,
         []
     );
};
/// A getter  method for QuickAnalysis options
/**  Method returning the QuickAnalysis properties that can be set by the user. Use this object as an input parameter to set
 options on QuickAnalysis
 
 @code
 var doQuickAnalysisOptions = {
 imageID:"",
 generateOutputImage:true
 };
 @endcode
 */
ImageProcessor.prototype.getQuickAnalysisOptions = function(){
    var doQuickAnalysisOptions = {
        imageID:"",
        generateOutputImage:true
    };
    return doQuickAnalysisOptions;
};

/// A getter  method of properties of the 'ImageProcessor' class
/**  Method returning the 'ImageProcessor'  class properties that can be set by the user. Use this object as an input 
parameter to set the properties of the ImageProcessor class. The parameters are grouped, and has the below mentioned 
default values. 
 */
ImageProcessor.prototype.getImageProcessingOptions = function(){


    var imageProcessorOptions = {
        ProcessedImage:{
            ///An enum which identifies the Image Representation(s) included in this Image Object.
            representation:'IMAGE_REP_BITMAP', // IMAGE_REP_NONE,IMAGE_REP_BITMAP,IMAGE_REP_FILE,IMAGE_REP_BOTH

            ///An enum which identifies the Mime Type of the image file referenced by this Image Object. 
            mimeType:'MIMETYPE_JPEG', //MIMETYPE_JPEG,MIMETYPE_PNG,MIMETYPE_TIFF,MIMETYPE_UNKNOWN

            /** Represents a JPEG compression quality value, where lower numbers indicate higher compression (smaller size), but lower image quality. 
            Higher JPEG quality numbers indicate lower compression (larger size), but better image quality. Valid quality values are 1 to 100. 
                 */
            jpegQuality:50
        },
        BasicSettingsProfile:{

            ///An enum which identifies the rotation type. 
            rotateType:'ROTATE_NONE',//ROTATE_NONE,ROTATE_90,ROTATE_180,ROTATE_270,ROTATE_AUTO

            ///An enum which identifies the crop type.
            cropType:'CROP_AUTO',//CROP_NONE,CROP_AUTO,CROP_TETRAGON,CROP_QUICKANALYSIS

            ///The deskew property specifies whether to deskew the image or not.
            doDeskew:true,//true,false

            /** Use this property to set the length of the shorter edge of the original document in inches. 
            The library uses this parameter to better estimate the output image DPI and also helps algorithms better detect document corners, especially when one is outside the boundary of the image.
            You need not set both short and long edges, the algorithm uses one if it is present. 
            If you set it to 0.0 or null, then the library will not use this parameter. 
                 */
            inputDocShortEdge:0.0,//ANY FLOAT NUMBER

            /** Use this property to set the length of the longer edge of the original document in inches. 
                The library uses this parameter to better estimate the output image DPI and also helps algorithms better detect document corners, 
                especially when one is outside the boundary of the image. You need not set both short and long edges, the algorithm uses one if it is present. 
                If you set it to 0.0 or null, then the library will not use this parameter. 
                */
            inputDocLongEdge:0.0,//ANY FLOAT NUMBER

            //The tetragon consists of the its top-left, top-right, bottom-left, and bottom-right points.
            BoundingTetragon:{

                /// Represents the coordinates of the top left corner. 
                /**  This CGPoint structure holds the the top left X and Y coordinates of the tetragon point in pixels. The X coordinate may be less than or greater than the bottomRight the X coordinate.
                Avoid fractions. The library converts to whole integers in use. Default: 0,0  
                 */
                TopLeft:{
                    x:0,
                    y:0
                },

                /// Represents the coordinates of the top right corner. 
                /**  This CGPoint structure holds the top right X and Y coordinates of the tetragon, and the X value must always be greater than top left X.
                Avoid fractions. The library converts to whole integers in use. Default: 0,0  
                 */
                TopRight:{
                    x:0,
                    y:0
                },

                /// Represents the coordinates of the bottom left corner.  
                /**  This CGPoint structure holds the bottom left X and Y coordinates of the tetragon, and the X value must always be less than the bottom right X.
                Avoid fractions. The library converts to whole integers in use. Default: 0,0  
                 */
                BottomLeft:{
                    x:0,
                    y:0
                },

                /// Represents the coordinates of the bottom right corner.   
                /**  This CGPoint structure holds the bottom right X and Y coordinates of the tetragon, and the X value must always be greater than the bottom left X.
                Avoid fractions. The library converts to whole integers in use. Default: 0,0   
                 */
                BottomRight:{
                    x:0,
                    y:0
                }
            },

            /** Use this property to set the desired output image DPI (Dots Per Inch). If you set it to 0 or null, the library will automatically detect the output image DPI and indicate it in the output object. 
                */
            outputDPI:0, //any integer value

            ///An enum which identifies the output bit depth.
            outputBitDepth:'BITONAL' //BITONAL,GRAYSCALE,COLOR
        }
    };
    return imageProcessorOptions;
};
//End of ImageProcessor methods

/// An User defined  class  to handle the image conversion operation.   
/**  This class is defined to handle the Image related operations. As native SDK expected inputs for all ofthe classes as KEDImages,
we had to define a mechanism to convert the Images to KEDImages and also to show a preview we need a format that can understood
by the top level (HTML) code. This classs defince methods to convert iamge from base64 string to KEDImage, vice varsa and other 
supporting methods. 

The Image Array class maintains the Array of image objects and indexing on the image id of the KEDImage. When a base64 is sent 
as input, a KEDImage is created and the imageid along with the KEDImage is added to the ImageArray class. 

For retrieving the KEDImage, please provide the imageiD as input.

Due to memory constraints, there is limitation on the number of Images that can be stored on the ImageArray object. 
Limiting to 3/4 images is advised. This is a singleton class in native. Listed below are the plugin js methods to access the
methods of the ImageArray class.
*/
//ImageArray constructor and corresponding methods
var ImageArray = function(){
    
};

/// To get the total number of images  stored in ImageArray.
/** Method to get the number of images  stored in the ImageArray

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name

@return The return value is captured in the 'successCB' function and will have the count of the total images stored in the ImageArray
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a string giving the description of the error.

@code

function mySucessCB(imagecount){
    alert('total number of images'+imagecount); 
}

var imageArray = kfxCordova.kfxEngine.createImageArray();
imageArray.getTotalImages(mySucessCB,myerrorCB);
@endcode
*/
ImageArray.prototype.getTotalImages = function(successCallback,errorCallback){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.getTotalImages,
         []
     );
};

/// To get the ids of the  images stored in ImageArray.
/** Method to get the image IDs of the images stored in ImageArray

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name

@return The return value is captured in the 'successCB' function and will have the array of the Imageids from the image array 
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code

function mySucessCB(imageidArray){
    alert('total number of images'+imageidArray.length);
     alert('total Image ids '+imageidArray);
    // Optionally you can get the properties and map to the application UI to show the user 
}
var imageArray = kfxCordova.kfxEngine.createImageArray();
imageArray.getImageIDs(mySucessCB,myerrorCB);
@endcode
*/
ImageArray.prototype.getImageIDs = function(successCallback,errorCallback){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.getImageIds,
         []
     );
};

/// To get the properties of an image  in ImageArray.
/** Method to get the properties of an image in ImageArray.

This method would get all the properties of an image which is stored in the ImageArray.
This would take the imageID as the input and send back all the properties of that image in the success call back, if that exists. Otherwise,
it would call the error call back method


@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name
@param ImageID: ID of the image of which you want to get the properties.

@return The return value is captured in the 'successCB' function and will have the the properties of the 'Image' object in the form JSON
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code

function mySucessCB(imageidArray){
alert('total number of images'+imageidArray.length);
alert('total Image ids '+imageidArray);
// Optionally you can get the properties and map to the application UI to show the user
}

var imageArray = kfxCordova.kfxEngine.createImageArray();
imageArray.getImageProperties(mySucessCB,myerrorCB,ImageID);
@endcode
*/
ImageArray.prototype.getImageProperties = function(successCallback,errorCallback,parameters){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.getImagePropertiesWithId,
         [parameters]
     );
};

/// To convert a base64 string (of an image) to KEDImage 
/** Method to convert an image in the form of base64string to a KEDImage. The KEDImage is stored in the ImageArray and the 
corresponding id is returned in the call back.

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name
@param params: an input image in the form of base64 string to be converted to KEDImage

@return The return value is captured in the 'successCB' function and will have the image id of the converted KEDImage(from 
input base64 string)
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code

function mySucessCB(imageid){
    alert('converted imageid'+imageid);      
}
var imageArray = kfxCordova.kfxEngine.createImageArray();
imageArray.getImageFromBase64(mySucessCB,myerrorCB, 'base64string');
@endcode
*/
ImageArray.prototype.getImageFromBase64 = function(successCallback,errorCallback,parameters){
    exec(
         function(result){
            var imgObject = new ImageObject(result);
            if(successCallback)
                successCallback(imgObject);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.getImageFromBase64,
         [parameters]
     );
};

/// To create a KEDImage from a specified file location 
/** Method to create and store a KEDImage in the ImageArray. The KEDImage is created fromt he image specified in the input
file location.

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name
@param params: String variable representing a physical location of an image which need to be converted to a KEDImage

@return The return value is captured in the 'successCB' function and will have the image id of the converted KEDImage(from 
input image mentioned in the file path )
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code

function mySucessCB(imageid){
    alert('converted imageid'+imageid);      
}
var imageArray = kfxCordova.kfxEngine.createImageArray();
imageArray.getImageFromFilePath(mySucessCB,myerrorCB, 'filepath of any image');
@endcode
*/
ImageArray.prototype.getImageFromFilePath = function(successCallback,errorCallback,parameters){
    exec(
         function(result){
            var imgObject = new ImageObject(result);
            if(successCallback)
                successCallback(imgObject);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.getImageFromFilepath,
         [parameters]
     );
};

/// To get the base64 string (of an image) from a KEDImage in the ImageArray
/** Method to get a base64 string of KEDImage which is already present in the ImageArray. If no KEDImage is found fro the 
provided input image id, error will be returned

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name


@return The return value is captured in the 'successCB' function and will have the base64 string of the input image id. 
There should be an existing image already added to the Image Array for the input image id, other wise this method would return 
in the error call back.
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code

var imageArray = kfxCordova.kfxEngine.createImageArray();
imageArray.getImageToBase64(mySucessCB,myerrorCB);
@endcode
*/
ImageArray.prototype.getImageToBase64 = function(successCallback,errorCallback,parameters){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.getBase64ImageWithId,
         [parameters]
     );
};

/// To remove all the images  in the ImageArray.
/** Method to remove all the KEDImages in the Image Array. After this operation none of the images will be accessed with any
reference.

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name
@param imageIDs: list if image IDs you would like to remove

@return The return value is captured in the 'successCB' function and will have a 0 after removing the images

@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code
var imageArray = kfxCordova.kfxEngine.createImageArray();
imageArray.removeImages(mySucessCB,myerrorCB,imageIDs);
@endcode
*/
ImageArray.prototype.removeImages = function(successCallback,errorCallback,parameters){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.removeImages,
         [parameters]
     );
};

/// To set properties of the KedImage class .
/** Method to set the properties of the native kfxKEDImage class.

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name
@param params:  an 'ImageObject'  variable conting the properties  to be set to the kfxKEDImage object. The image isuniquely identified by its 'id' prperty

@return The return value is captured in the 'successCB' function and for a successful operation result is a 0(zero).
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code

var imageObj =  kfxCordova.kfxEngine.createImageObject();
//Set th eproperties for the image object


var imageArray = kfxCordova.kfxEngine.createImageArray();
imageArray.setImageProperties(mySucessCB,myerrorCB,imageObject);
@endcode
*/
ImageArray.prototype.setImageProperties = function(successCallback,errorCallback,parameters){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.setImagePropertiesWithId,
         [parameters]
     );
};

/// To get properties of the KedImage class .
/** Method to get the properties of the native kfxKEDImage class object.

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name


@return The return value is captured in the 'successCB' function, returns an Image object which would give all the properties.
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code

var imageArray = kfxCordova.kfxEngine.createImageArray();
imageArray.imageProperties();
@endcode
*/
ImageArray.prototype.imageProperties = function(){
    var imageProperties = {
        imageID: "",
        filePath:"",
        mimeType:"",
        bitmapScaling:0,
        tag:"",
        fileIOEngine:"",
        createDateTime:"",
        dpi:0,
        jpegQuality:0
    };
    return imageProperties;
};
//End of ImageArray methods

//Image Object 

var ImageObject = function(image){

	this.imgID = image.ID;
	this.imgBitmapWidth = image.width;
	this.imgBitmapHeight = image.height;
	this.imgBitmapScaling = image.bitmapScaling;
	this.imgTag = image.tag;
	this.imgSrcID = image.srcID;
	this.imgMetaData = image.metaData;
	this.imgLatitude = image.latitude;
	this.imgLongitude = image.longitude;
	this.imgPitch = image.pitch;
	this.imgRoll = image.roll;
	this.imgCreateDateTime = image.createDateTime;
	this.imgDPI = image.dpi;
	this.imgJpegQuality = image.jpegQuality;
	this.imageFilePath = image.filePath;
	this.imageMimeType = image.mimeType; 
	this.imageRepresentation = image.representation;
	this.imageFileWidth = image.fileWidth;
	this.imageFileHeight = image.fileHeight; 
	this.imageFileRep = image.fileRep;
	this.imagePerfectProfileUsed = image.perfectProfileUsed;
	this.basicSettingsProfileUsed = image.basicSettingsProfileUsed;
	this.imageQuickAnalysisFeedBack = image.QuickAnalysisFeedback;
	this.imageOutputColor = image.outputColor;
	this.fileIOEngine = image.fileIOEngine;
	this.barcodes = image.barcodes;
	this.classificationResults = image.classificationResults; 
			
};

/// To generate a base64 string (of an ImageObject) 
/** Method to convert an image to the form of base64string from a KEDImage. 

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name
@param params: an input object  for which the base64 string is required

@return The return value is captured in the 'successCB' function and will have the base64 strign of the image
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code

function mySucessCB(imageid){
    alert('converted imageid'+imageid);      
}
var imageObj =  kfxCordova.kfxEngine.createImageObject();

imageObj.base64Image(mySucessCB,myerrorCB, myImageObject);
@endcode
*/

ImageObject.prototype.base64Image = function(successCallback, errorCallback){
    exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.getBase64ImageWithId,
         [this.imgID]
     );
};

/// To remove  the imageObject   
/** Method to   the KEDImages. After this operation none of the images will be accessed with any 
reference.

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name



@return The return value is captured in the 'successCB' function and will have a 0 after removing the images

@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code

var imageObj =  kfxCordova.kfxEngine.createImageObject();
// do operations with the created image, then to remove the image use 

imageObj.deleteImage(mySucessCB,myerrorCB);
@endcode
*/	
ImageObject.prototype.deleteImage = function(successCallback, errorCallback){
		exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.removeImages,
         [[this.imgID]]
     );
};


/// To set properties of the KedImage class .
/** Method to set the properties of the native kfxKEDImage class. This method will intern call the ImageArray.prototype.setImageProperties to set the properties for a particular image object in the array

@param successCB: Default Success call back function name
@param errorCB: Default Error call back function name
@param params:  an 'ImageObject'  variable conting the properties  to be set to the kfxKEDImage object. The image isuniquely identified by its 'id' prperty

@return The return value is captured in the 'successCB' function and for a successful operation result is a 0(zero).
@see Check the 'errorCB' method for any failures in case of unexpected behaviour of the method. Generally the error call back 
would return a JSON object with â€˜ErrorMsgâ€™ & â€˜ErrorDesc' giving the description of the error.

@code

var imageObj =  kfxCordova.kfxEngine.createImageObject();
//Set th eproperties for the image object

imageObj.setOptions(mySucessCB,myerrorCB,imageObject);
@endcode
*/

ImageObject.prototype.setOptions = function(successCallback,errorCallback,parameters){
	
	exec(
         function(result){
            if(successCallback)
                successCallback(result);
         },
         function(error){
            if(errorCallback)
                errorCallback(error);
         },
         serviceName,
         actionNames.setImagePropertiesWithId,
         [parameters]
     );
	
};


//End of Image Object



//plugin methods
var plugin = {
    
};

plugin.kfxUtilities = {
    createLicense:function(){
        return new License();
    }
};
plugin.kfxUicontrols = {
    createBarcodeCaptureControl:function(){
        return new BarcodeCaptureControl();
    },
    createImageCaptureControl:function(){
        return new ImageCaptureControl();
    },
    createImageReviewControl:function(){
        return new ImageReviewControl();
    }
};
plugin.kfxEngine = {
    createImageProcessor:function(){
        return new ImageProcessor();
    },
    createImageArray:function(){
        return new ImageArray();
    },
    createImageObject:function(image){
    	return new ImageObject(image);
    },
    createImageFromBase64:function(successCallback,errorCallback,base64String){
       exec(
            function(result){
                var imgObject = new ImageObject(result);
                if(successCallback)
                    successCallback(imgObject);
            },
            function(error){
                if(errorCallback)
                    errorCallback(error);
            },
            serviceName,
            actionNames.getImageFromBase64,
            [base64String]
        );
    },
    createImageFromFilePath:function(successCallback,errorCallback,filePath){
       exec(
            function(result){
                var imgObject = new ImageObject(result);
                if(successCallback)
                    successCallback(imgObject);
            },
            function(error){
                if(errorCallback)
                    errorCallback(error);
            },
            serviceName,
            actionNames.getImageFromFilepath,
            [filePath]
        );
    }
};

/// A getter  method  for the  Layout property
/**  A  method which would return a 'Layout' property used to create objects(of SDK) with certain frame. Set the values of the Layout object such as origin, width and height(& visibility) and pass as argument to create the 
frame. 'Layout' is a common  object and can be used by any class/object.
 */
plugin.getLayoutProperties = function(){
    var layout = {
        x:0,
        y:0,
        width: 0,
        height: 0,
        visibility: true
    };
    return layout;
};
plugin.getPointProperties = function(){
    var point = {
        x :  0,
        y :  0
    }
    return point;
};
plugin.getCordovaVersion = function(){
   return cordova.version;
};
plugin.getkfxPluginVersion = function(){
   return kfxVersion;
};
plugin.getAllVersions = function(successCallback,errorCallback){
   exec(
        function(result){
            if(successCallback){
                result["cordovaVersion"]=cordova.version;
                result["kfxPluginVersion"]=kfxVersion;
                successCallback(result);
            }
        },
        function(error){
            if(errorCallback)
                errorCallback(error);
        },
        serviceName,
        actionNames.getSDKVersions,
        []
    );
};
//End of plugin methods

module.exports = plugin;
});
