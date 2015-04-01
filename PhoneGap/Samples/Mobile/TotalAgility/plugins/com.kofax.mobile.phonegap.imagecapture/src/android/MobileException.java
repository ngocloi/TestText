// Copyright (c) 2012-2014 Kofax. Use of this code is with permission pursuant to Kofax license terms.
package com.kofax.mobile.sdk.cordova.plugins;

public class MobileException extends Exception {
    private static final long serialVersionUID = 1L;

    public MobileException() {
    }

    public MobileException(String detailMessage) {
        super(detailMessage);
    }

    public MobileException(Throwable throwable) {
        super(throwable);
    }

    public MobileException(String detailMessage, Throwable throwable) {
        super(detailMessage, throwable);
    }
}
