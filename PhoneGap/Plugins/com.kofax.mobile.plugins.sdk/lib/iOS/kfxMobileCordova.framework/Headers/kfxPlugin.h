//
//  KofaxMainPlugin.h
//  KofaxPGSDK
//
//  Created by Kiranpal Reddy Gurijala on 3/5/14.
//
//

#import "CDVPlugin.h"
@interface kfxPlugin : CDVPlugin
#pragma mark
#pragma mark UTILITIES Methods


-(void) kutSetMobileSDKLicense:(CDVInvokedUrlCommand*)command;
-(void) kutGetDaysRemaining:(CDVInvokedUrlCommand*)command;
-(void)kutGetSDKVersions:(CDVInvokedUrlCommand*)command;

#pragma mark
#pragma mark image capture control class
-(void)kuiTakePicture :(CDVInvokedUrlCommand*)command;
-(void)kuiAddCameraView :(CDVInvokedUrlCommand*)command;

-(void)kuiRemoveCameraView :(CDVInvokedUrlCommand*)command;



-(void)kuiAddImageCapturedListener :(CDVInvokedUrlCommand*)command;
-(void)kuiRemoveImageCapturedListener :(CDVInvokedUrlCommand*)command;

-(void)kuiAddStablityDelayListener :(CDVInvokedUrlCommand*)command;
-(void)kuiRemoveStablityDelayListener :(CDVInvokedUrlCommand*)command;

-(void)kuiAddLevelnessListener :(CDVInvokedUrlCommand*)command;
-(void)kuiRemoveLevelnessListener :(CDVInvokedUrlCommand*)command;

-(void)kuiAddFocusListener :(CDVInvokedUrlCommand*)command;
-(void)kuiRemoveFocusListener :(CDVInvokedUrlCommand*)command;

-(void)kuiSetImageCaptureOptions :(CDVInvokedUrlCommand*)command;

-(void)kuiGetImageCaptureOptions :(CDVInvokedUrlCommand*)command;
-(void)kuiAddPageDetectionListener:(CDVInvokedUrlCommand*)command;
-(void)kuiRemovePageDetectionListener:(CDVInvokedUrlCommand*)command;

#pragma mark
#pragma mark imagearray
-(void)kedGetTotalImages:(CDVInvokedUrlCommand*)command;
-(void)kedGetImageIds:(CDVInvokedUrlCommand*)command;
-(void)kedGetImageProperties:(CDVInvokedUrlCommand*)command;
-(void)kedGetImageFromBase64:(CDVInvokedUrlCommand*)command;
-(void)kedGetImageFromFilePath:(CDVInvokedUrlCommand*)command;
-(void)kedGetImageToBase64:(CDVInvokedUrlCommand*)command;
-(void)kedRemoveImages:(CDVInvokedUrlCommand*)command;
-(void)kedSetImageProperties:(CDVInvokedUrlCommand*)command;

#pragma mark
#pragma mark BarcodeCaptureController
-(void)kbcSetOptions:(CDVInvokedUrlCommand*)command;
-(void)kbcGetOptions:(CDVInvokedUrlCommand*)command;
-(void)kbcReadBarcode:(CDVInvokedUrlCommand*)command;
-(void)kbcAddView:(CDVInvokedUrlCommand*)command;
-(void)kbcRemoveView:(CDVInvokedUrlCommand*)command;
-(void)kbcAddEventListener:(CDVInvokedUrlCommand*)command;
-(void)kbcRemoveEventListener:(CDVInvokedUrlCommand*)command;

#pragma mark
#pragma mark image Review Edit Control class
-(void)kuiAddImageReviewView:(CDVInvokedUrlCommand*)command;
-(void)kuiSetImageReviewEditOptions:(CDVInvokedUrlCommand*)command;
-(void)kuiGetImageReviewEditOptions:(CDVInvokedUrlCommand*)command;
-(void)kuiRemoveImageReviewView:(CDVInvokedUrlCommand*)command;
-(void)kuiSetImage:(CDVInvokedUrlCommand*)command;
-(void)kuiGetImage:(CDVInvokedUrlCommand*)command;

#pragma mark
#pragma mark ENGINES Methods

-(void)kenImageProcessorSetOptions:(CDVInvokedUrlCommand*)command;
-(void)kenImageProcessorGetOptions:(CDVInvokedUrlCommand*)command;
-(void)kenCancelImageProcess:(CDVInvokedUrlCommand*)command;
-(void)kenSpecifyProcessedImageFilePath:(CDVInvokedUrlCommand*)command;
-(void)kenGetProcessedImageFilePath:(CDVInvokedUrlCommand*)command;

-(void)kenProcessImage:(CDVInvokedUrlCommand*)command;

-(void)kenImageProcessorAddImageOutEventListener:(CDVInvokedUrlCommand*)command;
-(void)kenImageProcessorAddProcessProgressListener:(CDVInvokedUrlCommand*)command;
-(void)kenImageProcessorRemoveImageOutEventListener:(CDVInvokedUrlCommand*)command;
-(void)kenImageProcessorRemoveProcessProgressListener:(CDVInvokedUrlCommand*)command;


-(void)kenImageProcessorDoQuickAnalysis:(CDVInvokedUrlCommand*)command;

-(void)kenImageProcessorAddAnalysisCompleteListener:(CDVInvokedUrlCommand*)command;
-(void)kenImageProcessorAddAnalysisProgressListener:(CDVInvokedUrlCommand*)command;
-(void)kenImageProcessorRemoveAnalysisCompleteListener:(CDVInvokedUrlCommand*)command;
-(void)kenImageProcessorRemoveAnalysisProgressListener:(CDVInvokedUrlCommand*)command;



#pragma mark
#pragma mark LOGISTICS Methods

@end
