"use strict";
/**
 * Device Detection and Screen Management
 */

var DeviceDetection = {

    isMobile: function() {
        return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            || this.isPortrait();
    },

    isPortrait: function() {
        return window.innerWidth < window.innerHeight;
    },

    isLandscape: function() {
        return window.innerWidth >= window.innerHeight;
    },

    getScreenWidth: function() {
        return window.innerWidth;
    },

    getScreenHeight: function() {
        return window.innerHeight;
    },

    // Get optimal canvas dimensions for current device
    getCanvasDimensions: function() {
        if (this.isMobile()) {
            return {
                width: Math.min(window.innerWidth, 500),
                height: Math.min(window.innerHeight, 800)
            };
        } else {
            return {
                width: 800,
                height: 384
            };
        }
    },

    // Listen for orientation changes
    onOrientationChange: function(callback) {
        window.addEventListener('resize', function() {
            callback(DeviceDetection.isMobile(), DeviceDetection.isPortrait());
        });

        window.addEventListener('orientationchange', function() {
            // Small delay to let the browser update dimensions
            setTimeout(function() {
                callback(DeviceDetection.isMobile(), DeviceDetection.isPortrait());
            }, 100);
        });
    }
};
