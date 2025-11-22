"use strict";
/**
 * LevelRenderer - Renders LevelModel through a Viewport to a canvas
 * Single rendering logic used by desktop, minimap, and zoomed views
 */

function LevelRenderer() {
}

/**
 * Render the level model to a canvas context
 * @param {LevelModel} model - The level data to render
 * @param {Viewport} viewport - The viewport configuration
 * @param {CanvasRenderingContext2D} ctx - The canvas context to draw to
 * @param {Object} options - Additional rendering options
 */
LevelRenderer.prototype.render = function(model, viewport, ctx, options) {
    options = options || {};

    // Clear with sky color
    ctx.fillStyle = options.skyColor || '#87CEEB';
    ctx.fillRect(0, 0, viewport.width, viewport.height);

    // Calculate offset to center content if viewport is larger than content
    var contentWidth = model.width * viewport.scale;
    var contentHeight = model.height * viewport.scale;
    var offsetX = Math.max(0, (viewport.width - contentWidth) / 2);
    var offsetY = Math.max(0, (viewport.height - contentHeight) / 2);

    // Render all layers
    for (var i = 0; i < model.layers.length; i++) {
        var layer = model.layers[i];
        if (layer.visible && layer.image) {
            this.renderLayer(layer, model, viewport, ctx, offsetX, offsetY);
        }
    }

    // Render terrain modifications (dug holes, etc.)
    this.renderForegroundModifications(model, viewport, ctx, offsetX, offsetY);

    // Render entities (lemmings, assets) if requested
    if (options.renderEntities !== false) {
        this.renderEntities(model, viewport, ctx, offsetX, offsetY, options);
    }
};

/**
 * Render a single layer
 */
LevelRenderer.prototype.renderLayer = function(layer, model, viewport, ctx, offsetX, offsetY) {
    var img = layer.image;
    if (!img || !img.complete) return;

    // Calculate parallax offset
    var parallaxFactor = viewport.parallaxEnabled ? layer.parallaxFactor : 1.0;
    var parallaxOffset = viewport.scrollX * (1 - parallaxFactor);

    // Layer position in level coordinates
    var layerX = layer.x + parallaxOffset;
    var layerY = layer.y;

    // Convert to screen coordinates
    var screenX = (layerX - viewport.scrollX) * viewport.scale + offsetX;
    var screenY = (layerY - viewport.scrollY) * viewport.scale + offsetY;

    // Calculate draw dimensions
    var drawWidth = img.width * viewport.scale;
    var drawHeight = Math.min(model.height - layer.y, img.height) * viewport.scale;
    var srcHeight = Math.min(model.height - layer.y, img.height);

    // Special handling for terrain layer - cut holes where digging happened
    if (layer.id === 'terrain' && game && game.level && game.level.world) {
        var world = game.level.world;
        if (world.foreGroundMask && world.foreGroundMask.cacheCanvas) {
            // Create temp canvas for terrain with holes
            if (!this._terrainCanvas) {
                this._terrainCanvas = document.createElement('canvas');
                this._terrainCtx = this._terrainCanvas.getContext('2d');
            }

            this._terrainCanvas.width = img.width;
            this._terrainCanvas.height = img.height;

            // Draw terrain image
            this._terrainCtx.clearRect(0, 0, img.width, img.height);
            this._terrainCtx.drawImage(img, 0, 0);

            // Cut holes where mask has content
            this._terrainCtx.globalCompositeOperation = 'destination-out';
            this._terrainCtx.drawImage(world.foreGroundMask.cacheCanvas, 0, 0);
            this._terrainCtx.globalCompositeOperation = 'source-over';

            // Draw to main canvas
            ctx.drawImage(
                this._terrainCanvas,
                0, 0, img.width, srcHeight,
                screenX, screenY, drawWidth, drawHeight
            );
            return;
        }
    }

    if (layer.tiled) {
        // Draw tiled copies to fill the level width
        var copies = Math.ceil(model.width / img.width) + 1;
        for (var c = 0; c < copies; c++) {
            var tileX = screenX + (c * img.width * viewport.scale);

            // Only draw if visible
            if (tileX + drawWidth > 0 && tileX < viewport.width) {
                ctx.drawImage(
                    img,
                    0, 0, img.width, srcHeight,
                    tileX, screenY, drawWidth, drawHeight
                );
            }
        }
    } else {
        // Draw single image
        ctx.drawImage(
            img,
            0, 0, img.width, srcHeight,
            screenX, screenY, drawWidth, drawHeight
        );
    }
};

/**
 * Render foreground modifications (dug holes, built stairs, etc.)
 */
LevelRenderer.prototype.renderForegroundModifications = function(model, viewport, ctx, offsetX, offsetY) {
    // Get the world's foreground cache (contains terrain modifications)
    if (!game || !game.level || !game.level.world) return;

    var world = game.level.world;

    // Draw the foreground shape's cache if it exists (built terrain like stairs)
    if (world.foreGround && world.foreGround.cacheCanvas) {
        var screenX = (0 - viewport.scrollX) * viewport.scale + offsetX;
        var screenY = (0 - viewport.scrollY) * viewport.scale + offsetY;
        var drawWidth = world.foreGround.cacheCanvas.width * viewport.scale;
        var drawHeight = world.foreGround.cacheCanvas.height * viewport.scale;

        ctx.drawImage(
            world.foreGround.cacheCanvas,
            screenX, screenY,
            drawWidth, drawHeight
        );
    }
};

/**
 * Render entities (lemmings, assets)
 */
LevelRenderer.prototype.renderEntities = function(model, viewport, ctx, offsetX, offsetY, options) {
    // Render assets first (behind lemmings)
    if (typeof level !== 'undefined' && level.assets) {
        this.renderAssets(level.assets, viewport, ctx, offsetX, offsetY);
    }

    // Render lemmings
    if (game && game.lemmings && typeof lemmingsSheet !== 'undefined') {
        this.renderLemmings(game.lemmings, viewport, ctx, offsetX, offsetY, options);
    }
};

/**
 * Render assets (helicopter, goal, etc.)
 */
LevelRenderer.prototype.renderAssets = function(assets, viewport, ctx, offsetX, offsetY) {
    for (var i = 0; i < assets.length; i++) {
        var asset = assets[i];
        if (!asset.showMe || !asset.displayEntity) continue;

        var assetX = asset.displayEntity.x;
        var assetY = asset.displayEntity.y;

        // Convert to screen coordinates
        var screenX = (assetX - viewport.scrollX) * viewport.scale + offsetX;
        var screenY = (assetY - viewport.scrollY) * viewport.scale + offsetY;

        // Render each display element in the asset
        var deElements = asset.displayEntity.deElements;
        if (!deElements) continue;

        for (var j = 0; j < deElements.length; j++) {
            var de = deElements[j];
            if (!de || !de.element) continue;

            var elem = de.element;

            // Handle Bitmap
            if (elem.image && elem.image.complete) {
                var img = elem.image;
                var elemX = screenX + (de.xOff || 0) * viewport.scale;
                var elemY = screenY + (de.yOff || 0) * viewport.scale;

                ctx.drawImage(
                    img,
                    elemX, elemY,
                    img.width * viewport.scale,
                    img.height * viewport.scale
                );
            }
            // Handle Sprite
            else if (elem.spriteSheet && elem.currentFrame !== undefined) {
                var frameData = elem.spriteSheet.getFrame(elem.currentFrame);
                if (frameData && frameData.rect && frameData.image) {
                    var elemX = screenX + (de.xOff || 0) * viewport.scale;
                    var elemY = screenY + (de.yOff || 0) * viewport.scale;

                    ctx.drawImage(
                        frameData.image,
                        frameData.rect.x, frameData.rect.y,
                        frameData.rect.width, frameData.rect.height,
                        elemX, elemY,
                        frameData.rect.width * viewport.scale,
                        frameData.rect.height * viewport.scale
                    );
                }
            }
        }
    }
};

/**
 * Render lemmings
 */
LevelRenderer.prototype.renderLemmings = function(lemmings, viewport, ctx, offsetX, offsetY, options) {
    if (!lemmings || !lemmingsSheet || !lemmingsSheet._images || !lemmingsSheet._images[0]) {
        return;
    }

    var sheetImage = lemmingsSheet._images[0];

    for (var i = 0; i < lemmings.length; i++) {
        var lemming = lemmings[i];
        var sprite = lemming.circle;
        if (!sprite) continue;

        // Get current frame data
        var frame = sprite.currentFrame;
        var frameData = lemmingsSheet.getFrame(frame);
        if (!frameData || !frameData.rect) continue;

        // Convert lemming position to screen coordinates
        var screenX = (lemming.x - viewport.scrollX) * viewport.scale + offsetX;
        var screenY = (lemming.y - viewport.scrollY) * viewport.scale + offsetY;

        // Draw sprite frame
        ctx.drawImage(
            sheetImage,
            frameData.rect.x, frameData.rect.y,
            frameData.rect.width, frameData.rect.height,
            screenX, screenY,
            frameData.rect.width * viewport.scale,
            frameData.rect.height * viewport.scale
        );

        // Draw progress bar if lemming has one (bomb countdown, build progress, etc.)
        if (lemming.progressValue !== null && lemming.progressValue !== undefined) {
            var p = lemming.progressValue;
            var barX = screenX + 5 * viewport.scale;
            var barY = screenY + 5 * viewport.scale;
            var barWidth = 22 * p * viewport.scale;
            var barHeight = 5 * viewport.scale;

            // Color: red (p=0) to green (p=1)
            var r = parseInt(255 - 255 * p);
            var g = parseInt(255 * p);
            ctx.fillStyle = 'rgb(' + r + ',' + g + ',0)';
            ctx.fillRect(barX, barY, barWidth, barHeight);
        }

        // Highlight selected lemming
        if (options.selectedLemming === lemming) {
            ctx.strokeStyle = '#ff0';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                screenX, screenY,
                frameData.rect.width * viewport.scale,
                frameData.rect.height * viewport.scale
            );
        }
    }
};

/**
 * Draw a viewport indicator (for minimap)
 */
LevelRenderer.prototype.drawViewportIndicator = function(model, sourceViewport, targetViewport, ctx, offsetX, offsetY) {
    // Get the visible area of the source viewport
    var visible = sourceViewport.getVisibleArea();

    // Convert to target viewport screen coordinates
    var screenX = (visible.x - targetViewport.scrollX) * targetViewport.scale + offsetX;
    var screenY = (visible.y - targetViewport.scrollY) * targetViewport.scale + offsetY;
    var screenW = visible.width * targetViewport.scale;
    var screenH = visible.height * targetViewport.scale;

    ctx.strokeStyle = '#ff0';
    ctx.lineWidth = 2;
    ctx.strokeRect(screenX, screenY, screenW, screenH);
};

// Global instance
var levelRenderer = new LevelRenderer();
