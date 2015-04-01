cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.kofax.mobile.phonegap.imagecapture/www/imagecapture.js",
        "id": "com.kofax.mobile.phonegap.imagecapture.MobileSdk",
        "clobbers": [
            "window.mobileSdk"
        ]
    }
]
});