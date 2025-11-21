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

    // Visibility state
    this.visible = false;
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
    this.minimapHeight = Math.floor(this.screenHeight * 0.20);

    // Control panel at bottom
    this.controlHeight = 60;

    // Zoom view takes remaining space
    this.zoomWidth = this.screenWidth;
    this.zoomHeight = this.screenHeight - this.minimapHeight - this.controlHeight;
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

    // Minimap gestures - custom handling for drag
    this.minimapCanvas.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
            e.preventDefault();
            var touch = e.touches[0];
            var rect = that.minimapCanvas.getBoundingClientRect();
            that.handleMinimapTap(touch.clientX - rect.left, touch.clientY - rect.top);
        }
    }, {passive: false});

    this.minimapCanvas.addEventListener('touchmove', function(e) {
        if (e.touches.length === 1) {
            e.preventDefault();
            var touch = e.touches[0];
            var rect = that.minimapCanvas.getBoundingClientRect();
            that.handleMinimapDrag(touch.clientX - rect.left, touch.clientY - rect.top);
        }
    }, {passive: false});

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
        'top:' + (this.minimapHeight + this.zoomHeight) + 'px;' +
        'left:0;' +
        'width:100%;' +
        'height:' + this.controlHeight + 'px;' +
        'background:#333;' +
        'display:flex;' +
        'flex-direction:row;' +
        'justify-content:space-around;' +
        'align-items:center;' +
        'padding:5px;' +
        'box-sizing:border-box;';

    // Add control buttons
    this.addControlButton('Jump', 'jump-mode', this.toggleJumpMode.bind(this));
    this.addControlButton('Bomb', 'bomb-all', this.bombAll.bind(this));
    this.addControlButton('⚡', 'speed', this.toggleSpeed.bind(this));
    this.addControlButton('+', 'more', this.moreLemmings.bind(this));
    this.addControlButton('-', 'less', this.lessLemmings.bind(this));
    this.addControlButton('←', 'back', this.goBack.bind(this));

    document.getElementById('mobile-container').appendChild(this.controlPanel);
};

MobileLayout.prototype.addControlButton = function(label, id, callback) {
    var btn = document.createElement('button');
    btn.id = 'ctrl-' + id;
    btn.textContent = label;
    btn.style.cssText =
        'padding:8px 12px;' +
        'font-size:14px;' +
        'font-family:Visitor,monospace;' +
        'background:#555;' +
        'color:#fff;' +
        'border:2px solid #777;' +
        'border-radius:4px;' +
        'cursor:pointer;' +
        'min-width:40px;';

    btn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        callback();
    });

    this.controlPanel.appendChild(btn);
};

// --- Event Handlers ---

MobileLayout.prototype.handleMinimapTap = function(x, y) {
    this.moveViewportToMinimap(x, y);
    // Deselect lemming on tap
    this.selectedLemming = null;
    game.selectedLemming = null;
};

MobileLayout.prototype.handleMinimapDrag = function(x, y) {
    this.moveViewportToMinimap(x, y);
    // Keep lemming selected during drag
};

MobileLayout.prototype.moveViewportToMinimap = function(x, y) {
    // Convert minimap coordinates to level coordinates
    var levelX = (x / this.screenWidth) * this.levelWidth;
    var levelY = (y / this.minimapHeight) * this.levelHeight;

    // Center viewport on position
    this.viewportX = levelX - (this.zoomWidth / this.zoomFactor) / 2;
    this.viewportY = levelY - (this.zoomHeight / this.zoomFactor) / 2;

    // Clamp viewport
    this.clampViewport();
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

MobileLayout.prototype.show = function() {
    var container = document.getElementById('mobile-container');
    if (container) {
        container.style.display = 'block';
    }
    var originalCanvas = document.getElementById('canvas');
    if (originalCanvas) {
        originalCanvas.style.display = 'none';
    }
    this.visible = true;
};

MobileLayout.prototype.hide = function() {
    var container = document.getElementById('mobile-container');
    if (container) {
        container.style.display = 'none';
    }
    // Show original canvas for fullscreen content
    var originalCanvas = document.getElementById('canvas');
    if (originalCanvas) {
        originalCanvas.style.display = 'block';
    }
    this.visible = false;
};

MobileLayout.prototype.isVisible = function() {
    return this.visible;
};

// --- Rendering Methods ---

MobileLayout.prototype.render = function() {
    if (!this.visible) return;
    if (!this.levelWidth || !this.levelHeight) return;

    var sourceCanvas = document.getElementById('canvas');
    if (!sourceCanvas) return;

    this.renderMinimap(sourceCanvas);
    this.renderZoomView(sourceCanvas);
    this.renderOverlays();
};

MobileLayout.prototype.renderMinimap = function(sourceCanvas) {
    var ctx = this.minimapCtx;

    // Clear
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, this.screenWidth, this.minimapHeight);

    // Calculate scale to fit entire level in minimap
    var scaleX = this.screenWidth / this.levelWidth;
    var scaleY = this.minimapHeight / this.levelHeight;
    var scale = Math.min(scaleX, scaleY);

    // Center the minimap
    var offsetX = (this.screenWidth - this.levelWidth * scale) / 2;
    var offsetY = (this.minimapHeight - this.levelHeight * scale) / 2;

    // Draw scaled level
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Draw from source canvas (which has scroll offset)
    // We need to draw the full level, not just visible part
    // For now, draw what's visible and indicate scroll position
    ctx.drawImage(sourceCanvas, game.currentScroll, 0, sourceCanvas.width, sourceCanvas.height,
                  game.currentScroll, 0, sourceCanvas.width, sourceCanvas.height);

    ctx.restore();

    // Draw viewport indicator
    this.drawViewportIndicator(ctx, scale, offsetX, offsetY);

    // Draw lemming positions
    this.drawMinimapLemmings(ctx, scale, offsetX, offsetY);
};

MobileLayout.prototype.drawViewportIndicator = function(ctx, scale, offsetX, offsetY) {
    var viewWidth = this.zoomWidth / this.zoomFactor;
    var viewHeight = this.zoomHeight / this.zoomFactor;

    ctx.strokeStyle = '#ff0';
    ctx.lineWidth = 2;
    ctx.strokeRect(
        offsetX + this.viewportX * scale,
        offsetY + this.viewportY * scale,
        viewWidth * scale,
        viewHeight * scale
    );
};

MobileLayout.prototype.drawMinimapLemmings = function(ctx, scale, offsetX, offsetY) {
    if (!game.lemmings) return;

    for (var i = 0; i < game.lemmings.length; i++) {
        var lemming = game.lemmings[i];

        // Draw lemming as colored dot
        ctx.fillStyle = (lemming === this.selectedLemming) ? '#ff0' : '#0f0';
        ctx.beginPath();
        ctx.arc(
            offsetX + lemming.x * scale,
            offsetY + lemming.y * scale,
            Math.max(2, 4 * scale),
            0, Math.PI * 2
        );
        ctx.fill();
    }
};

MobileLayout.prototype.renderZoomView = function(sourceCanvas) {
    var ctx = this.zoomCtx;

    // Clear with sky color
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, this.zoomWidth, this.zoomHeight);

    // Calculate source rectangle
    var srcX = this.viewportX;
    var srcY = this.viewportY;
    var srcWidth = this.zoomWidth / this.zoomFactor;
    var srcHeight = this.zoomHeight / this.zoomFactor;

    // Clamp to level bounds
    srcX = Math.max(0, Math.min(srcX, this.levelWidth - srcWidth));
    srcY = Math.max(0, Math.min(srcY, this.levelHeight - srcHeight));

    // The source canvas shows level from game.currentScroll
    // We need to translate our viewport to canvas coordinates
    var canvasX = srcX - game.currentScroll;

    // Draw zoomed portion
    ctx.save();
    ctx.scale(this.zoomFactor, this.zoomFactor);

    // Draw from source, accounting for scroll
    if (canvasX >= 0 && canvasX + srcWidth <= sourceCanvas.width) {
        ctx.drawImage(sourceCanvas, canvasX, srcY, srcWidth, srcHeight, 0, 0, srcWidth, srcHeight);
    } else {
        // Viewport extends beyond current canvas view
        // Draw what we can
        ctx.drawImage(sourceCanvas, Math.max(0, canvasX), srcY,
                      Math.min(srcWidth, sourceCanvas.width), srcHeight,
                      Math.max(0, -canvasX), 0,
                      Math.min(srcWidth, sourceCanvas.width), srcHeight);
    }

    ctx.restore();

    // Draw action arrows if lemming selected
    if (this.selectedLemming) {
        this.drawActionArrows(ctx);
    }
};

MobileLayout.prototype.renderOverlays = function() {
    // Additional overlays can be added here
};

MobileLayout.prototype.drawActionArrows = function(ctx) {
    if (!this.selectedLemming) return;

    // Convert lemming position to zoom view coordinates
    var lx = (this.selectedLemming.x - this.viewportX) * this.zoomFactor;
    var ly = (this.selectedLemming.y - this.viewportY) * this.zoomFactor;

    // Arrow configuration
    var arrowLength = 40;
    var arrowWidth = 8;

    var actions = [
        { dir: 'down', angle: 90, action: Dig, label: '↓' },
        { dir: 'down-right', angle: 45, action: Mine, label: '↘' },
        { dir: 'right', angle: 0, action: Bash, label: '→' },
        { dir: 'up-right', angle: -45, action: Build, label: '↗' },
        { dir: 'up', angle: -90, action: Float, label: '↑' },
        { dir: 'left', angle: 180, action: Block, label: '←' }
    ];

    ctx.save();
    ctx.translate(lx, ly - 16); // Center on lemming

    for (var i = 0; i < actions.length; i++) {
        var a = actions[i];

        // Check if action is available
        var count = level.actionCount[a.action];
        if (!count || count <= 0) continue;

        // Determine alpha based on highlight
        var alpha = (this.highlightedDirection === a.dir) ? 1.0 : this.arrowAlpha;

        ctx.save();
        ctx.rotate(a.angle * Math.PI / 180);

        // Draw arrow
        ctx.fillStyle = 'rgba(255, 255, 0, ' + alpha + ')';
        ctx.beginPath();
        ctx.moveTo(20, 0);
        ctx.lineTo(20 + arrowLength, 0);
        ctx.lineTo(20 + arrowLength - arrowWidth, -arrowWidth);
        ctx.moveTo(20 + arrowLength, 0);
        ctx.lineTo(20 + arrowLength - arrowWidth, arrowWidth);
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(255, 255, 0, ' + alpha + ')';
        ctx.stroke();

        ctx.restore();
    }

    ctx.restore();

    // Reset highlight after drawing
    this.highlightedDirection = null;
};

// Global instance
var mobileLayout = null;
