"use strict";
/**
 * Mobile Layout Manager
 * Handles the split-screen layout for portrait mode
 */

function MobileLayout() {
    this.minimapCanvas = null;
    this.minimapCtx = null;
    this.zoomCanvas = null;
    this.zoomCtx = null;
    this.controlPanel = null;

    // Dimensions (will be calculated based on screen)
    this.screenWidth = 0;
    this.screenHeight = 0;

    this.minimapHeight = 0;
    this.zoomWidth = 0;
    this.zoomHeight = 0;
    this.controlWidth = 100;

    // Viewport state
    this.viewportX = 0;
    this.viewportY = 0;
    this.zoomFactor = 2.5;

    // Level dimensions
    this.levelWidth = 0;
    this.levelHeight = 0;

    // Selected lemming
    this.selectedLemming = null;

    // Arrow indicators for actions
    this.arrowSprites = {};
    this.arrowAlpha = 0.4;

    // Gesture recognizers
    this.minimapGesture = null;
    this.zoomGesture = null;
}

MobileLayout.prototype.init = function() {
    this.screenWidth = DeviceDetection.getScreenWidth();
    this.screenHeight = DeviceDetection.getScreenHeight();

    this.calculateDimensions();
    this.createCanvases();
    this.setupGestures();
    this.createControlPanel();
};

MobileLayout.prototype.calculateDimensions = function() {
    // Minimap takes top portion
    this.minimapHeight = Math.floor(this.screenHeight * 0.22);

    // Remaining height for zoom view
    var remainingHeight = this.screenHeight - this.minimapHeight;

    // Control panel on the right
    this.controlWidth = 80;
    this.zoomWidth = this.screenWidth - this.controlWidth;
    this.zoomHeight = remainingHeight;
};

MobileLayout.prototype.createCanvases = function() {
    // Create container
    var container = document.createElement('div');
    container.id = 'mobile-container';
    container.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;';

    // Minimap canvas
    this.minimapCanvas = document.createElement('canvas');
    this.minimapCanvas.id = 'minimap-canvas';
    this.minimapCanvas.width = this.screenWidth;
    this.minimapCanvas.height = this.minimapHeight;
    this.minimapCanvas.style.cssText = 'position:absolute;top:0;left:0;background:#000;';
    this.minimapCtx = this.minimapCanvas.getContext('2d');
    container.appendChild(this.minimapCanvas);

    // Zoom canvas
    this.zoomCanvas = document.createElement('canvas');
    this.zoomCanvas.id = 'zoom-canvas';
    this.zoomCanvas.width = this.zoomWidth;
    this.zoomCanvas.height = this.zoomHeight;
    this.zoomCanvas.style.cssText = 'position:absolute;top:' + this.minimapHeight + 'px;left:0;background:#87CEEB;';
    this.zoomCtx = this.zoomCanvas.getContext('2d');
    container.appendChild(this.zoomCanvas);

    // Hide original canvas
    var originalCanvas = document.getElementById('canvas');
    if (originalCanvas) {
        originalCanvas.style.display = 'none';
    }

    document.body.appendChild(container);
};

MobileLayout.prototype.setupGestures = function() {
    var that = this;

    // Minimap gestures
    this.minimapGesture = new GestureRecognizer(this.minimapCanvas);
    this.minimapGesture.onTap = function(x, y) {
        that.handleMinimapTap(x, y);
    };

    // Zoom view gestures
    this.zoomGesture = new GestureRecognizer(this.zoomCanvas);
    this.zoomGesture.onTap = function(x, y) {
        that.handleZoomTap(x, y);
    };
    this.zoomGesture.onDoubleTap = function(x, y) {
        that.handleZoomDoubleTap(x, y);
    };
    this.zoomGesture.onLongPress = function(x, y) {
        that.handleZoomLongPress(x, y);
    };
    this.zoomGesture.onSwipe = function(direction, dx, dy, startX, startY) {
        that.handleZoomSwipe(direction, dx, dy, startX, startY);
    };
    this.zoomGesture.onSwipeMove = function(direction, dx, dy, x, y) {
        that.handleSwipeMove(direction, dx, dy, x, y);
    };
};

MobileLayout.prototype.createControlPanel = function() {
    this.controlPanel = document.createElement('div');
    this.controlPanel.id = 'control-panel';
    this.controlPanel.style.cssText =
        'position:absolute;' +
        'top:' + this.minimapHeight + 'px;' +
        'left:' + this.zoomWidth + 'px;' +
        'width:' + this.controlWidth + 'px;' +
        'height:' + this.zoomHeight + 'px;' +
        'background:#333;' +
        'display:flex;' +
        'flex-direction:column;' +
        'padding:5px;' +
        'box-sizing:border-box;';

    // Add control buttons
    this.addControlButton('Jump', 'jump-mode', this.toggleJumpMode.bind(this));
    this.addControlButton('Bomb', 'bomb-all', this.bombAll.bind(this));
    this.addControlButton('Speed', 'speed', this.toggleSpeed.bind(this));
    this.addControlButton('+', 'more', this.moreLemmings.bind(this));
    this.addControlButton('-', 'less', this.lessLemmings.bind(this));
    this.addControlButton('Back', 'back', this.goBack.bind(this));

    document.getElementById('mobile-container').appendChild(this.controlPanel);
};

MobileLayout.prototype.addControlButton = function(label, id, callback) {
    var btn = document.createElement('button');
    btn.id = 'ctrl-' + id;
    btn.textContent = label;
    btn.style.cssText =
        'margin:3px 0;' +
        'padding:8px 4px;' +
        'font-size:12px;' +
        'font-family:Visitor,monospace;' +
        'background:#555;' +
        'color:#fff;' +
        'border:2px solid #777;' +
        'border-radius:4px;' +
        'cursor:pointer;';

    btn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        callback();
    });

    this.controlPanel.appendChild(btn);
};

// --- Event Handlers ---

MobileLayout.prototype.handleMinimapTap = function(x, y) {
    // Convert minimap coordinates to level coordinates
    var levelX = (x / this.screenWidth) * this.levelWidth;
    var levelY = (y / this.minimapHeight) * this.levelHeight;

    // Center viewport on tapped position
    this.viewportX = levelX - (this.zoomWidth / this.zoomFactor) / 2;
    this.viewportY = levelY - (this.zoomHeight / this.zoomFactor) / 2;

    // Clamp viewport
    this.clampViewport();

    // Deselect lemming
    this.selectedLemming = null;
    game.selectedLemming = null;
};

MobileLayout.prototype.handleZoomTap = function(x, y) {
    // Convert zoom coordinates to level coordinates
    var levelX = this.viewportX + (x / this.zoomFactor);
    var levelY = this.viewportY + (y / this.zoomFactor);

    // Find lemming at this position
    var lemming = this.findLemmingAt(levelX, levelY);

    if (lemming) {
        this.selectedLemming = lemming;
        game.selectedLemming = lemming;
    } else {
        this.selectedLemming = null;
        game.selectedLemming = null;
    }
};

MobileLayout.prototype.handleZoomDoubleTap = function(x, y) {
    // Bomb action on selected lemming
    if (this.selectedLemming && game.control.actionAvailable(Bomb)) {
        this.selectedLemming.setAction(new Bomb());
        game.control.useAction(Bomb);
    }
};

MobileLayout.prototype.handleZoomLongPress = function(x, y) {
    // Climb action on selected lemming
    if (this.selectedLemming && game.control.actionAvailable(Climb)) {
        this.selectedLemming.setAction(new Climb());
        game.control.useAction(Climb);
    }
};

MobileLayout.prototype.handleZoomSwipe = function(direction, dx, dy, startX, startY) {
    if (!this.selectedLemming) return;

    // Map direction to action
    var action = this.zoomGesture.mapDirectionToAction(direction);

    if (action && game.control.actionAvailable(action)) {
        this.selectedLemming.setAction(new action());
        game.control.useAction(action);
    }
};

MobileLayout.prototype.handleSwipeMove = function(direction, dx, dy, x, y) {
    // Update arrow highlighting during swipe
    this.highlightedDirection = direction;
};

// --- Control Button Actions ---

MobileLayout.prototype.toggleJumpMode = function() {
    game.jumpMode = !game.jumpMode;
    var btn = document.getElementById('ctrl-jump-mode');
    btn.style.background = game.jumpMode ? '#0a0' : '#555';
};

MobileLayout.prototype.bombAll = function() {
    var action = new BombAll();
    if (action.check && action.check()) {
        action.execute();
    }
};

MobileLayout.prototype.toggleSpeed = function() {
    var action = new FinishSpeed();
    if (action.check && action.check()) {
        action.execute();
    }
};

MobileLayout.prototype.moreLemmings = function() {
    var action = new MorePolicemen();
    action.execute();
};

MobileLayout.prototype.lessLemmings = function() {
    var action = new LessPolicemen();
    action.execute();
};

MobileLayout.prototype.goBack = function() {
    game.machine.setAction(new MachineAction());
    displayEntityHolder.destroy();
    stage.removeAllChildren();
    soundPlayer.reset();
    game.level = new SelectLevel();
    game.level.start(game.machine);
};

// --- Helper Methods ---

MobileLayout.prototype.setLevelDimensions = function(width, height) {
    this.levelWidth = width;
    this.levelHeight = height;
};

MobileLayout.prototype.clampViewport = function() {
    var viewWidth = this.zoomWidth / this.zoomFactor;
    var viewHeight = this.zoomHeight / this.zoomFactor;

    this.viewportX = Math.max(0, Math.min(this.viewportX, this.levelWidth - viewWidth));
    this.viewportY = Math.max(0, Math.min(this.viewportY, this.levelHeight - viewHeight));
};

MobileLayout.prototype.findLemmingAt = function(levelX, levelY) {
    if (!game.lemmings) return null;

    for (var i = 0; i < game.lemmings.length; i++) {
        var lemming = game.lemmings[i];
        // Check if click is within lemming bounds (roughly 32x32)
        if (Math.abs(lemming.x - levelX) < 16 && Math.abs(lemming.y - levelY) < 32) {
            return lemming;
        }
    }
    return null;
};

MobileLayout.prototype.update = function() {
    // Follow selected lemming
    if (this.selectedLemming) {
        var viewWidth = this.zoomWidth / this.zoomFactor;
        var viewHeight = this.zoomHeight / this.zoomFactor;

        this.viewportX = this.selectedLemming.x - viewWidth / 2;
        this.viewportY = this.selectedLemming.y - viewHeight / 2;
        this.clampViewport();
    }
};

MobileLayout.prototype.destroy = function() {
    var container = document.getElementById('mobile-container');
    if (container) {
        container.parentNode.removeChild(container);
    }

    // Show original canvas again
    var originalCanvas = document.getElementById('canvas');
    if (originalCanvas) {
        originalCanvas.style.display = 'block';
    }
};

// Global instance
var mobileLayout = null;
