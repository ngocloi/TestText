var appIsLaunched = false;
var fromCaptureSettingsScreen = false;
// PhoneGap Gallery key 
var destinationType;
var Layout;
var bcResult=null;
var processedImageFilePath = "";
var processedImageBase64Data;
//Review Screen Options
var imageProcessorOptions = null;
var filePathInprocessorSettings = "";
var fromGallery = false;
var showCropTetragon = false;
var bcOptions=null;

//Image Capture variables
var imageCaptureViewProperties = null;
var captureInnerHtml="";

var License = null;
var ImageCaptureControl = null;
var BarcodeCaptureControl = null;
var ImageReviewControl = null;
var ImageProcessor = null;
var ImageArray = null;
var imageObject = null;
var continousImgObject = null;
var processedImageObject = null;
var isPreviewRunning = true;
var isProcessRunning = false;
var doQuickButtonIsPressed = false;


/*
 * Set the Kofax mobile sdk license after complete the html loading
 *
 */
$(window).load(function(){
    ImageCaptureControl = kfxCordova.kfxUicontrols.createImageCaptureControl();
    BarcodeCaptureControl = kfxCordova.kfxUicontrols.createBarcodeCaptureControl();
    ImageReviewControl = kfxCordova.kfxUicontrols.createImageReviewControl();
    ImageProcessor = kfxCordova.kfxEngine.createImageProcessor();
    ImageArray = kfxCordova.kfxEngine.createImageArray();
    License = kfxCordova.kfxUtilities.createLicense();
    License.setMobileSDKLicense(function(result){},function(error){alert("error")},'2Dc!4fp,zhBJNtl$FXNB9AKk8r[+[zlVZ(vc&UPL60rO0hX47,![l(Nj=mIR#DgIk;5qdv!fP(NUF!vn6WG^8TRPd?!PxbUlL!GE');
    var cordovaVersion = kfxCordova.getCordovaVersion();
    var cordovaPluginVersion = kfxCordova.getkfxPluginVersion();
    var sdkVersions = "";
    var allVersions = "";
    console.log("Cordova Version is "+cordovaVersion);
    console.log("kfxPlugin Version is "+cordovaPluginVersion);
    License.getSDKVersions(function(result){
      console.log("SDK Versions are "+JSON.stringify(result));
      sdkVersions = JSON.stringify(result);
      kfxCordova.getAllVersions(function(data){
            console.log("All Versions are "+JSON.stringify(data));
            allVersions = JSON.stringify(data);
            alert("cordovaVersion :: "+cordovaVersion+"cordovaPluginVersion :: "+cordovaPluginVersion+"sdkVersions :: "+sdkVersions+"allVersions :: "+allVersions);
      },function(error){});
   },function(error){});
});

//Image Capture section methods
/*
 *Adds listeners for Image captured Event 
 * 
 */
  function addImageCaptureListeners(){

      ImageCaptureControl.addImageCapturedListener(function(data){
          console.log("addImageCapturedListener success"+data);
      },function(error){
          $.mobile.loading( "hide");
          alert("addImageCapturedListener error !"+error);
      },function(result){
           $("#captureIntimationImage").show();
           setTimeout(function(){
               $("#captureIntimationImage").hide();
           },1500);
           if(!imageCaptureViewProperties.CaptureOptions.continuousMode)
           {    
               isPreviewRunning = false;
               hideImageCaptureView();
               document.getElementById('takePictureButton').setAttribute('onclick', function(){} );
               //Get base64 data from image array by passing the image id as parameter and displaying the image
               result.base64Image(function(data){
                   document.getElementById('captureViewContent').innerHTML ="<center><img id='imageCapturePreview' style='width:100%;'></img></center>";
                   document.getElementById('imageCapturePreview').src = "data:image/jpeg;base64,"+data;
                   var devHeight = $(window).height()-108;
                   document.getElementById('imageCapturePreview').setAttribute("style","height:"+devHeight+"px");
                   imageObject = result;
                   isPreviewRunning = true;
                   document.getElementById('takePictureButton').innerHTML="Retake";
                   document.getElementById('takePictureButton').setAttribute('onclick', 'reTakeButtonAction()' );
                   $.mobile.loading( "hide");
               },function(error){
                   $.mobile.loading( "hide");
                   isPreviewRunning = true;
                   alert("base64Image error ! "+error);
               });
           }else{
               if(continousImgObject){
                   continousImgObject.deleteImage(function(response){
                       console.log("deleteImage success"+response);  
                   },function(error){
                       alert("deleteImage error ! "+error);
                   });
               }
               continousImgObject = result;
               $.mobile.loading( "hide");
           }
          
           processedImageObject = null;
           fromGallery = false;
      });
  }
  
/*
 * Removes Image Capture Listeners
 * 
 */
  
  function removeImageCaptureListeners(){
      ImageCaptureControl.removeImageCapturedListener(function(data) {
          console.log("removeImageCapturedListener success");
        }, function(error) {
          alert("error removeImageCapturedListener"+error);
      });
      
  }
  
  /*
   *Adds Image processing Listeners 
   * 
   */ 
   
   function addImageProcessorListeners() {
       
       ImageProcessor.addImageOutEventListener(function(data){
           console.log("addImageOutEventListener success");
       },function(result){
           isProcessRunning = false;
           alert("Error! addImageOutEventListener"+JSON.stringify(result));
           $("#processToggleBtn").text("Process");
           $("#reviewViewFooter").trigger("create");
       },imageOutHandler);
       
       ImageProcessor.addProcessProgressListener(function(data){
           console.log("addProcessProgressListener success");
           },function(result){
           alert("Error! addProcessProgressListener"+JSON.stringify(result));
           $("#processToggleBtn").text("Process");
           $("#reviewViewFooter").trigger("create");
         },processProgressHandler);
       
       ImageProcessor.addAnalysisCompleteListener(function(data){
           console.log("addAnalysisCompleteListener success");
       },function(result){
           doQuickButtonIsPressed = false;
           alert("Error! addAnalysisCompleteListener"+JSON.stringify(result));
       },analysisCompleteHandler);
       
   }
 /*
  *Removes Image processing Listeners 
  * 
  */ 
  
  function removeImageProcessorListeners() {
      
      ImageProcessor.removeImageOutEventListener(function(data) {
          console.log("removeImageOutEventListener success");
       }, function(error) {
          alert("error removeImageOutEventListener"+error);
       });
       ImageProcessor.removeProcessProgressListener(function(data) {
            console.log("removeProcessProgressListener success");
           }, function(error) {
            alert("error removeProcessProgressListener"+error);
       });
       
       ImageProcessor.removeAnalysisCompleteListener(function(data) {
           console.log("removeAnalysisCompleteListener success");
         }, function(error) {
           alert("error removeAnalysisCompleteListener"+error);
       });

  }
  
/*
 * Adding the Image Capture Control to the view
 *
 */
function showImageCaptureView(){
    if(captureInnerHtml!=""&&captureInnerHtml){
        document.getElementById('captureViewContent').innerHTML=captureInnerHtml;
        document.getElementById('takePictureButton').innerHTML="Retake";
        document.getElementById('takePictureButton').setAttribute('onclick', 'reTakeButtonAction()' );
        return;
    }else if(imageCaptureViewProperties.CaptureOptions.continuousMode)
    {
        document.getElementById('takePictureButton').innerHTML="Stop";
        document.getElementById('takePictureButton').setAttribute('onclick', 'stopButtonAction()' );
    }else{
            document.getElementById('takePictureButton').innerHTML="Take Picture";
            document.getElementById('takePictureButton').setAttribute('onclick', 'takeButtonAction()' );
    }
    $.mobile.loading( "show");
    var width = $(window).width();
    var height=$(window).height()-108;
    var x=0,y=0;
    if(parseInt(device.version)>=7&&device.platform=="iOS"){
        y=64;
    }else{
        y=44;
    }
    var layoutProp = kfxCordova.getLayoutProperties();
    layoutProp.x= x;
    layoutProp.y= y;
    layoutProp.width=width;
    layoutProp.height= height;
    imageCaptureViewProperties.FrameOptions.width= width-20;
    imageCaptureViewProperties.FrameOptions.height = height-30;
    //Set the default options to the Image Capture Control
    ImageCaptureControl.setOptions(function(result1){
       ImageCaptureControl.addCameraView(function(result){
           $.mobile.loading( "hide");
       },function(error){
           $.mobile.loading( "hide");
           alert("ImageCaptureControl.addCameraView error !"+error);
       },layoutProp);
    },function(error){
       $.mobile.loading( "hide");
       alert(" ImageCaptureControl.setOptions error !"+error);
    },imageCaptureViewProperties);
}
/*
 * Calling the takePicture method of Image Capture Control
 *
 */
function takeButtonAction(){
    $.mobile.loading( "show");
    ImageCaptureControl.takePicture(function(result){
        console.log("takePicture success"); 
    },function(error){
        alert("takePicture error!"+error)
    });
}
/*
 * Hide the image capture view
 *
 */
function hideImageCaptureView(){
    if(captureInnerHtml == ""){
        removeImageCaptureListeners();
       ImageCaptureControl.removeCameraView(function(result){
           console.log("removeCameraView success"); 
       },function(error){
           alert("removeCameraView error !"+error);
       });
       fromCaptureSettingsScreen = false;
    }
}
/*
 * removing the preview screen and display the image capture control for taking the picture again
 *
 */
function reTakeButtonAction(){
    //Remove the image from the image array
    if(imageObject){
        imageObject.deleteImage(function(result){
            console.log("deleteImage success"); 
        },function(err){
            alert("deleteImage error"+err);
          });
    }
    if(continousImgObject){
        continousImgObject.deleteImage(function(result){
            console.log("deleteImage success");
        },function(err){
            alert("deleteImage error"+err);
        });
    }
    continousImgObject = null;
    captureInnerHtml = "";
    imageObject = null;
    if(imageCaptureViewProperties.CaptureOptions.continuousMode){
        $("#captureNextButton").hide();
    }
    document.getElementById('captureViewContent').innerHTML="";
    isRegistered = false;
    if(!fromCaptureSettingsScreen){
    addImageCaptureListeners();
    }
    showImageCaptureView();
}
/*
 * Stop the continuous capturing and displaying the latest preview image
 *
 */
function stopButtonAction(){
    //get the base64 image from image array by passing image id as parameter and displaying the image
    if(continousImgObject){
		hideImageCaptureView();
        $.mobile.loading( "show");
        continousImgObject.base64Image(function(result){
            imageObject = continousImgObject;
            $("#captureNextButton").show();
            document.getElementById('captureViewContent').innerHTML ="<center><img id='imageCapturePreview' style='width:100%;'></img></center>";
            document.getElementById('imageCapturePreview').src = "data:image/jpeg;base64,"+result;
            var devHeight = $(window).height()-108;
            document.getElementById('imageCapturePreview').setAttribute("style","height:"+devHeight+"px");
            document.getElementById('takePictureButton').innerHTML="Retake";
            document.getElementById('takePictureButton').setAttribute('onclick', 'reTakeButtonAction()' );
            $.mobile.loading( "hide");
        },function(error){
            alert("base64Image error"+error);
            $.mobile.loading( "hide");
        });
    }
}
/*
 * Saving the image capture options
 *
 */
function captureSaveAction(){
    $.mobile.loading( "show");
    $("input[type='radio']").filter(".custom11").each(function () {
        if($(this).is(":checked")){
              var bool_value = ($(this).val() == "true") ? true : false;
              imageCaptureViewProperties.CaptureOptions.continuousMode = bool_value;
        }
    });
    
    $("input[type='radio']").filter(".custom12").each(function () {
        if($(this).is(":checked")){
              var bool_value = ($(this).val() == "true") ? true : false;
              imageCaptureViewProperties.CaptureOptions.videoFrame = bool_value;
        }
    });
    $("input[type='radio']").filter(".custom9").each(function () {
          if($(this).is(":checked")){
              imageCaptureViewProperties.CaptureOptions.FlashMode=$(this).val();
          }
    });
    $("input[type='radio']").filter(".custom10").each(function () {
          if($(this).is(":checked")){
              imageCaptureViewProperties.CaptureOptions.pageDetectMode =$(this).val();
          }
    });
    imageCaptureViewProperties.LevelingOptions.stabilityDelay = document.getElementById('sldr_StabilityDelayVal').value;
    alert(JSON.stringify(imageCaptureViewProperties));
    //set the image capture options to image capture control
    ImageCaptureControl.setOptions(function(result){
        console.log("ImageCaptureControl.setOptions success");
        $.mobile.changePage( "CaptureView.html", { transition: "slide"} );
       $.mobile.loading( "hide");
    },function(error){
        alert("ImageCaptureControl.setOptions error"+error);
       $.mobile.loading( "hide");
    },imageCaptureViewProperties);
}
/*
 * Navigate to the home screen
 *
 */
function captureHomeAction(){
    if(imageObject){
        captureInnerHtml = document.getElementById('captureViewContent').innerHTML;
    }else{
        imageObject = null;
        continousImgObject = null;
        ImageCaptureControl.removeCameraView(function(result){
            console.log("removeCameraView success"); 
        },function(error){
            alert("removeCameraView error !"+error);
          });
    }
    $.mobile.changePage( "Home.html", { transition: "slide"} );
}
/*
 * Navigate to the capture settings screen
 *
 */
function captureSettingsButtonAction(){
    if(isPreviewRunning){
    captureInnerHtml = document.getElementById('captureViewContent').innerHTML;
    fromCaptureSettingsScreen = true;
    hideImageCaptureView();
    $.mobile.changePage( "CaptureSettings.html", { transition: "slide"} );
    }else{
        alert("Capture Preview in Progress... Please wait");
    }
}
/*
 * Navigate to the review view screen
 *
 */
function captureNextAction(){
    if(imageObject){
        captureInnerHtml = document.getElementById('captureViewContent').innerHTML;
        hideImageCaptureView();
        fromCaptureSettingsScreen = true;
        $.mobile.changePage( "ReviewView.html", { transition: "slide"} );
    }else{
        if(!imageCaptureViewProperties.CaptureOptions.continuousMode){
            alert("Capture image before you navigate to Review Screen");
        }else{
            alert("Preview the Captured image by tapping the stop button before you navigate to Review Screen");
        }
    }
}
/*
 * Resets the application level settings to capture settings screen
 *
 */
function refreshCaptureSettings(){
     $("input[type='radio']").filter(".custom11").each(function () {
          var bool_value = ($(this).val() == "true") ? true : false;
          if(imageCaptureViewProperties.CaptureOptions.continuousMode ==bool_value){
                                                       
                $(this).prop('checked', true).checkboxradio('refresh');
          }else{
                $(this).prop('checked', false).checkboxradio('refresh');
          }
    });
    $("input[type='radio']").filter(".custom12").each(function () {
          var bool_value = ($(this).val() == "true") ? true : false;
          if(imageCaptureViewProperties.CaptureOptions.videoFrame == bool_value){
                $(this).prop('checked', true).checkboxradio('refresh');
          }else{
                $(this).prop('checked', false).checkboxradio('refresh');
          }
    });
    $("input[type='radio']").filter(".custom9").each(function () {
        if(imageCaptureViewProperties.CaptureOptions.FlashMode == $(this).val()){
            $(this).prop('checked', true).checkboxradio('refresh');
        }else{
            $(this).prop('checked', false).checkboxradio('refresh');
        }
    });
    $("input[type='radio']").filter(".custom10").each(function () {
        if(imageCaptureViewProperties.CaptureOptions.pageDetectMode ==$(this).val()){
            $(this).prop('checked', true).checkboxradio('refresh');
        }else{
            $(this).prop('checked', false).checkboxradio('refresh');
        }
    });
    $("#sldr_StabilityDelayVal").val(imageCaptureViewProperties.LevelingOptions.stabilityDelay);
    $("#sldr_StabilityDelayVal").slider("refresh");
}
/*
 * Navigate to the capture view screen
 *
 */
function cameraButtonAction(){
    captureInnerHtml = "";
    $.mobile.changePage( "CaptureView.html", { transition: "slide"} );
}
/*
 * Set the application level default settings to image capture view
 *
 */
function initializeCaptureOptions(){
    imageCaptureViewProperties = ImageCaptureControl.getImageCaptureViewOptions();
    imageCaptureViewProperties.FrameOptions.enabled = true;
    imageCaptureViewProperties.FrameOptions.borderColor = "#FFFFFF";
    imageCaptureViewProperties.FrameOptions.borderWidth = 3.0;
    imageCaptureViewProperties.FrameOptions.outerColor = "#000000";
    imageCaptureViewProperties.FrameOptions.width=0;
    imageCaptureViewProperties.FrameOptions.height = 0;
    imageCaptureViewProperties.LevelingOptions.enabled = true;
    imageCaptureViewProperties.LevelingOptions.levelThresholdPitch = 7;
    imageCaptureViewProperties.LevelingOptions.levelThresholdRoll = 7;
    imageCaptureViewProperties.LevelingOptions.deviceDeclinationPitch = 0;
    imageCaptureViewProperties.LevelingOptions.deviceDeclinationRoll = 0;
    imageCaptureViewProperties.LevelingOptions.stabilityDelay = 80;
    imageCaptureViewProperties.LevelingOptions.indicatorColorFocusing="#FFFF00";
    imageCaptureViewProperties.LevelingOptions.indicatorColorGood  = "#008000";
    imageCaptureViewProperties.LevelingOptions.indicatorColorNotLevel = "#FF0000";
    imageCaptureViewProperties.LevelingOptions.indicatorColorNotStable = "#0000FF";
    imageCaptureViewProperties.CaptureOptions.FlashMode = "AUTO";
    imageCaptureViewProperties.CaptureOptions.videoFrame = false;
    imageCaptureViewProperties.CaptureOptions.pageDetectMode = "OFF";
    imageCaptureViewProperties.CaptureOptions.continuousMode = false;
}

//End Image Capture section methods



/* Invokes Device Gallery/Photo shared library using PhoneGap API
 * 
 * - gets selected image as base64 string
 *  
 */

function galleryButtonAction(){
  $.mobile.loading( "show");
  destinationType =  navigator.camera.DestinationType;
    imageObject = null;
    processedImageObject = null;
  navigator.camera.getPicture(function(data){
      getImgIdBase64(data);
  }, function(data){
      $.mobile.loading( "hide");
      alert("Capture fail"+ JSON.stringify(data));
  }, { quality: 70, 
      destinationType : navigator.camera.DestinationType.DATA_URL,
      sourceType:  Camera.PictureSourceType.PHOTOLIBRARY });
}

/* Saves given base64 Image in image array
 * 
 * @param - image as base64 string
 * 
 * @return - Image Id of saved image
 *  
 */


function getImgIdBase64(base64Str) {
    console.log("calling getImgIdBase64 from app.js");
    
    ImageArray.getImageFromBase64(function(data){
        console.log("calling success kfxCordova.ImageArray.getImageFromBase64 from app.js"+JSON.stringify(data));
        imageObject = data;
        fromGallery = true;
        showReviewScreen();
    },function (data) {
        alert("error getImgIdBase64"+JSON.stringify(data));
        $.mobile.loading( "hide");
    },base64Str);
};



// Start of Review View methods


/* 
 * Assigns application level default setting values
 *  
 */

function initializeReviewScreenOptions(){
        imageProcessorOptions = ImageProcessor.getImageProcessingOptions();
        imageProcessorOptions.ProcessedImage.representation = "IMAGE_REP_BITMAP";
        imageProcessorOptions.ProcessedImage.mimeType = "MIMETYPE_PNG";
        imageProcessorOptions.BasicSettingsProfile.cropType = "CROP_AUTO";
        
        imageProcessorOptions.BasicSettingsProfile.doDeskew = "true";
        imageProcessorOptions.BasicSettingsProfile.outputDPI = 100;
        imageProcessorOptions.BasicSettingsProfile.outputBitDepth = "BITONAL";
}

/* 
 * Resets application level settings for review screen settings
 *  
 */
function refreshProcessSettings(){
    $("input[type='radio']").filter(".imgRep").each(function () {
        if(imageProcessorOptions.ProcessedImage.representation == $(this).val()){
            $(this).prop('checked', true).checkboxradio('refresh');
        }else{
            $(this).prop('checked', false).checkboxradio('refresh');
        }
    });
    
    $("input[type='radio']").filter(".imgMime").each(function () {
        if(imageProcessorOptions.ProcessedImage.mimeType == $(this).val()){
            $(this).prop('checked', true).checkboxradio('refresh');
        }else{
            $(this).prop('checked', false).checkboxradio('refresh');
        }
    });
    
    if(imageProcessorOptions.BasicSettingsProfile.doDeskew == "true"){
    $("#flip1").val('true').slider("refresh");
    }else{
    $("#flip1").val('false').slider("refresh");
    }
    
    $("#processedImageFilePath").val("/var/mobile/Applications/3AA0E941-431D-4490-A443-28347A0FC5B3/Documents/test");
    
    $("#outputdpi").val(imageProcessorOptions.BasicSettingsProfile.outputDPI);
    
    $("input[type='radio']").filter(".bitdepth").each(function () {
        if(imageProcessorOptions.BasicSettingsProfile.outputBitDepth == $(this).val()){
            $(this).prop('checked', true).checkboxradio('refresh');
        }else{
            $(this).prop('checked', false).checkboxradio('refresh');
        }
    });
    
    $("input[type='radio']").filter(".cropSettings").each(function () {
        if(imageProcessorOptions.BasicSettingsProfile.cropType == $(this).val()){
            $(this).prop('checked', true).checkboxradio('refresh');
        }else{
            $(this).prop('checked', false).checkboxradio('refresh');
        }
    });
}

/* 
 * Saves all settings
 *  
 */
function reviewSaveAction(){
    console.log('reviewSaveAction ');
    
    processedImageFilePath = "";
    filePathInprocessorSettings = $("#processedImageFilePath").val();
    
    if($("input[name=repradio]:checked").val() == 'IMAGE_REP_FILE' || $("input[name=repradio]:checked").val() == 'IMAGE_REP_BOTH'){
        
        
        processedImageFilePath = $("#processedImageFilePath").val();
        
        if(processedImageFilePath.trim() != "")
        {
         if($("input[name=mimetyperadio]:checked").val() == 'MIMETYPE_TIFF'){
             processedImageFilePath = processedImageFilePath+'.tif';
        }else if($("input[name=mimetyperadio]:checked").val() == 'MIMETYPE_PNG'){
            processedImageFilePath = processedImageFilePath+'.png';
        }else if($("input[name=mimetyperadio]:checked").val() == 'MIMETYPE_JPEG'){
            processedImageFilePath = processedImageFilePath+'.jpg';    
        }
         
        }
    }
    
    imageProcessorOptions.ProcessedImage.representation = $("input[name=repradio]:checked").val();
    imageProcessorOptions.ProcessedImage.mimeType = $("input[name=mimetyperadio]:checked").val();
    imageProcessorOptions.BasicSettingsProfile.cropType = $("input[name=cropradio]:checked").val();
    console.log(" input[name=cropradio]:checked).val() :: "+imageProcessorOptions.BasicSettingsProfile.cropType);
    if($("input[name=cropradio]:checked").val() == 'CROP_TETRAGON'){
        showCropTetragon = true;
        console.log("showCropTetragon = true ");
    }else{
        showCropTetragon = false;
    }
    imageProcessorOptions.BasicSettingsProfile.doDeskew = $("#flip1").val();
    imageProcessorOptions.BasicSettingsProfile.outputDPI = $("#outputdpi").val();
    imageProcessorOptions.BasicSettingsProfile.outputBitDepth = $("input[name=outputbitdepthradio]:checked").val();
    alert(JSON.stringify(imageProcessorOptions));
    $.mobile.back();
}

/* 
 * Navigates to settings page
 *  
 */
function reviewSettingsButtonAction(){
    if(isProcessRunning){
        alert("Image Processing in Progress... Please wait");
    }else{
    hideCapturedImage();
    $.mobile.changePage( "ReviewSettings.html", { transition: "slide"} );
    }
}

function reviewBackAction(){
    if(isProcessRunning){
        alert("Image Processing in Progress... Please wait");
    }else{
        hideCapturedImage();
        if(fromGallery){
            $.mobile.changePage( "Home.html", { transition: "slide"} );
        }else{
            $.mobile.changePage( "CaptureView.html", { transition: "slide"} );
        }
    }
}

function barcodeResultBackAction(){
    $.mobile.changePage( "BarcodeView.html", { transition: "slide"} );
}
/* 
 * will be invoked, once image processing gets completed
 * 
 * @gets processed image imageId 
 *  
 */
var imageOutHandler = function(message){
    processedImageBase64Data = '';
    message.base64Image(function(result){
        processedImageBase64Data = result;
        if(processedImageObject){
            processedImageObject.deleteImage(function(result){
                console.log("removeImages success"+result);
            },function(error){
                alert("Error! removeImages"+JSON.stringify(error));
            });
        }
        processedImageObject = message;
        isProcessRunning = false;
        hideCapturedImage();
        $.mobile.changePage( "EmailView.html", { transition: "slide"} );
        
    }, function(result){
        $("#processToggleBtn").text("Process");
        $("#reviewViewFooter").trigger("create");
        isProcessRunning = false;
        alert(JSON.stringify(result));
    });
    
    console.log("Success addImageOutEventListener message"+message);
}

/* 
 * logs image processing percentage
 * 
 * @gets image processing percentage 
 *  
 */
var processProgressHandler = function(message){
    console.log("calling processProgressHandler from app.js ProgressPercent :: "+message.ProgressPercent);
};

/* 
 *  ImageProcessorOptions Success callback
 *  
 */

var ipOptionsSetCB = function(message){
    ImageProcessor.processImage(function(result){
        console.log("Success! processImage"+result);
    },function(result){
        isProcessRunning = false;
        $("#processToggleBtn").text("Process");
        $("#reviewViewFooter").trigger("create");
        alert("Error! processImage "+JSON.stringify(result));
    },imageObject.imgID);
};

function setProcessorOptions(){
    var bTetragon = 'CROP_TETRAGON';
    
    if(imageProcessorOptions.BasicSettingsProfile.cropType == bTetragon){
        
        ImageReviewControl.getOptions(function(tetragon){
                                                  
              imageProcessorOptions.BasicSettingsProfile.BoundingTetragon.TopLeft.x = tetragon.Tetragon.TopLeft.x;
              imageProcessorOptions.BasicSettingsProfile.BoundingTetragon.TopLeft.y = tetragon.Tetragon.TopLeft.y;
              imageProcessorOptions.BasicSettingsProfile.BoundingTetragon.TopRight.x = tetragon.Tetragon.TopRight.x;
              imageProcessorOptions.BasicSettingsProfile.BoundingTetragon.TopRight.y = tetragon.Tetragon.TopRight.y;
              imageProcessorOptions.BasicSettingsProfile.BoundingTetragon.BottomLeft.x = tetragon.Tetragon.BottomLeft.x;
              imageProcessorOptions.BasicSettingsProfile.BoundingTetragon.BottomLeft.y = tetragon.Tetragon.BottomLeft.y;
              imageProcessorOptions.BasicSettingsProfile.BoundingTetragon.BottomRight.x = tetragon.Tetragon.BottomRight.x;
              imageProcessorOptions.BasicSettingsProfile.BoundingTetragon.BottomRight.y = tetragon.Tetragon.BottomRight.y;
              console.log('----------crop---------'+JSON.stringify(imageProcessorOptions));
              ImageProcessor.setImageProcessorOptions(ipOptionsSetCB,function(result){
                  isProcessRunning = false;
                  alert("Error! setImageProcessorOptions"+JSON.stringify(result));
              },imageProcessorOptions);
              
              
          },function(result){
             isProcessRunning = false;
             alert("Error! getImageReviewEditView"+JSON.stringify(result));
          },null);
    }
    else{
        ImageProcessor.setImageProcessorOptions(ipOptionsSetCB,function(result){
           isProcessRunning = false;
           alert("Error! setImageProcessorOptions"+JSON.stringify(result));
        },imageProcessorOptions);
    }
}

/*
 *  Cancel/Process Image based on given settings
 *
 */

function processButtonAction(){
    if($("#processToggleBtn").text() == "Process"){
        isProcessRunning = true;
        if(imageProcessorOptions.ProcessedImage.representation == 'IMAGE_REP_FILE'||imageProcessorOptions.ProcessedImage.representation == 'IMAGE_REP_BOTH'){
            if(processedImageFilePath != ""){
                ImageProcessor.specifyProcessedImageFilePath(function(result){
                     console.log("specifyProcessedImageFilePath success"+result);
                     setProcessorOptions();
                }, function(result){
                     isProcessRunning = false;
                     alert("specifyProcessedImageFilePath error"+JSON.stringify(result));
                }, processedImageFilePath);
                
            }else{
                isProcessRunning = false;
                alert("Please provide file path then you can continue");
            }
        }else{
            setProcessorOptions();
        }
        $("#processToggleBtn").text("Cancel");
        $("#reviewViewFooter").trigger("create");
    }else{
        isProcessRunning = false;
        $("#processToggleBtn").text("Process");
        $("#reviewViewFooter").trigger("create");
        ImageProcessor.cancelImageProcess(function(result){
              console.log("Success! cancelImageProcess"+result);
        },function(result){
              alert("Error! cancelImageProcess"+result);
        });
        
    }
}

/* 
 *  ImageProcessor.addAnalysisCompleteListener Success callback
 *  
 */

var analysisCompleteHandler = function(message){
    delete message["image"];
    doQuickButtonIsPressed = false;
    alert( JSON.stringify(message) );
};

/* 
 *  Performs Quick Analysis on currently shown image in Image Review Edit Control
 *  
 */

function doQucikAnalysisButtonAction(){
    if(!doQuickButtonIsPressed){
        doQuickButtonIsPressed = true;
        $.mobile.loading( "show");
        ImageReviewControl.getImage(function(imageIdRecieved){
            console.log("success ImageReviewEditView getImage "+imageIdRecieved);
            var doQuickAnalysisOptions = {
                imageID:imageIdRecieved,
                generateOutputImage:false
            };
            ImageProcessor.doQuickAnalysis(function(result){
               console.log("success doQuickAnalysis"+result);
               $.mobile.loading( "hide");
            },function(result){
               alert("Error! doQuickAnalysis"+JSON.stringify(result));
               $.mobile.loading( "hide");
            },doQuickAnalysisOptions);
        }, function(result){
            alert("Error! ImageReviewEditView getImage "+JSON.stringify(result));
            $.mobile.loading( "hide");
        });
    }
}

/* 
 *  navigates to Review View
 *  
 */

function showReviewScreen() {
    console.log("calling showReviewScreen from app.js");
    $.mobile.changePage( "ReviewView.html", { transition: "slide"} );
    $.mobile.loading( "hide");
};


/* 
 *  show/hides crop Tetragon in ImageReview Edit Control 
 *  
 */

function showBoundingTetragon(visibile){
    var options = ImageReviewControl.getImageReviewEditViewOptions();
    
    if(visibile){
        options.Tetragon.show = true;
    }else{
        options.Tetragon.show = false;
    }
    
    options.Tetragon.TopLeft = null;
    options.Tetragon.TopRight = null ;
    options.Tetragon.BottomLeft = null ;
    options.Tetragon.BottomRight = null;
    options.Crop.lineColor = '#00FF00';
    ImageReviewControl.setOptions(function(data){
        console.log("success ImageReviewEditView.setOptions "+data);
    },function (data) {
        alert("Error ! ImageReviewEditView.setOptions "+JSON.stringify(data));
    },options);
}

/*
 *  shows Image in ImageReview Edit Control
 *
 *  @param - ImageId
 */

function showCapturedImage(imageId) {
    $.mobile.loading( "show");
    console.log("calling showCapturedView from app.js");
    Layout =  kfxCordova.getLayoutProperties();
    var y=0;
    if(parseInt(device.version)>=7&&device.platform=="iOS"){
        y=64;
    }else{
        y=44;
    }
    Layout.x=0;
    Layout.y=y;
    Layout.width = $(window).width();
    Layout.height = $(window).height()-108;
    Layout.visibility = true;
    ImageReviewControl.addImageReviewEditView(function(data){
          console.log("calling success kfxCordova.ImageReviewEditView.addImageReviewEditView ");
          ImageReviewControl.setImage(function(data){
              console.log("calling success kfxCordova.ImageReviewEditView.setImage from app.js");
              showBoundingTetragon(showCropTetragon);
              $.mobile.loading( "hide");
          },function (data) {
              $.mobile.loading( "hide");
              alert("Error! "+JSON.stringify(data));
          },imageId);
    },function (data) {
          alert("Error addImageReviewEditView! "+JSON.stringify(data));
          $.mobile.loading( "hide");
    },Layout);
};

/* 
 *  Hides ImageReview Edit Control view 
 *   
 */

function hideCapturedImage() {
    console.log("calling hideCapturedImage from app.js");
    
    ImageReviewControl.removeView(function(data){
        console.log("calling success ImageReviewEditView.removeView");
    },function(error){
        alert("Error ImageReviewControl.removeView! "+error);         
    });
};

//End of Review View methods

// Start of Email View methods

/* 
 *  Invokes mail client, with processed image as mail attachment.  
 *   
 */


function emailButtonAction() {
    
    console.log("emailButtonAction");
    if (processedImageBase64Data == '') {
        alert("Cannot send unprocessed Image"+error);
        return;
    }else{
        var processedImageName = null;
        if(imageProcessorOptions.ProcessedImage.mimeType == "MIMETYPE_PNG"){
            processedImageName = "processedImage.png";
        }else if(imageProcessorOptions.ProcessedImage.mimeType == "MIMETYPE_JPEG"){
            processedImageName = "processedImage.jpg";
        }else if(imageProcessorOptions.ProcessedImage.mimeType == "MIMETYPE_TIFF"){
            processedImageName = "processedImage.tif";
        }else{
            processedImageName = "processedImage.png";
        }
        if(device.platform=="iOS"){
            var emailComposer = cordova.require('emailcomposer.EmailComposer');
            emailComposer.show({
               to: '',
               cc: '',
               bcc: '',
               subject: processedImageObject.imgID,
               attachments: [
                 {
                     mimeType: 'image/png',
                     encoding: 'Base64',
                     data: processedImageBase64Data,
                     name: processedImageName
                 }
               ],
               onSuccess: function (winParam) {
                   hideCapturedImage();
                   processedImageId = "";
                   $.mobile.changePage( "Home.html", { transition: "slide"} );
                   console.log('EmailComposer onSuccess - return code ' + winParam.toString());
               },
               onError: function (error) {
                    console.log('EmailComposer onError - ' + error.toString());
               }
           });
        }else{
            window.plugin.email.open({
                to:      [''],
                subject: processedImageObject.imgID,
                body:    '',
                attachments: ['base64:'+processedImageName+'//'+processedImageBase64Data ]
            }, function(result){
                hideCapturedImage();
                processedImageId = "";
                $.mobile.changePage( "Home.html", { transition: "slide"} );
            },this);
        }
    }
}

function emailBackAction() {
    $.mobile.changePage( "ReviewView.html", { transition: "slide"} );
}

// End of Email View methods

//Barcode methods

/*
 * Navigate to the barcode view
 *
 */

function barcodeButtonAction(){
    $.mobile.changePage( "BarcodeView.html", { transition: "slide"} );
}
/*
 * Calling the readBarcode method of barcode capture control
 *
 */
function readBarcodeAction(){
    var eventListenerMethod = function(result){
        bcResult = result;
        hideBarcodeView();
        $.mobile.changePage( "BarcodeResult.html", { transition: "slide"} );
    }
    //Adding the barcode event listener
    BarcodeCaptureControl.addEventListener(function(data){
        console.log("BarcodeCaptureControl.addEventListener success");
    },function(error){
        alert(" BarcodeCaptureControl.addEventListenererror error !"+error);
      },eventListenerMethod);
    //call the readBarcode method of barcode capture control
    BarcodeCaptureControl.readBarcode(function(result){
        console.log("BarcodeCaptureControl.readBarcode success");
    },function(error){
        alert("BarcodeCaptureControl.readBarcode error!"+error);
       });
}
/*
 * hide the barcode view
 *
 */
function hideBarcodeView(){
    //var layoutProp = kfxCordova.getLayoutProperties();
    //layoutProp.visibility = false;
    //BarcodeCaptureControl.addView(function(result){},function(error){alert("error")},layoutProp);
    BarcodeCaptureControl.removeEventListener(function(data) {
        console.log("removeEventListener success");
      }, function(error) {
        alert("error removeEventListener"+error);
    });
    BarcodeCaptureControl.removeView(function(data){
        console.log("BarcodeCaptureControl.removeView success");
    }, function(error) {
      alert("BarcodeCaptureControl.removeView"+error);
  });
}
/*
 * Navigate to the barcode settings screen
 *
 */
function barcodeSettingsButtonAction(){
    hideBarcodeView();
    $.mobile.changePage( "BarcodeSettings.html", { transition: "slide"} );
}
/*
 * Saving the barcode capture options
 *
 */
function barcodeSaveAction(){
    $.mobile.loading("show");
    var guidingLine="",searchDirections=[],symbologies=[];
    $("input[type='radio']").filter(".custom").each(function () {
          if($(this).is(":checked")){
             guidingLine= $(this).val();
          }
    });
    $("input[type='checkbox']").filter(".custom").each(function(){
          var name=$(this).attr("name");
          if($(this).is(":checked")){
             searchDirections.push(name);
          }
    });
    $("input[type='checkbox']").filter(".custom1").each(function(){
         var name=$(this).attr("name");
         if($(this).is(":checked")){
             symbologies.push(name);
         }
    });
    bcOptions.guidingLine = guidingLine;
    bcOptions.searchDirection = searchDirections;
    bcOptions.symbologies = symbologies;
    var successCallback=function(data){
        navigator.notification.alert(JSON.stringify(data), function(){}, 'Barcode Test App', 'Ok');
    }
    alert(JSON.stringify(bcOptions));
    //set the barcode capture options to the barcode capture control
    BarcodeCaptureControl.setOptions(function(result){
        $.mobile.changePage( "BarcodeView.html", { transition: "slide"} );
        $.mobile.loading("hide");
    },function(error){
        console.log("BarcodeCaptureControl.setOptions"+error);
        $.mobile.loading("hide");
    }, bcOptions);
    console.log('barcode save');
}
/*
 * Navigate to the home screen
 *
 */
function barcodeHomeAction(){
    hideBarcodeView();
    bcResult=null;
    $.mobile.changePage( "Home.html", { transition: "slide"} );
}
/*
 * Adding the barcode capture control to the view
 *
 */
function showBarcodeView(){
    $.mobile.loading( "show");
    var width = $(window).width();
    var height=$(window).height()-108;
    var x=0,y=0;
    if(parseInt(device.version)>=7&&device.platform=="iOS"){
        y=64;
    }else{
        y=44;
    }
    var layoutProp = kfxCordova.getLayoutProperties();
    layoutProp.x= x;
    layoutProp.y= y;
    layoutProp.width=width;
    layoutProp.height= height;
    //add the barcode capture control to the view
    BarcodeCaptureControl.addView(function(result){
       //set the barcode capture options to the barcode capture control
       BarcodeCaptureControl.setOptions(function(result1){
           $.mobile.loading( "hide");
       },function(error){
           alert("BarcodeCaptureControl.setOptions"+error);
           $.mobile.loading("hide");
       }, bcOptions);
   },function(error){
       alert("BarcodeCaptureControl.addView"+error);
       $.mobile.loading( "hide");
   },layoutProp);
}
/*
 * Resets the application level settings to barcode capture view
 *
 */
function refreshBarcodeSettings(){
    var guidingLine = bcOptions.guidingLine;
    var searchDirections = bcOptions.searchDirection;
    var symbologies = bcOptions.symbologies;
    $("input[type='radio']").filter(".custom").each(function () {
        if(guidingLine == $(this).val()){
            $(this).prop('checked', true).checkboxradio('refresh');
        }else{
            $(this).prop('checked', false).checkboxradio('refresh');
        }
    });
    $("input[type='checkbox']").filter(".custom").each(function(){
        var name=$(this).attr("name");
        if(searchDirections.indexOf(name) > -1){
            $(this).prop('checked', true).checkboxradio('refresh');
        }else{
            $(this).prop('checked', false).checkboxradio('refresh');
        }
    });
    $("input[type='checkbox']").filter(".custom1").each(function(){
        var name=$(this).attr("name");
        if(symbologies.indexOf(name) > -1){
            $(this).prop('checked', true).checkboxradio('refresh');
        }else{
            $(this).prop('checked', false).checkboxradio('refresh');
        }
    });
}
/*
 * Displayig the barcode results in the preview screen
 *
 */
function setBarcodeResult(){
    if(bcResult){
        //document.getElementById("previewimage").src = "data:image/png;base64,"+responseObject.image.imageData;
        document.getElementById("bc_type").innerHTML="Type : "+bcResult.type;
        document.getElementById("bc_boundingBox").innerHTML="BondingBox : "+JSON.stringify(bcResult.boundingBox);
        // var decodedValue = window.atob(bcResult.value);
        document.getElementById("bc_value").innerHTML="Value : "+bcResult.value;
        document.getElementById("bc_direction").innerHTML="Direction : "+bcResult.direction;
        document.getElementById("bc_dataFormat").innerHTML="DataFormat : "+bcResult.dataFormat;
        document.getElementById("bc_imageID").innerHTML="ImageID : "+bcResult.image.ID;
    }
}
/*
 * Set the application level default settings to the barcode capture view
 *
 */
function initializeBarcodeOptions(){
    bcOptions = BarcodeCaptureControl.getBarcodeCaptureControlparameters();
    bcOptions.searchDirection=["VERTICAL","HORIZONTAL"];
    bcOptions.symbologies=["CODE39","PDF417"];
    bcOptions.guidingLine="LANDSCAPE";
}
//End Barcode methods

function cleanImageArray(){
    ImageArray.getImageIDs(function(imageIDs) {
        
        if(imageIDs.length > 0){
            ImageArray.removeImages(function(data){
            console.log("ImageArray.removeImages success");            
        },function(error){
            alert("ImageArray.removeImages error!"+error);
          },imageIDs);
        }
    }, function(error){
        alert("ImageArray.getImageIDs error !"+error);
       });
}

$(document).bind("pageshow",function(e,data){
     var currentpage = $('.ui-page-active').attr('id');
     if(currentpage == "homePage"){
        console.log('home page show');
        if(appIsLaunched){
            cleanImageArray();
        }else{
            appIsLaunched = true;
        }
        imageObject = null;
        processedImageObject = null;
        showCropTetragon = false;
     }else if(currentpage == "captureViewPage"){
         addImageCaptureListeners();
         continousImgObject = null;
         $("#captureIntimationImage").hide();
         if(!imageCaptureViewProperties){
            initializeCaptureOptions();
         }
         if(imageCaptureViewProperties.CaptureOptions.continuousMode && (!captureInnerHtml || captureInnerHtml=="")){
            $("#captureNextButton").hide();
         }else{
            $("#captureNextButton").show();
         }
         showImageCaptureView();
         showCropTetragon = false;
         console.log('capture view page show');
      }else if(currentpage == "captureSettingsPage"){
         refreshCaptureSettings();
         console.log('capture settings page show');
      }else if(currentpage == "barcodeViewPage"){
        if(!bcOptions){
           initializeBarcodeOptions();
        }
        showBarcodeView();
        console.log('barcode view page show');
     }else if(currentpage == "barcodeSettingsPage"){
        refreshBarcodeSettings();
        console.log('barcode settings page show');
     }else if(currentpage == "barcodeResultPage"){
        setBarcodeResult();
        console.log('bar code result page show');
     }else if(currentpage == "reviewViewPage"){
        console.log('processor view page show');
        addImageProcessorListeners();
        doQuickButtonIsPressed = false;
         if(imageProcessorOptions == null){
             showCropTetragon = false;
             initializeReviewScreenOptions();
         }else{
             if(imageProcessorOptions.BasicSettingsProfile.cropType == "CROP_TETRAGON"){
                showCropTetragon = true;
             }else{
                showCropTetragon = false;
             }
         }
         showCapturedImage(imageObject.imgID);
        
     }else if(currentpage == "processorSettingsPage"){
        console.log('processor settings page show');
        refreshProcessSettings();
     }else if(currentpage == "emailViewPage"){
         console.log('emailViewPage page show');
         showCropTetragon = false;
         showCapturedImage(processedImageObject.imgID);
      }
});

$(document).bind("pagehide",function(e,data){
    var previousPage =e.target.id;
    if(previousPage == "homePage"){
    }else if(previousPage == "captureViewPage"){
        removeImageCaptureListeners();
    }else if(previousPage == "reviewViewPage"){
        removeImageProcessorListeners();   
    }else if(previousPage == "barcodeViewPage"){
    }
   });

$( document ).on( "mobileinit", function() {
     $.mobile.loader.prototype.options.text = "loading";
     $.mobile.loader.prototype.options.textVisible = false;
     $.mobile.loader.prototype.options.theme = "a";
     $.mobile.loader.prototype.options.html = "";
});



