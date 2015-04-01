// Copyright (c) 2012-2014 Kofax.  Use of this code is with permission pursuant to Kofax license terms.

#import "ControlLayout.h"

@implementation ControlLayout

    +(CGRect)parseLayout:(NSDictionary*)layoutParameters
    {
        NSNumber* x = [layoutParameters objectForKey:@"x"];
        NSNumber* y = [layoutParameters objectForKey:@"y"];
        NSNumber* width = [layoutParameters objectForKey:@"width"];
        NSNumber* height = [layoutParameters objectForKey:@"height"];
        
        CGRect rect = CGRectMake([x floatValue], [y floatValue], [width floatValue], [height floatValue]);
        return rect;
    }
    
@end
