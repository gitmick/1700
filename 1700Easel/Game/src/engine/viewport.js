"use strict";
/**
 * Viewport - Rendering configuration
 * Defines how to display the level model on screen
 */

function Viewport(config) {
    config = config || {};

    // Viewport position in level coordinates
    this.scrollX = config.scrollX || 0;
    this.scrollY = config.scrollY || 0;

    // Viewport size in screen pixels
    this.width = config.width || 800;
    this.height = config.height || 350;

    // Scale factor (1.0 = normal, 0.5 = half size, 2.0 = double)
    this.scale = config.scale || 1.0;

    // Whether to apply parallax effect
    this.parallaxEnabled = config.parallaxEnabled !== undefined ? config.parallaxEnabled : true;

    // Clipping bounds (in level coordinates)
    this.clipX = config.clipX || 0;
    this.clipY = config.clipY || 0;
    this.clipWidth = config.clipWidth || 0;  // 0 = no clipping
    this.clipHeight = config.clipHeight || 0;
}

/**
 * Convert level coordinates to screen coordinates
 */
Viewport.prototype.levelToScreen = function(levelX, levelY, parallaxFactor) {
    parallaxFactor = parallaxFactor !== undefined ? parallaxFactor : 1.0;

    var scrollOffset = this.parallaxEnabled ? this.scrollX * parallaxFactor : this.scrollX;

    var screenX = (levelX - scrollOffset) * this.scale;
    var screenY = (levelY - this.scrollY) * this.scale;

    return { x: screenX, y: screenY };
};

/**
 * Convert screen coordinates to level coordinates
 */
Viewport.prototype.screenToLevel = function(screenX, screenY) {
    var levelX = (screenX / this.scale) + this.scrollX;
    var levelY = (screenY / this.scale) + this.scrollY;

    return { x: levelX, y: levelY };
};

/**
 * Get the visible area in level coordinates
 */
Viewport.prototype.getVisibleArea = function() {
    return {
        x: this.scrollX,
        y: this.scrollY,
        width: this.width / this.scale,
        height: this.height / this.scale
    };
};

/**
 * Clamp scroll to level bounds
 */
Viewport.prototype.clampScroll = function(levelWidth, levelHeight) {
    var viewWidth = this.width / this.scale;
    var viewHeight = this.height / this.scale;

    this.scrollX = Math.max(0, Math.min(this.scrollX, levelWidth - viewWidth));
    this.scrollY = Math.max(0, Math.min(this.scrollY, levelHeight - viewHeight));
};

/**
 * Center viewport on a point
 */
Viewport.prototype.centerOn = function(levelX, levelY, levelWidth, levelHeight) {
    var viewWidth = this.width / this.scale;
    var viewHeight = this.height / this.scale;

    this.scrollX = levelX - viewWidth / 2;
    this.scrollY = levelY - viewHeight / 2;

    if (levelWidth && levelHeight) {
        this.clampScroll(levelWidth, levelHeight);
    }
};

/**
 * Create a viewport for minimap display
 */
Viewport.createMinimap = function(levelWidth, levelHeight, screenWidth, screenHeight) {
    // Calculate scale to fit level in screen
    var scaleX = screenWidth / levelWidth;
    var scaleY = screenHeight / levelHeight;
    var scale = Math.min(scaleX, scaleY);

    return new Viewport({
        scrollX: 0,
        scrollY: 0,
        width: screenWidth,
        height: screenHeight,
        scale: scale,
        parallaxEnabled: false  // Minimap shows everything at base position
    });
};

/**
 * Create a viewport for zoomed gameplay
 */
Viewport.createZoomed = function(screenWidth, screenHeight, zoomFactor) {
    return new Viewport({
        scrollX: 0,
        scrollY: 0,
        width: screenWidth,
        height: screenHeight,
        scale: zoomFactor,
        parallaxEnabled: true
    });
};
