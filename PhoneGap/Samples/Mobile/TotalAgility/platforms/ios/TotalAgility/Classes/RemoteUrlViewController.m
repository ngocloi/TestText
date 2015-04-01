// Copyright (c) 2012-2014 Kofax.  Use of this code is with permission pursuant to Kofax license terms.

#import "RemoteUrlViewController.h"
#import "MainViewController.h"
#import "KFXMobileSdkPlugin.h"

@interface RemoteUrlViewController ()

@end

@implementation RemoteUrlViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    if ([self respondsToSelector:@selector(edgesForExtendedLayout)])
    {
        self.edgesForExtendedLayout = UIRectEdgeAll & ~UIRectEdgeTop;
    }
    
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    NSString* remoteUrl = [defaults objectForKey:@"RemoteUrl"];
    if (remoteUrl && remoteUrl.length >0 )
    {
        self.remoteUrlTextbox.text = remoteUrl;
        [self navigate];
        
    }
}
-(NSUInteger)supportedInterfaceOrientations
{
    return UIInterfaceOrientationMaskPortrait;
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)navigateButtonPressed:(id)sender
{
    [self navigate];
}

-(void)navigate
{
    [KFXMobileSdkPlugin setLicenseKey:@"MYLICENSE"];
    [KFXMobileSdkPlugin enablePageDetect:YES];
    
    NSString* url = self.remoteUrlTextbox.text;
    
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    [defaults setValue:url forKey:@"RemoteUrl"];
    
    MainViewController* viewController = [[MainViewController alloc]init];
    NSRange range = [url rangeOfString:@"?"];
    NSString* urlAppend = @"cordovaVersion=3.1&cordovaPlatform=ios";
    
    if (range.location == NSNotFound)
    {
        url = [NSString stringWithFormat:@"%@?%@", url, urlAppend];
    }
    else
    {
        url = [NSString stringWithFormat:@"%@&%@", url, urlAppend];
    }
    
    viewController.startPage = url;
    viewController.navigationItem.hidesBackButton = YES;
    
    UIBarButtonItem *flipButton = [[UIBarButtonItem alloc]
                                   initWithTitle:@"Settings"
                                   style:UIBarButtonItemStyleBordered
                                   target:self
                                   action:@selector(editConfig:)];
    viewController.navigationItem.rightBarButtonItem = flipButton;
    
    [self.navigationController pushViewController:viewController animated:YES];
}

-(IBAction)editConfig:(id)sender
{
    [self.navigationController popViewControllerAnimated:YES];
    [self.goButton setTitle:@"Save" forState:UIControlStateNormal];
    
}
@end
