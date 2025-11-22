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

    // Audio unlocked flag
    this.audioUnlocked = false;
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

    // Minimap canvas (now at bottom, above nothing)
    this.minimapCanvas = document.createElement('canvas');
    this.minimapCanvas.id = 'minimap-canvas';
    this.minimapCanvas.width = this.screenWidth;
    this.minimapCanvas.height = this.minimapHeight;
    this.minimapCanvas.style.cssText = 'position:absolute;top:' + (this.controlHeight + this.zoomHeight) + 'px;left:0;background:#000;';
    this.minimapCtx = this.minimapCanvas.getContext('2d');
    this.minimapCtx.imageSmoothingEnabled = false;
    container.appendChild(this.minimapCanvas);

    // Zoom canvas (middle)
    this.zoomCanvas = document.createElement('canvas');
    this.zoomCanvas.id = 'zoom-canvas';
    this.zoomCanvas.width = this.zoomWidth;
    this.zoomCanvas.height = this.zoomHeight;
    this.zoomCanvas.style.cssText = 'position:absolute;top:' + this.controlHeight + 'px;left:0;background:#87CEEB;';
    this.zoomCtx = this.zoomCanvas.getContext('2d');
    this.zoomCtx.imageSmoothingEnabled = false;
    container.appendChild(this.zoomCanvas);

    document.body.appendChild(container);

    // Mobile container starts hidden, original canvas stays visible for intro screens
    container.style.display = 'none';
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
    this.zoomGesture.onDrag = function(dx, dy) {
        that.handleZoomDrag(dx, dy);
    };
};

MobileLayout.prototype.createControlPanel = function() {
    this.controlPanel = document.createElement('div');
    this.controlPanel.id = 'control-panel';
    this.controlPanel.style.cssText =
        'position:absolute;' +
        'top:0;' +
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

    // Add control buttons with images
    this.addControlButtonImg('img/actions/jumpAll.png', 'jump-mode', this.toggleJumpMode.bind(this));
    this.addControlButtonImg('img/actions/bombAll.png', 'bomb-all', this.bombAll.bind(this));
    this.addControlButtonImg('img/actions/fastForward.png', 'speed', this.toggleSpeed.bind(this));
    this.addControlButtonImg('img/actions/plus.png', 'more', this.moreLemmings.bind(this));
    this.addControlButtonImg('img/actions/minus.png', 'less', this.lessLemmings.bind(this));
    this.addControlButtonImg('img/back.png', 'back', this.goBack.bind(this));

    document.getElementById('mobile-container').appendChild(this.controlPanel);
};

MobileLayout.prototype.addControlButtonImg = function(imgSrc, id, callback) {
    var btn = document.createElement('button');
    btn.id = 'ctrl-' + id;
    btn.style.cssText =
        'padding:0;' +
        'margin:0;' +
        'background:none;' +
        'border:none;' +
        'cursor:pointer;' +
        'display:block;';

    var img = document.createElement('img');
    img.src = imgSrc;
    img.style.cssText = 'width:40px;height:40px;display:block;';
    btn.appendChild(img);

    btn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        callback();
    });

    this.controlPanel.appendChild(btn);
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
    this.unlockAudio();
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
    // Use 350 for height (gameplay area without control bar)
    var levelX = (x / this.screenWidth) * this.levelWidth;
    var levelY = (y / this.minimapHeight) * 350;

    // Center viewport on position
    this.viewportX = levelX - (this.zoomWidth / this.zoomFactor) / 2;
    this.viewportY = levelY - (this.zoomHeight / this.zoomFactor) / 2;

    // Clamp viewport
    this.clampViewport();

    // Sync game scroll with viewport so canvas renders correct content
    this.syncGameScroll();
};

MobileLayout.prototype.syncGameScroll = function() {
    // Update game.currentScroll to match viewportX
    // This ensures the main canvas renders what the viewport wants to see
    game.currentScroll = Math.max(0, Math.min(this.viewportX, this.levelWidth - canvasWidth));
};

MobileLayout.prototype.handleZoomTap = function(x, y) {
    this.unlockAudio();

    // Convert client coordinates to canvas-relative coordinates
    var rect = this.zoomCanvas.getBoundingClientRect();
    var canvasX = x - rect.left;
    var canvasY = y - rect.top;

    // Get clamped viewport position (same as used in rendering)
    var viewWidth = this.zoomWidth / this.zoomFactor;
    var viewHeight = this.zoomHeight / this.zoomFactor;
    var clampedX = Math.max(0, Math.min(this.viewportX, this.levelWidth - viewWidth));
    var clampedY = Math.max(0, Math.min(this.viewportY, 350 - viewHeight));

    // Account for centering offset used in rendering
    var model = game.level && game.level.world && game.level.world.levelModel;
    var offsetX = 0;
    var offsetY = 0;
    if (model) {
        var contentWidth = model.width * this.zoomFactor;
        var contentHeight = model.height * this.zoomFactor;
        offsetX = Math.max(0, (this.zoomWidth - contentWidth) / 2);
        offsetY = Math.max(0, (this.zoomHeight - contentHeight) / 2);
    }

    // Convert canvas coordinates to level coordinates
    var levelX = clampedX + ((canvasX - offsetX) / this.zoomFactor);
    var levelY = clampedY + ((canvasY - offsetY) / this.zoomFactor);

    // Find lemming at this position
    var lemming = this.findLemmingAt(levelX, levelY);

    if (lemming) {
        this.selectedLemming = lemming;
        game.selectedLemming = lemming;
        // Store offset from viewport corner to maintain position during follow
        this.followOffsetX = lemming.x - clampedX;
        this.followOffsetY = lemming.y - clampedY;
    } else {
        this.selectedLemming = null;
        game.selectedLemming = null;
    }
};

MobileLayout.prototype.handleZoomDoubleTap = function(x, y) {
    // Double tap currently unused
};

MobileLayout.prototype.handleZoomLongPress = function(x, y) {
    // Bomb action on selected lemming
    if (this.selectedLemming && level.actionCount[Bomb] > 0) {
        this.selectedLemming.setAction(new Bomb());
        level.actionCount[Bomb]--;
        this.selectedLemming = null;
        game.selectedLemming = null;
    }
};

MobileLayout.prototype.handleZoomSwipe = function(direction, dx, dy, startX, startY) {
    if (!this.selectedLemming) return;

    // Map direction to action
    var action = this.zoomGesture.mapDirectionToAction(direction);
    var count = action ? level.actionCount[action] : 0;

    if (action && count > 0) {
        this.selectedLemming.setAction(new action());
        level.actionCount[action]--;
        // Deselect after action
        this.selectedLemming = null;
        game.selectedLemming = null;
    }
};

MobileLayout.prototype.handleSwipeMove = function(direction, dx, dy, x, y) {
    // Update arrow highlighting during swipe
    this.highlightedDirection = direction;
};

MobileLayout.prototype.handleZoomDrag = function(dx, dy) {
    // Only allow dragging when no lemming is selected
    if (this.selectedLemming) return;

    // Convert screen delta to level delta (inverted for natural feel)
    this.viewportX -= dx / this.zoomFactor;
    this.viewportY -= dy / this.zoomFactor;
    this.clampViewport();
    this.syncGameScroll();
};

// --- Control Button Actions ---

MobileLayout.prototype.toggleJumpMode = function() {
    game.jumpMode = !game.jumpMode;
    var btn = document.getElementById('ctrl-jump-mode');
    btn.style.background = game.jumpMode ? '#0a0' : '#555';
};

MobileLayout.prototype.bombAll = function() {
    var action = new BombAll();
    action.execute();
};

MobileLayout.prototype.toggleSpeed = function() {
    var action = new FinishSpeed();
    action.execute();
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

    // Hide mobile layout and show navigation menu
    this.hide();
    MobileNavigation.showLevelSelect();
};

// --- Helper Methods ---

MobileLayout.prototype.unlockAudio = function() {
    if (this.audioUnlocked) return;

    // Unlock Web Audio API context (used by CreateJS Sound)
    if (createjs && createjs.Sound && createjs.Sound.activePlugin) {
        var ctx = createjs.Sound.activePlugin.context;
        if (ctx && ctx.state === 'suspended') {
            ctx.resume();
        }
    }

    // Also try playing a silent sound to fully unlock
    if (createjs && createjs.Sound) {
        try {
            var instance = createjs.Sound.play('_silence_');
            if (instance) instance.stop();
        } catch(e) {}
    }

    this.audioUnlocked = true;
};

MobileLayout.prototype.setLevelDimensions = function(width, height) {
    this.levelWidth = width;
    this.levelHeight = height;

    // Default viewport to lower left corner
    var viewHeight = this.zoomHeight / this.zoomFactor;
    this.viewportX = 0;
    this.viewportY = height - viewHeight;
    this.clampViewport();
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
        // lemming.x/y is top-left of sprite
        // Sprite is roughly 20x30, centered hitbox
        var dx = levelX - lemming.x;
        var dy = levelY - lemming.y;
        if (dx >= 5 && dx < 25 && dy >= 5 && dy < 35) {
            return lemming;
        }
    }
    return null;
};

MobileLayout.prototype.update = function() {
    // Check if selected lemming is still valid (in game.lemmings array)
    if (this.selectedLemming) {
        var stillValid = game.lemmings && game.lemmings.indexOf(this.selectedLemming) !== -1;
        if (!stillValid) {
            this.selectedLemming = null;
            game.selectedLemming = null;
        }
    }

    // Follow selected lemming, maintaining its position in viewport
    if (this.selectedLemming && this.followOffsetX !== undefined) {
        this.viewportX = this.selectedLemming.x - this.followOffsetX;
        this.viewportY = this.selectedLemming.y - this.followOffsetY;
        this.clampViewport();
    }

    // Always sync game scroll with viewport
    this.syncGameScroll();
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

    // Get model from world
    var model = game.level && game.level.world && game.level.world.levelModel;
    if (!model || !levelRenderer) {
        // Fallback: clear with sky
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, this.screenWidth, this.minimapHeight);
        return;
    }

    // Create minimap viewport (shows entire level, no parallax)
    var minimapViewport = Viewport.createMinimap(this.levelWidth, 350, this.screenWidth, this.minimapHeight);

    // Render using new architecture
    levelRenderer.render(model, minimapViewport, ctx, {
        skyColor: '#D0EEf3',
        renderEntities: true,
        selectedLemming: this.selectedLemming
    });

    // Draw viewport indicator on top
    var scale = minimapViewport.scale;
    var offsetX = (this.screenWidth - this.levelWidth * scale) / 2;
    var offsetY = (this.minimapHeight - 350 * scale) / 2;
    this.drawViewportIndicator(ctx, scale, offsetX, offsetY);
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

    // Check if spritesheet is available
    if (typeof lemmingsSheet !== 'undefined' && lemmingsSheet && lemmingsSheet._images && lemmingsSheet._images[0]) {
        var sheetImage = lemmingsSheet._images[0];

        for (var i = 0; i < game.lemmings.length; i++) {
            var lemming = game.lemmings[i];
            var sprite = lemming.circle;

            if (!sprite) continue;

            // Get current frame data from spritesheet
            var frame = sprite.currentFrame;
            var frameData = lemmingsSheet.getFrame(frame);

            if (frameData && frameData.rect) {
                // Draw the sprite frame at lemming's position
                ctx.drawImage(
                    sheetImage,
                    frameData.rect.x, frameData.rect.y,
                    frameData.rect.width, frameData.rect.height,
                    offsetX + lemming.x * scale,
                    offsetY + lemming.y * scale,
                    frameData.rect.width * scale,
                    frameData.rect.height * scale
                );

                // Highlight selected lemming
                if (lemming === this.selectedLemming) {
                    ctx.strokeStyle = '#ff0';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(
                        offsetX + lemming.x * scale,
                        offsetY + lemming.y * scale,
                        frameData.rect.width * scale,
                        frameData.rect.height * scale
                    );
                }
            }
        }
    } else {
        // Fallback to dots if spritesheet not available
        for (var i = 0; i < game.lemmings.length; i++) {
            var lemming = game.lemmings[i];
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
    }
};

MobileLayout.prototype.renderZoomView = function(sourceCanvas) {
    var ctx = this.zoomCtx;

    // Get model from world
    var model = game.level && game.level.world && game.level.world.levelModel;
    if (!model || !levelRenderer) {
        // Fallback: clear with sky
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, this.zoomWidth, this.zoomHeight);
        return;
    }

    // Create zoomed viewport
    var zoomedViewport = new Viewport({
        scrollX: this.viewportX,
        scrollY: this.viewportY,
        width: this.zoomWidth,
        height: this.zoomHeight,
        scale: this.zoomFactor,
        parallaxEnabled: true
    });

    // Clamp scroll to level bounds
    zoomedViewport.clampScroll(this.levelWidth, 350);

    // Render using new architecture
    levelRenderer.render(model, zoomedViewport, ctx, {
        skyColor: '#D0EEf3',
        renderEntities: true,
        selectedLemming: this.selectedLemming
    });

    // Apply flashback effects if this is a flashback level
    if (level && level.isFlashback) {
        this.applyFlashbackEffects(ctx);
    }

    // Draw action arrows if lemming selected
    if (this.selectedLemming) {
        this.drawActionArrows(ctx);
    }

    // Draw year indicator
    if (level && level.year) {
        this.drawYearIndicator(ctx, level.year);
    }

    // Draw game stats overlay
    this.drawStatsOverlay(ctx);
};

/**
 * Draw game stats (police out, saved, money) in top left
 * Uses scaled scoreImage with text overlay like desktop
 */
MobileLayout.prototype.drawStatsOverlay = function(ctx) {
    if (!game || !game.lemmings) return;

    // Get scoreImage from globalLoader
    var scoreImg = globalLoader ? globalLoader.getImage('img/scoreImage.png') : null;
    if (!scoreImg || !scoreImg.complete) return;

    ctx.save();

    // Scale factor for the score panel
    var scale = 1.0;
    var x = 5;
    var y = 5;

    // Draw scaled scoreImage
    ctx.drawImage(scoreImg, x, y, scoreImg.width * scale, scoreImg.height * scale);

    // Police out (count alive lemmings) - yellow like gameText
    var out = 0;
    if (game.lemmings) {
        for (var i = 0; i < game.lemmings.length; i++) {
            if (!game.lemmings[i].dead && !game.lemmings[i].saved) {
                out++;
            }
        }
    }

    // Police count - gameText: x=73, y=6, font=40px
    ctx.font = '40px Visitor, monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff600';
    ctx.fillText(out.toString(), x + 73, y + 38);

    // Saved / Required - goalText: x=73, y=58, font=10px
    var saved = typeof StatsTracker !== 'undefined' ? StatsTracker.getSaved() : 0;
    var required = typeof StatsTracker !== 'undefined' ? StatsTracker.getRequired() : 0;
    ctx.font = '10px Visitor, monospace';
    ctx.fillStyle = '#2b3642';
    ctx.fillText(saved + ' / ' + required, x + 73, y + 68);

    // Money - moneyText: x=180, y=15, font=20px
    var money = typeof StatsTracker !== 'undefined' ? StatsTracker.getMoney() : 870000;
    ctx.font = '20px Visitor, monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ac6363';
    ctx.fillText(money.toLocaleString(), x + 180, y + 30);

    ctx.restore();
};

/**
 * Apply sepia and vignette effects for flashback levels
 */
MobileLayout.prototype.applyFlashbackEffects = function(ctx) {
    var width = this.zoomWidth;
    var height = this.zoomHeight;

    // Apply sepia tone
    var imageData = ctx.getImageData(0, 0, width, height);
    var data = imageData.data;

    for (var i = 0; i < data.length; i += 4) {
        var r = data[i];
        var g = data[i + 1];
        var b = data[i + 2];

        // Sepia formula
        data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
        data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
        data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
    }

    ctx.putImageData(imageData, 0, 0);

    // Draw vignette - linear gradients on edges like desktop
    // Top edge
    var topGrad = ctx.createLinearGradient(0, 0, 0, 100);
    topGrad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, width, 100);

    // Bottom edge
    var bottomGrad = ctx.createLinearGradient(0, height - 100, 0, height);
    bottomGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    bottomGrad.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
    ctx.fillStyle = bottomGrad;
    ctx.fillRect(0, height - 100, width, 100);

    // Left edge
    var leftGrad = ctx.createLinearGradient(0, 0, 100, 0);
    leftGrad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    leftGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = leftGrad;
    ctx.fillRect(0, 0, 100, height);

    // Right edge
    var rightGrad = ctx.createLinearGradient(width - 100, 0, width, 0);
    rightGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    rightGrad.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
    ctx.fillStyle = rightGrad;
    ctx.fillRect(width - 100, 0, 100, height);
};

/**
 * Draw year indicator in corner
 */
MobileLayout.prototype.drawYearIndicator = function(ctx, year) {
    ctx.save();

    // Background
    var text = year.toString();
    var x = this.zoomWidth - 60;
    var y = 5;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(x - 5, y, 60, 25);

    // Text
    ctx.font = 'bold 18px Visitor, monospace';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'right';
    ctx.fillText(text, this.zoomWidth - 10, y + 18);

    ctx.restore();
};

MobileLayout.prototype.drawHitboxes = function(ctx) {
    if (!game.lemmings) return;

    ctx.strokeStyle = 'rgba(255, 0, 255, 0.5)';
    ctx.lineWidth = 1;

    for (var i = 0; i < game.lemmings.length; i++) {
        var lemming = game.lemmings[i];
        // Hitbox: dx >= 5 && dx < 25 && dy >= 5 && dy < 35
        var hx = lemming.x + 5;
        var hy = lemming.y + 5;
        var hw = 20;
        var hh = 30;

        // Convert to screen coordinates
        var screenX = (hx - this.viewportX) * this.zoomFactor;
        var screenY = (hy - this.viewportY) * this.zoomFactor;
        var screenW = hw * this.zoomFactor;
        var screenH = hh * this.zoomFactor;

        ctx.strokeRect(screenX, screenY, screenW, screenH);
    }
};

MobileLayout.prototype.renderOverlays = function() {
    // Additional overlays can be added here
};

MobileLayout.prototype.drawActionArrows = function(ctx) {
    if (!this.selectedLemming) return;

    // Draw from center of zoom canvas
    var centerX = this.zoomWidth / 2;
    var centerY = this.zoomHeight / 2;

    // Arrow configuration - use most of the available space
    var maxRadius = Math.min(centerX, centerY) - 40; // Leave room for icons
    var arrowLength = maxRadius - 30;
    var arrowStart = 30;

    var actions = [
        { dir: 'down', angle: 90, action: Dig, name: 'Dig' },
        { dir: 'down-right', angle: 45, action: Mine, name: 'Mine' },
        { dir: 'right', angle: 0, action: Bash, name: 'Bash' },
        { dir: 'up-right', angle: -45, action: Build, name: 'Build' },
        { dir: 'up', angle: -90, action: Climb, name: 'Climb' },
        { dir: 'up-left', angle: -135, action: Float, name: 'Float' },
        { dir: 'left', angle: 180, action: Block, name: 'Block' }
    ];

    for (var i = 0; i < actions.length; i++) {
        var a = actions[i];

        // Check if action count is available
        var count = level.actionCount[a.action];
        if (!count || count <= 0) continue;

        // Check if lemming can perform this action
        var canPerform = this.selectedLemming.checkAction(new a.action());

        // Determine alpha based on highlight
        var alpha = (this.highlightedDirection === a.dir) ? 0.9 : 0.4;

        // Calculate positions
        var rad = a.angle * Math.PI / 180;

        // Only draw arrow if action is possible
        if (canPerform) {
            var endX = centerX + Math.cos(rad) * arrowLength;
            var endY = centerY + Math.sin(rad) * arrowLength;
            var startX = centerX + Math.cos(rad) * arrowStart;
            var startY = centerY + Math.sin(rad) * arrowStart;

            // Draw arrow line
            ctx.strokeStyle = 'rgba(255, 255, 0, ' + alpha + ')';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();

            // Draw arrowhead
            var headLen = 10;
            var headAngle = Math.PI / 6;
            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX - headLen * Math.cos(rad - headAngle), endY - headLen * Math.sin(rad - headAngle));
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX - headLen * Math.cos(rad + headAngle), endY - headLen * Math.sin(rad + headAngle));
            ctx.stroke();
        }

        // Always draw action name and count
        var labelX = centerX + Math.cos(rad) * (maxRadius + 10);
        var labelY = centerY + Math.sin(rad) * (maxRadius + 10);

        ctx.font = '16px Visitor, monospace';
        ctx.fillStyle = 'rgba(0, 0, 0, ' + (canPerform ? alpha : 0.2) + ')';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(a.name + ' ' + count, labelX, labelY);
    }

    // Reset highlight after drawing
    this.highlightedDirection = null;
};

// Global instance
var mobileLayout = null;
