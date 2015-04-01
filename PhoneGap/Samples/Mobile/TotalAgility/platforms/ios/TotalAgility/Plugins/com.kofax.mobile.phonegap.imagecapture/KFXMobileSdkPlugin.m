// Copyright (c) 2012-2014 Kofax.  Use of this code is with permission pursuant to Kofax license terms.

#import <kfxLibUtilities/kfxUtilities.h>
#import "KFXMobileSdkPlugin.h"
#import "ControlLayout.h"
#import <sys/utsname.h>

#define CURRENT_VERSION @"1.1.0.0.0.0"
static BOOL Licensed = NO;

@interface KFXMobileSdkPlugin()
// Image capture control and flash
@property (nonatomic, retain) kfxKUIImageCaptureControl* _captureControl;
@property (nonatomic, retain) UISegmentedControl* _flashControl;

// Image review control
@property (nonatomic, retain) kfxKUIImageReviewAndEdit* _reviewControl;
@property (nonatomic, retain) kfxKUIImageReviewAndEdit* _postReviewControl;

// Image processor
@property (nonatomic, retain) kfxKENImageProcessor* _imageProcessor;
// Progress spinner for image processing
@property (nonatomic, retain) UIActivityIndicatorView* _progressSpinner;


// Barcode capture control
@property (nonatomic, retain) kfxKUIBarCodeCaptureControl* _barcodeCaptureControl;

// Most recent captured/processed image
@property(nonatomic, retain) kfxKEDImage* _image;

// Callbacks for various methods
@property(nonatomic, retain) NSString* _takePhotoCallbackId;
@property(nonatomic, retain) NSString* _imageProcessCallbackId;
@property(nonatomic, retain) NSString* _reviewProcessCallbackId;
@property(nonatomic, retain) NSString* _postReviewProcessCallbackId;
@property(nonatomic, retain) NSString* _analysisCompleteCallbackId;
@property(nonatomic, retain) NSString* _barcodeCapturedCallbackId;

@property (nonatomic) int _compressionQuality;

@end

@implementation KFXMobileSdkPlugin

static NSString* licenseKey;
static BOOL enablePageDetect = YES;

-(void)onReset
{
    if (self._captureControl)
    {
        [self._captureControl removeFromSuperview];
        self._captureControl.delegate = nil;
        self._captureControl = nil;
    }
    
    if (self._flashControl)
    {
        [self._flashControl removeFromSuperview];
        self._flashControl = nil;
    }
    
    if (self._reviewControl)
    {
        [self._reviewControl removeFromSuperview];
        self._reviewControl = nil;
    }
    
    if (self._postReviewControl)
    {
        [self._postReviewControl removeFromSuperview];
        self._postReviewControl = nil;
    }
    
    if (self._imageProcessor)
    {
        self._imageProcessor.delegate = nil;
        self._imageProcessor = nil;
    }
    
    
    if (self._barcodeCaptureControl)
    {
        [self._barcodeCaptureControl removeFromSuperview];
        self._barcodeCaptureControl.delegate = nil;
        self._barcodeCaptureControl = nil;
    }
    
    if (self._image)
    {
        self._image = nil;
    }
    
    if (self._progressSpinner)
    {
        [self._progressSpinner removeFromSuperview];
        self._progressSpinner = nil;
    }
    
    [super onReset];
}

+(void)setLicenseKey:(NSString *)key
{
    licenseKey = key;
}

+(void)enablePageDetect:(BOOL)enable
{
    enablePageDetect = enable;
}

-(void)getNativeVersion:(CDVInvokedUrlCommand*)command
{
    NSLog(@"Native version is %@", CURRENT_VERSION);
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:CURRENT_VERSION];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void)echo:(CDVInvokedUrlCommand *)command
{
    NSString* echoOperation = [command.arguments objectAtIndex:0];
    NSLog(@"Echo: %@", echoOperation);
    
    CDVPluginResult* pluginResult;
    if ([echoOperation isEqualToString:@"nativeVersion"])
    {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:CURRENT_VERSION];
    }
    else
    {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:echoOperation];
    }
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(BOOL)checkLicense
{
    kfxKUTLicensing* license = [[kfxKUTLicensing alloc] init];
    
    int errorCode = [license setMobileSDKLicense:licenseKey];
    return [self checkErrorCode:errorCode];
        
    return NO;
}

- (BOOL)checkErrorCode:(int)errorCode
{
    // This method is called everytime an SDK method is called.  If the method returns success, nothing happens.  If something else is returned, the corresponding error message is displayed.
    if (errorCode == KMC_SUCCESS)
    {
        return YES;
    }
    else
    {
        UIAlertView * alert;
        NSString * message = [kfxError findErrMsg:errorCode];
        NSString * description = [kfxError findErrDesc:errorCode];
        NSArray * split = [message componentsSeparatedByString:@": "];
        if (split.count == 2)
        {
            NSString * text = [NSString stringWithFormat:@"%@\n\n%@", [split objectAtIndex:1], description];
            alert = [[UIAlertView alloc] initWithTitle:[split objectAtIndex:0] message:text delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil];
        }
        else if(split.count > 2)
        {
            NSString * info = @"";
            for (int i = 1; i < split.count ; i++)
            {
                info = [NSString stringWithFormat:@"%@ %@", info, [split objectAtIndex:i]];
            }
            NSString * text = [NSString stringWithFormat:@"%@\n\n%@", info, description];
            alert = [[UIAlertView alloc] initWithTitle:[split objectAtIndex:0] message:text delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil];
        }
        else
        {
            NSString * text = [NSString stringWithFormat:@"%@\n\n%@", message, description];
            alert = [[UIAlertView alloc] initWithTitle:@"Kofax 2.0 SDK error." message:text delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil];
        }
        [alert show];
        return NO;
    }
    
}

-(void)createImageCaptureControl:(CDVInvokedUrlCommand *)command
{
    NSLog(@"Creating image capture control");
    
    // Licensing!
    if (!Licensed)
    {
        Licensed = [self checkLicense];
    }
    
    if (!self._imageProcessor)
    {
        [kfxKENImageProcessor initialize];
        
        self._imageProcessor = [[kfxKENImageProcessor alloc]init];
        self._imageProcessor.delegate = self;
    }
    
    
    // Only a single capture control is allowed.  If one is already allocated somehow,
    // log a warning and remove the old one.
    if (self._captureControl)
    {
        NSLog(@"Capture control already exists, deallocating");
        [self._captureControl removeFromSuperview];
        self._captureControl.delegate = nil;
        self._captureControl = nil;
    }
    
    if (self._flashControl)
    {
        [self._flashControl removeFromSuperview];
        self._flashControl = nil;
    }
    
    NSString* callbackID = command.callbackId;
    
    [kfxKUIImageCaptureControl initializeControl];
    self._captureControl = [[kfxKUIImageCaptureControl alloc] init];
    self._captureControl.delegate = self;
    self._captureControl.pageDetect = enablePageDetect;
    
    self._flashControl = [[UISegmentedControl alloc]initWithItems:@[@"Auto", @"On", @"Off"]];
    self._flashControl.segmentedControlStyle = UISegmentedControlStylePlain;
    self._flashControl.selectedSegmentIndex = 0;
    [self._flashControl addTarget:self action:@selector(flashControl:) forControlEvents: UIControlEventValueChanged];
    
    NSDictionary* options = [command.arguments objectAtIndex:0];
    [self imageCapture_setOptionsWithDictionary:options];
    
    [self.webView.scrollView addSubview:self._captureControl];
    [self.webView.scrollView addSubview:self._flashControl];
    
    NSDictionary* message = [[NSMutableDictionary alloc]init];
    [message setValue:@"id:rev" forKey:@"id"];
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:message];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:callbackID];
}

- (void)flashControl:(UISegmentedControl *)segment
{
    
    if (segment.selectedSegmentIndex == 0)
    {
        self._captureControl.flash = kfxKUIFlashAuto;
    }
    else if (segment.selectedSegmentIndex == 1)
    {
        self._captureControl.flash = kfxKUIFlashOn;
    }
    else
    {
        self._captureControl.flash = kfxKUIFlashOff;
    }
}

-(void)imageCapture_takePhoto:(CDVInvokedUrlCommand *)command
{
    NSLog(@"imageCapture_takePhoto");
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_NO_RESULT];
    [pluginResult setKeepCallback:[NSNumber numberWithBool:TRUE]];
    self._takePhotoCallbackId = command.callbackId;
    [self._captureControl takePicture];
}

-(void)imageCapture_startContinuousCapture:(CDVInvokedUrlCommand *)command
{
    NSLog(@"imageCapture_startContinuousCapture");
    self._image = nil;
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_NO_RESULT];
    [pluginResult setKeepCallback:[NSNumber numberWithBool:TRUE]];
    self._takePhotoCallbackId = command.callbackId;
    [self._captureControl doContinuousMode:YES];
}

-(void)imageCapture_stopContinuousCapture:(CDVInvokedUrlCommand *)command
{
    NSLog(@"imageCapture_stopContinuousCapture");
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [pluginResult setKeepCallback:[NSNumber numberWithBool:TRUE]];
    self._takePhotoCallbackId = command.callbackId;
    [self._captureControl doContinuousMode:NO];
}

-(void)imageCapture_setOptions:(CDVInvokedUrlCommand *)command
{
    NSLog(@"imageCapture_setOptions");
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    
    [self imageCapture_setOptionsWithDictionary: [command.arguments objectAtIndex:0]];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void)imageCapture_setOptionsWithDictionary:(NSDictionary*)options
{
    NSDictionary* layout = [options objectForKey:@"Layout"];
    if (layout)
    {
        CGRect rect = [ControlLayout parseLayout:layout];
        if (rect.size.width > 0 && rect.size.height > 0)
        {
            self._captureControl.frame = rect;
            self._flashControl.frame = CGRectMake(rect.origin.x + (rect.size.width / 2) - 82.5, rect.origin.y + 20, 165.0, 40.0);
        }
        
        NSNumber* visible = [layout objectForKey:@"visible"];
        if (visible)
		{
			[self._captureControl setHidden:![visible boolValue]];
			[self._flashControl setHidden:![visible boolValue]];
		}
    }
    
    NSDictionary* levelingOptions = [options objectForKey:@"LevelingOptions"];
    if (levelingOptions)
    {
        NSNumber* levelingEnabled = [levelingOptions objectForKey:@"enabled"];
        if (levelingEnabled)
        {
            self._captureControl.levelIndicator = [levelingEnabled boolValue];
        }
        
        NSNumber* levelingThresholdPitch = [levelingOptions objectForKey:@"levelThresholdPitch"];
        if (levelingThresholdPitch)
        {
            self._captureControl.levelThresholdPitch = [levelingThresholdPitch floatValue];
        }
        
        NSNumber* levelingThresholdRoll = [levelingOptions objectForKey:@"levelThresholdRoll"];
        if (levelingThresholdRoll)
        {
            self._captureControl.levelThresholdRoll = [levelingThresholdRoll floatValue];
        }
        
        NSNumber* levelingDeclinationPitch = [levelingOptions objectForKey:@"deviceDeclinationPitch"];
        if (levelingDeclinationPitch)
        {
            self._captureControl.deviceDeclinationPitch = [levelingDeclinationPitch floatValue];
        }
        NSNumber* levelingDeclinationRoll = [levelingOptions objectForKey:@"deviceDeclinationRoll"];
        if (levelingDeclinationRoll)
        {
            self._captureControl.deviceDeclinationRoll = [levelingDeclinationRoll floatValue];
        }
        NSNumber* levelingStabilityDelay = [levelingOptions objectForKey:@"stabilityDelay"];
        if(levelingStabilityDelay)
        {
            self._captureControl.stabilityDelay = [levelingStabilityDelay floatValue];
        }
    }
    
    NSDictionary* captureOptions = [options objectForKey:@"CaptureOptions"];
    if (captureOptions)
    {
        NSNumber* flashMode = [captureOptions objectForKey:@"FlashMode"];
        if (flashMode)
        {
            if ([flashMode intValue] == 0)
            {
                self._captureControl.flash = kfxKUIFlashOn;
            }
            else if ([flashMode intValue] == 1)
            {
                self._captureControl.flash = kfxKUIFlashOff;
            }
            else if ([flashMode intValue] == 2)
            {
                self._captureControl.flash = kfxKUIFlashAuto;
            }
            else
            {
                // todo error
            }
        }
        
        NSNumber* pageDetectEnabled = [captureOptions objectForKey:@"pageDetectEnabled"];
        if (pageDetectEnabled)
        {
            enablePageDetect = [pageDetectEnabled boolValue];
            self._captureControl.pageDetect = enablePageDetect;
        }
    }
    
    NSDictionary* frameOptions = [options objectForKey:@"FrameOptions"];
    if (frameOptions)
    {
        NSNumber* frameEnabled = [frameOptions objectForKey:@"enabled"];
        if (frameEnabled)
        {
            if ([frameEnabled boolValue])
            {
                NSNumber* frameBorderWidth = [frameOptions objectForKey:@"borderWidth"];
                NSNumber* frameWidth = [frameOptions objectForKey:@"width"];
                NSNumber* frameHeight = [frameOptions objectForKey:@"height"];
                if (frameBorderWidth && [frameBorderWidth intValue] > 0 &&
                    frameWidth && [frameWidth intValue] > 0 &&
                    frameHeight && [frameHeight intValue] > 0)
                {
                    kfxKUIFrame* frame = [[kfxKUIFrame alloc] init];
                    frame.borderWidth = [frameBorderWidth intValue];
                    frame.size = CGSizeMake([frameWidth floatValue], [frameHeight floatValue]);
                    
                    NSString* colorString = [frameOptions objectForKey:@"borderColor"];
                    UIColor* borderColor = [self colorFromHexString:colorString];
                    
                    colorString = [frameOptions objectForKey:@"outerColor"];
                    UIColor* outerColor = [self colorFromHexString:colorString];
                    
                    frame.borderColor = borderColor;
                    frame.outerColor = outerColor;
                    
                    self._captureControl.imageFrame = frame;
                    
                    CGRect rect = self._flashControl.frame;
                    rect.origin.y = self._captureControl.frame.origin.y + ((self._captureControl.frame.size.height - [frameHeight floatValue]) / 2) + 20;
                    self._flashControl.frame = rect;

                }
            }
            else
            {
                self._captureControl.imageFrame = nil;
            }
        }
    }
}

-(UIColor*)colorFromHexString:(NSString*)hexString
{
    NSScanner* scanner = [NSScanner scannerWithString:hexString];
    unsigned int colorValue;
    if ([scanner scanHexInt:&colorValue])
    {
        UIColor* color = [UIColor colorWithRed:(colorValue >> 24 & 0xFF) / 256.0 green:(colorValue >> 16 & 0xFF) / 256.0 blue:(colorValue >> 8 & 0xFF) / 256.0 alpha:(colorValue & 0xFF) / 256.0];
        return color;
    }
    else
    {
        return nil;
    }
}

-(void)imageCaptureControl:(kfxKUIImageCaptureControl *)imageCaptureControl imageCaptured:(kfxKEDImage *)image
{
    NSLog(@"imageCaptureControl:imageCaptured:");
    
    // Disable continuous capture
    NSLog(@"Disabling continuous capture");
    [self._captureControl doContinuousMode:NO];
    
    self._image = image;

    [self createSpinner:nil];
    NSMutableDictionary* options = [[NSMutableDictionary alloc]init];
    [options setValue:[NSNumber numberWithBool:YES] forKey:@"visible"];
    [self spinner_setOptionsWithDictionary:options];
    
    if (self._takePhotoCallbackId != nil)
    {
        dispatch_async(dispatch_get_main_queue(), ^{
            CDVPluginResult* pluginResult = [self createImageResult:@"CaptureResult" withImage:self._image];
            [pluginResult setKeepCallback:[NSNumber numberWithBool:TRUE]];
            [self.commandDelegate sendPluginResult:pluginResult callbackId:self._takePhotoCallbackId];
        });
    }
}

-(CDVPluginResult*)createImageResult:(NSString*)objectName withImage:(kfxKEDImage*)image
{
    NSDictionary* imageObject = [[NSMutableDictionary alloc]init];
    [imageObject setValue:image.imageID forKey:@"id"];
    
    NSDictionary* captureObject = [[NSMutableDictionary alloc]init];
    [captureObject setValue:imageObject forKey:@"image"];
    
    NSDictionary* rootMessage = [[NSMutableDictionary alloc]init];
    [rootMessage setValue:captureObject forKey:objectName];
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:rootMessage];
    return pluginResult;
}

-(void)createImageReviewControl:(CDVInvokedUrlCommand*) command
{
    NSLog(@"createImageReviewControl");
    
    [kfxKUIImageReviewAndEdit initializeControl];
    NSLog(@"Review Control about to create ");
    kfxKUIImageReviewAndEdit* reviewControl = [[kfxKUIImageReviewAndEdit alloc] init];
    NSLog(@"Review Control created");
    
    NSDictionary* options = [command.arguments objectAtIndex:0];
    if (![options valueForKey:@"Mode"])
    {
        self._reviewControl = reviewControl;
        self._reviewProcessCallbackId = command.callbackId;
    }
    else
    {
        self._postReviewControl = reviewControl;
        self._postReviewProcessCallbackId = command.callbackId;
    }
    
    options = [NSMutableDictionary dictionaryWithDictionary:options];
    [options setValue:[NSNumber numberWithBool:YES] forKey:@"SetImage"];
    BOOL analyzeImage = [self imageReview_setOptionsWithDictionary:options];

    if (self._progressSpinner)
    {
        [self.webView.scrollView insertSubview:reviewControl belowSubview:self._progressSpinner];
    }
    else
    {
        [self.webView.scrollView addSubview:reviewControl];
    }
    CDVPluginResult* pluginResult;
    if (analyzeImage)
    {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_NO_RESULT];
        [pluginResult setKeepCallbackAsBool:YES];
        self._analysisCompleteCallbackId = command.callbackId;

        int result = [self._imageProcessor doQuickAnalysis:self._image andGenerateImage:YES];
        NSLog(@"quick analysis started with result %d", result);
    }
    else
    {
        NSDictionary* message = [[NSMutableDictionary alloc]init];
        [message setValue:@"id:rev" forKey:@"id"];
        
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:message];
        self._analysisCompleteCallbackId = nil;
    }
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void)imageReview_setOptions:(CDVInvokedUrlCommand*)command
{
    NSLog(@"imageReview_setOptions");
    NSDictionary* options = [command.arguments objectAtIndex:0];
    BOOL analyzeImage = [self imageReview_setOptionsWithDictionary:options];
    
    CDVPluginResult* pluginResult;
    if (analyzeImage)
    {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_NO_RESULT];
        self._analysisCompleteCallbackId = command.callbackId;
        [pluginResult setKeepCallbackAsBool:YES];
        int result = [self._imageProcessor doQuickAnalysis:self._image andGenerateImage:YES];
        NSLog(@"quick analysis started with result %d", result);
    }
    else
    {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        self._analysisCompleteCallbackId = nil;
    }
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(BOOL)imageReview_setOptionsWithDictionary:(NSDictionary*) options
{
    kfxKUIImageReviewAndEdit* reviewControl;
    if (![options valueForKey:@"Mode"])
    {
        reviewControl = self._reviewControl;
    }
    else
    {
        reviewControl = self._postReviewControl;
    }
    
    NSDictionary* layout = [options objectForKey:@"Layout"];
    if (layout)
    {
        NSNumber* visible = [layout objectForKey:@"visible"];
        if (visible)
        {
            BOOL hidden = ![visible boolValue];
            [reviewControl setHidden:hidden];
        }
        CGRect rect = [ControlLayout parseLayout:layout];
        if (rect.size.width > 0 && rect.size.height > 0)
        {
            reviewControl.frame = rect;
        }
    }
    
    NSNumber* setImage = [options objectForKey:@"SetImage"];
    if (setImage && [setImage boolValue])
    {
        [reviewControl setImage:self._image];
        struct utsname systemInfo;
        uname(&systemInfo);
        NSString* machineName = [[NSString stringWithCString:systemInfo.machine encoding:NSUTF8StringEncoding]lowercaseString];

        if ([machineName hasPrefix:@"iphone3,"] || [machineName hasPrefix:@"iphone4,"] || [machineName hasPrefix:@"ipad1,"] || [machineName hasPrefix:@"ipad2,"] || [machineName hasPrefix:@"ipad3,"])
        {
            // The iPhone4 and iPhone4S have memory limitations which are not able to handle
            // quick analysis in addition to the other operations that are performed by the
            // Kofax TotalAgility Mobile Capture controls.  As an optimization, don't attempt
            // quick analysis on these devices.  Similarly, don't perform them on older iPads
            return NO;
        }
        else
        {
            // On higher-end devices (e.g., iPhone5/iPhone5S and newer), perform quick analysis
            return YES;
        }
    }
    
    // We didn't change the image, so no need to perform quick analysis.
    return NO;
}

-(void)createImageProcessor:(CDVInvokedUrlCommand*)command
{
    NSLog(@"createImageProcessor");
    
    
    if (!self._imageProcessor)
    {
        [kfxKENImageProcessor initialize];
        
        self._imageProcessor = [[kfxKENImageProcessor alloc]init];
        self._imageProcessor.delegate = self;
    }
    NSDictionary* options = [command.arguments objectAtIndex:0];
    
    [self imageProcessor_setOptionsWithDictionary:options];
    
    NSDictionary* message = [[NSMutableDictionary alloc]init];
    [message setValue:@"id:ip" forKey:@"id"];
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:message];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void)imageProcessor_processImage:(CDVInvokedUrlCommand*)command
{
    NSLog(@"imageProcessor_processImage");
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_NO_RESULT];
    [pluginResult setKeepCallback:[NSNumber numberWithBool:TRUE]];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    
    if (self._imageProcessor)
    {
        [self createSpinner:nil];
        NSMutableDictionary* options = [[NSMutableDictionary alloc]init];
        [options setValue:[NSNumber numberWithBool:YES] forKey:@"visible"];
        [self spinner_setOptionsWithDictionary:options];
        
        self._imageProcessCallbackId = command.callbackId;
        int result = [self._imageProcessor processImage:self._image];
        NSLog(@"processImage returned %d", result);
    }
}

-(void)imageProcessor_setOptions:(CDVInvokedUrlCommand*)command
{
    NSLog(@"imageProcessor_setOptions");
    
    NSDictionary* options = [command.arguments objectAtIndex:0];
    
    [self imageProcessor_setOptionsWithDictionary:options];
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void)imageProcessor_setOptionsWithDictionary:(NSDictionary*)imageProcessingOptions
{
    NSDictionary* advancedOptions = [imageProcessingOptions  objectForKey:@"AdvancedOptions"];
    
    BOOL profileSet = NO;
    if (advancedOptions && [advancedOptions valueForKey:@"advancedSettings"])
    {
        NSString* evrsSettings = [advancedOptions objectForKey:@"advancedSettings"];
        if (evrsSettings.length > 0)
        {
            kfxKEDImagePerfectionProfile* profile = [[kfxKEDImagePerfectionProfile alloc]init];
            profile.ipOperations = evrsSettings;
            self._imageProcessor.imagePerfectionProfile = profile;
            profileSet = YES;
        }
    }
    
    if (!profileSet)
    {
        NSDictionary* basicOptions = [imageProcessingOptions valueForKey:@"BasicOptions"];
        
        NSNumber* desiredColorMode = [basicOptions objectForKey:@"desiredColorMode"];
        NSNumber* desiredResolution = [basicOptions objectForKey:@"desiredResolution"];
        NSNumber* enableCrop = [basicOptions objectForKey:@"enableCrop"];
        NSNumber* enableDeskew = [basicOptions objectForKey:@"enableDeskew"];
        NSNumber* enableRotate = [basicOptions objectForKey:@"enableRotate"];
        
        // Always enable compression
        //NSNumber* enableCompression = [basicOptions objectForKey:@"enableCompression"];
        NSNumber* compressionQuality = [basicOptions objectForKey:@"compressionQuality"];
        self._compressionQuality = [compressionQuality intValue];
        
        kfxKEDBasicSettingsProfile* profile = [[kfxKEDBasicSettingsProfile alloc]init];
        if ([enableCrop boolValue])
        {
            profile.doCrop = KED_CROP_AUTO;
        }
        
        if ([enableDeskew boolValue])
        {
            profile.doDeskew = true;
        }
        
        if ([enableRotate boolValue])
        {
            profile.doRotate = KED_AUTOMATIC;
        }
        
        // No support for blank page removal
        int colorMode = [desiredColorMode intValue];
        if (colorMode == -2 || colorMode == 2)
        {
            profile.outputBitDepth = KED_BITDEPTH_COLOR;
        }
        else if (colorMode == 1)
        {
            profile.outputBitDepth = KED_BITDEPTH_GRAYSCALE;
        }
        else if (colorMode == -1 || colorMode == 0)
        {
            profile.outputBitDepth = KED_BITDEPTH_BITONAL;
        }
        else
        {
            // TODO: error
        }
        
        profile.outputDPI = [desiredResolution intValue];
        
        self._imageProcessor.basicSettingsProfile = profile;
    }
}

-(void)imageOut:(int)status withMsg:(NSString *)errorMsg andOutputImage:(kfxKEDImage *)kfxImage
{
    NSLog(@"Image processed with status %d (error: %@", status, errorMsg);
    
    self._image = kfxImage;
    
    CDVPluginResult* pluginResult = [self createImageResult:@"ProcessResult" withImage:self._image];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self._imageProcessCallbackId];
}

//!  Image processing progress Delegate
/**
 The Engine calls this method multiple times during processsing to indicate progress in percent, from 1-100.\n
 This is a required delegate. You should make no decisions about the image processing until the library calls the image out delegate.\n
 @param  status  Set to KMC_SUCCESS if no error occurred, otherwise an error code.
 @param  errorMsg  A description of the error that occurred.
 @param  imageID   The ID of the original input image
 @param  percent   The percentage of completion, 1-100
 */
- (void)processProgress: (int) status withMsg: (NSString*) errorMsg imageID: (NSString*) imageID andProgress: (int) percent
{
    
}


//!  Analysis Complete Delegate
/**
 The Engine calls this method after the engine completes the quick analysis.\n
 This is a required delegate. The output kfxImage is the original input image given for analysis.  The results of the quick analysis are stored in this input kfxImage regardless if you requested an output image or not.  If you did request a quick analysis image, then the UIImage image is stored in the quickAnalysisFeedback element of the input kfxImage.\n
 @param  status : Set to KMC_SUCCESS if no error occurred, otherwise an error code.
 @param  errorMsg : A description of the error that occurred.
 @param  kfxImage : A reference to the input image, regardless of if an error was generated.
 */
- (void)analysisComplete:(int)status withMsg: (NSString*) errorMsg andOutputImage: (kfxKEDImage*) kfxImage
{
    kfxKEDQuickAnalysisFeedback* feedback = [kfxImage getImageQuickAnalysisFeedback];
    dispatch_async(dispatch_get_main_queue(), ^{
        [self._reviewControl setImage:[[kfxKEDImage alloc]initWithImage:feedback.quickReviewUIImage]];
        
        NSDictionary* message = [[NSMutableDictionary alloc]init];
        [message setValue:@"id:rev" forKey:@"id"];
        
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:message];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:self._analysisCompleteCallbackId];
        self._analysisCompleteCallbackId = nil;
    });
}


//!  Image analysis progress Delegate
/**
 The Engine calls this method multiple times during processsing to indicate progress in percent, from 1-100.\n
 This is a required delegate. You should make no decisions about the image processing until the library calls the analysis complete delegate.\n
 @param  status  Set to KMC_SUCCESS if no error occurred, otherwise an error code.
 @param  errorMsg  A description of the error that occurred.
 @param  imageID   The ID of the original input image
 @param  percent   The percentage of completion, 1-100
 */

- (void)analysisProgress: (int) status withMsg: (NSString*) errorMsg imageID: (NSString*) imageID andProgress: (int) percent
{
    NSLog(@"Analysis %d%% complete", percent);
}

-(void)createBarcodeCaptureControl:(CDVInvokedUrlCommand*)command
{
    // Licensing!
    if (!Licensed)
    {
        Licensed = [self checkLicense];
    }
    
    NSLog(@"Creating image capture control");
    if (self._barcodeCaptureControl)
    {
        [self._barcodeCaptureControl removeFromSuperview];
        self._barcodeCaptureControl.delegate = nil;
        self._barcodeCaptureControl = nil;
    }
    
    [kfxKUIBarCodeCaptureControl initializeControl];
    self._barcodeCaptureControl = [[kfxKUIBarCodeCaptureControl alloc] init];
    self._barcodeCaptureControl.delegate = self;
    
    NSDictionary* options = [command.arguments objectAtIndex:0];
    [self barcodeCapture_setOptionsWithDictionary:options];
    
    [self.webView.scrollView addSubview:self._barcodeCaptureControl];
    
    [self._barcodeCaptureControl readBarcode];
    
    NSDictionary* message = [[NSMutableDictionary alloc]init];
    [message setValue:@"id:barcode" forKey:@"id"];
    
    self._barcodeCapturedCallbackId = command.callbackId;
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:message];
    [pluginResult setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void)barcodeCapture_setOptions:(CDVInvokedUrlCommand*)command
{
    NSDictionary* options = [command.arguments objectAtIndex:0];
    [self barcodeCapture_setOptionsWithDictionary:options];
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [pluginResult setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void)barcodeCapture_setOptionsWithDictionary:(NSDictionary*)options
{
    NSDictionary* layout = [options objectForKey:@"Layout"];
    
    CGRect rect = [ControlLayout parseLayout:layout];
    if (rect.size.width > 0 && rect.size.height > 0)
    {
        self._barcodeCaptureControl.frame = rect;
    }
    
    NSNumber* visible = [layout objectForKey:@"visible"];
    if (visible)
    {
        BOOL hidden = ![visible boolValue];
        [self._barcodeCaptureControl setHidden:hidden];
    }
    
    NSDictionary* barcodeOptions = [options objectForKey:@"BarcodeOptions"];
    if (barcodeOptions)
    {
        NSArray* symbologies = [barcodeOptions objectForKey:@"symbologies"];
        NSMutableArray* symbologyValues = [[NSMutableArray alloc]init];
        for (int i =0 ; i < [symbologies count]; i++) {
            NSString* barcodeSymbology = [symbologies objectAtIndex:i];
            
            if ([@"code39" caseInsensitiveCompare:barcodeSymbology] == NSOrderedSame)
            {
                [symbologyValues addObject:[NSNumber numberWithInt:kfxKUISymbologyCode39]];
            }
            else if ([@"pdf417" caseInsensitiveCompare:barcodeSymbology] == NSOrderedSame)
            {
                [symbologyValues addObject:[NSNumber numberWithInt:kfxKUISymbologyPdf417]];
            }
            else if ([@"QR" caseInsensitiveCompare:barcodeSymbology] == NSOrderedSame)
            {
                [symbologyValues addObject:[NSNumber numberWithInt:kfxKUISymbologyQR]];
            }
            else if ([@"dataMatrix" caseInsensitiveCompare:barcodeSymbology] == NSOrderedSame)
            {
                [symbologyValues addObject:[NSNumber numberWithInt:kfxKUISymbologyDataMatrix]];
            }
            else if ([@"code128" caseInsensitiveCompare:barcodeSymbology] == NSOrderedSame)
            {
                [symbologyValues addObject:[NSNumber numberWithInt:kfxKUISymbologyCode128]];
            }
            else if ([@"code25" caseInsensitiveCompare:barcodeSymbology] == NSOrderedSame)
            {
                [symbologyValues addObject:[NSNumber numberWithInt:kfxKUISymbologyCode25]];
            }
            else if ([@"EAN" caseInsensitiveCompare:barcodeSymbology] == NSOrderedSame)
            {
                [symbologyValues addObject:[NSNumber numberWithInt:kfxKUISymbologyEAN]];
            }
            else if ([@"UPC" caseInsensitiveCompare:barcodeSymbology] == NSOrderedSame)
            {
                [symbologyValues addObject:[NSNumber numberWithInt:kfxKUISymbologyUPC]];
            }
            else if ([@"codaBar" caseInsensitiveCompare:barcodeSymbology] == NSOrderedSame)
            {
                [symbologyValues addObject:[NSNumber numberWithInt:kfxKUISymbologyCodabar]];
            }
            else if ([@"aztec" caseInsensitiveCompare:barcodeSymbology] == NSOrderedSame)
            {
                [symbologyValues addObject:[NSNumber numberWithInt:kfxKUISymbologyAztec]];
            }
            else if ([@"code93" caseInsensitiveCompare:barcodeSymbology] == NSOrderedSame)
            {
                [symbologyValues addObject:[NSNumber numberWithInt:kfxKUISymbologyCode93]];
            }
            else
            {
                NSLog(@"Unrecognized barcode symbology: %@", barcodeSymbology);
            }
        }
        NSNumber* searchDirection = [barcodeOptions objectForKey:@"searchDirection"];
        NSNumber* guidingLineMode = [barcodeOptions objectForKey:@"guidingLineMode"];
        
        if ([guidingLineMode intValue] == 1)
        {
            self._barcodeCaptureControl.guidingLine = kfxKUIGuidingLineLandscape;
        }
        else if ([guidingLineMode intValue] == 2)
        {
            self._barcodeCaptureControl.guidingLine = kfxKUIGuidingLinePortrait;
        }
        
        if (searchDirection)
        {
            int searchDirectionValue = [searchDirection intValue];
            NSMutableArray* searchDirectionArray = [[NSMutableArray alloc] initWithCapacity:2];
            if ((searchDirectionValue & kfxKUIDirectionHorizontal) == kfxKUIDirectionHorizontal)
            {
                [searchDirectionArray addObject:[NSNumber numberWithInt:kfxKUIDirectionHorizontal]];
            }
            if ((searchDirectionValue & kfxKUIDirectionVertical) == kfxKUIDirectionVertical)
            {
                [searchDirectionArray addObject:[NSNumber numberWithInt:kfxKUIDirectionVertical]];
            }
            
            if (searchDirectionArray.count > 0)
            {
                self._barcodeCaptureControl.searchDirection = searchDirectionArray;
            }
        }
        
        self._barcodeCaptureControl.symbologies = symbologyValues;
    }
}

-(void)barcodeCaptureControl:(kfxKUIBarCodeCaptureControl *)barcodeCaptureControl barcodeFound:(kfxKEDBarcodeResult *)result image:(kfxKEDImage *)image
{
    NSLog(@"Barcode detected %@", result.value);
    
    NSDictionary* message = [[NSMutableDictionary alloc]init];
    [message setValue:@"id:rev" forKey:@"id"];
    [message setValue:result.value forKey:@"barcodeValue"];
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:message];
    [self._barcodeCaptureControl readBarcode];
    [pluginResult setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self._barcodeCapturedCallbackId];
}

-(void)image_getBase64ImageData:(CDVInvokedUrlCommand*)command
{
    NSLog(@"Getting base64 data");
    
    [self._image setImageMimeType:MIMETYPE_TIF];
    if (self._compressionQuality == 0)
    {
        self._compressionQuality = 75;
    }
    [self._image setJpegQuality:self._compressionQuality];
    
    int result = [self._image imageWriteToFileBuffer];
    NSLog(@"Image written to memory buffer with result %d", result);
    
    NSData* imageData = [NSData dataWithBytes:[self._image getImageFileBuffer] length:self._image.imageFileBufferSize];
    NSString* base64Data;
    if ([imageData respondsToSelector:@selector(base64EncodedDataWithOptions:)])
    {
        base64Data = [imageData base64EncodedStringWithOptions:0];
    }
    else
    {
        base64Data = [imageData base64Encoding];
    }
    
    if ([base64Data length] == 0)
    {
        base64Data = @"AAAA";
    }
    
    NSDictionary* message = [[NSMutableDictionary alloc]init];
    [message setValue:base64Data forKey:@"imageData"];
    [message setValue:@"image/tiff" forKey:@"mimeType"];
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:message];
    
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

-(void)spinner_setOptions:(CDVInvokedUrlCommand*)command
{
    NSDictionary* options = [command.arguments objectAtIndex:0];
    [self spinner_setOptionsWithDictionary:options];
}

-(void)spinner_setOptionsWithDictionary:(NSDictionary*)options
{
    NSNumber* visible = [options objectForKey:@"visible"];
    [self createSpinner:options];
    
    if (visible && [visible boolValue])
    {
        [self._progressSpinner startAnimating];
        if ([self._progressSpinner isDescendantOfView:self.webView.scrollView])
        {
            [self._progressSpinner removeFromSuperview];
        }
        
        [self.webView.scrollView addSubview:self._progressSpinner];
    }
    else if (visible && ![visible boolValue])
    {
        [self._progressSpinner removeFromSuperview];
    }
}

-(void)createSpinner:(NSDictionary*)options
{
    if (!self._progressSpinner)
    {
        self._progressSpinner = [[UIActivityIndicatorView alloc]initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
    }
    
    if (self._captureControl)
    {
        CGRect rect = self._captureControl.frame;
        rect.origin.x = rect.origin.x + rect.size.width / 2 - 40;
        rect.origin.y = rect.origin.y + rect.size.height / 2 - 40;
        rect.size.width = 80;
        rect.size.height= 80;
        self._progressSpinner.frame = rect;
    }
}

@end
