// Copyright (c) 2012-2014 Kofax.  Use of this code is with permission pursuant to Kofax license terms.

#import <Cordova/CDV.h>
#import <kfxLibUIControls/kfxUIControls.h>
#import <kfxLibEngines/kfxEngines.h>

#import <MessageUI/MFMailComposeViewController.h>

@interface KFXMobileSdkPlugin : CDVPlugin<kfxKUIImageCaptureControlDelegate, kfxKIPDelegate, kfxKUIBarCodeCaptureControlDelegate, MFMailComposeViewControllerDelegate>
-(void) echo:(CDVInvokedUrlCommand *)command;
-(void) createImageCaptureControl:(CDVInvokedUrlCommand*)command;

+(void) setLicenseKey:(NSString*)key;
+(void) enablePageDetect:(BOOL)enable;
@end
