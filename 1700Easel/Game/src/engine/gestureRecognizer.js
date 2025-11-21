"use strict";
/**
 * Gesture Recognition for Touch Controls
 */

function GestureRecognizer(element) {
    this.element = element;
    this.startX = 0;
    this.startY = 0;
    this.startTime = 0;
    this.lastTapTime = 0;
    this.longPressTimer = null;

    // Thresholds
    this.swipeMinDistance = 30;   // minimum pixels for swipe
    this.longPressTime = 500;     // ms for long press
    this.doubleTapTime = 300;     // ms between taps for double tap
    this.tapMaxDistance = 10;     // max movement for tap

    // Callbacks
    this.onTap = null;
    this.onDoubleTap = null;
    this.onLongPress = null;
    this.onSwipe = null;
    this.onSwipeMove = null;      // called during swipe for feedback
    this.onPan = null;

    this.init();
}

GestureRecognizer.prototype.init = function() {
    var that = this;

    this.element.addEventListener('touchstart', function(e) {
        that.handleTouchStart(e);
    }, {passive: false});

    this.element.addEventListener('touchmove', function(e) {
        that.handleTouchMove(e);
    }, {passive: false});

    this.element.addEventListener('touchend', function(e) {
        that.handleTouchEnd(e);
    }, {passive: false});

    this.element.addEventListener('touchcancel', function(e) {
        that.handleTouchCancel(e);
    }, {passive: false});
};

GestureRecognizer.prototype.handleTouchStart = function(e) {
    if (e.touches.length !== 1) return;

    e.preventDefault();
    var touch = e.touches[0];

    this.startX = touch.clientX;
    this.startY = touch.clientY;
    this.startTime = Date.now();
    this.moved = false;

    // Start long press timer
    var that = this;
    this.longPressTimer = setTimeout(function() {
        if (!that.moved && that.onLongPress) {
            that.onLongPress(that.startX, that.startY);
            that.longPressTimer = null;
        }
    }, this.longPressTime);
};

GestureRecognizer.prototype.handleTouchMove = function(e) {
    if (e.touches.length !== 1) return;

    e.preventDefault();
    var touch = e.touches[0];

    var dx = touch.clientX - this.startX;
    var dy = touch.clientY - this.startY;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > this.tapMaxDistance) {
        this.moved = true;
        // Cancel long press if we moved
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
    }

    // Provide swipe direction feedback during movement
    if (this.moved && this.onSwipeMove) {
        var direction = this.getSwipeDirection(dx, dy);
        this.onSwipeMove(direction, dx, dy, touch.clientX, touch.clientY);
    }
};

GestureRecognizer.prototype.handleTouchEnd = function(e) {
    e.preventDefault();

    // Cancel long press timer
    if (this.longPressTimer) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
    }

    var endTime = Date.now();
    var duration = endTime - this.startTime;

    // Get final position from changedTouches
    var touch = e.changedTouches[0];
    var dx = touch.clientX - this.startX;
    var dy = touch.clientY - this.startY;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (!this.moved && distance <= this.tapMaxDistance) {
        // It's a tap
        if (endTime - this.lastTapTime < this.doubleTapTime && this.onDoubleTap) {
            this.onDoubleTap(this.startX, this.startY);
            this.lastTapTime = 0;
        } else {
            this.lastTapTime = endTime;
            if (this.onTap) {
                // Small delay to check for double tap
                var that = this;
                setTimeout(function() {
                    if (that.lastTapTime === endTime && that.onTap) {
                        that.onTap(that.startX, that.startY);
                    }
                }, this.doubleTapTime);
            }
        }
    } else if (distance >= this.swipeMinDistance) {
        // It's a swipe
        if (this.onSwipe) {
            var direction = this.getSwipeDirection(dx, dy);
            this.onSwipe(direction, dx, dy, this.startX, this.startY);
        }
    }
};

GestureRecognizer.prototype.handleTouchCancel = function(e) {
    if (this.longPressTimer) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
    }
};

/**
 * Get swipe direction from delta values
 * Returns: 'up', 'down', 'left', 'right', 'up-right', 'up-left', 'down-right', 'down-left'
 */
GestureRecognizer.prototype.getSwipeDirection = function(dx, dy) {
    // Calculate angle in degrees (0 = right, 90 = down, 180/-180 = left, -90 = up)
    var angle = Math.atan2(dy, dx) * 180 / Math.PI;

    // Normalize to 0-360
    if (angle < 0) angle += 360;

    // Map to 8 directions with 45° segments
    if (angle >= 337.5 || angle < 22.5) return 'right';
    if (angle >= 22.5 && angle < 67.5) return 'down-right';
    if (angle >= 67.5 && angle < 112.5) return 'down';
    if (angle >= 112.5 && angle < 157.5) return 'down-left';
    if (angle >= 157.5 && angle < 202.5) return 'left';
    if (angle >= 202.5 && angle < 247.5) return 'up-left';
    if (angle >= 247.5 && angle < 292.5) return 'up';
    if (angle >= 292.5 && angle < 337.5) return 'up-right';

    return 'right'; // fallback
};

/**
 * Get angle in degrees from delta values
 */
GestureRecognizer.prototype.getSwipeAngle = function(dx, dy) {
    var angle = Math.atan2(dy, dx) * 180 / Math.PI;
    if (angle < 0) angle += 360;
    return angle;
};

/**
 * Map swipe direction to game action
 */
GestureRecognizer.prototype.mapDirectionToAction = function(direction) {
    var actionMap = {
        'down': Dig,
        'down-right': Mine,
        'right': Bash,
        'up-right': Build,
        'up': Float,
        'left': Block
        // 'up-left' and 'down-left' reserved
    };

    return actionMap[direction] || null;
};
