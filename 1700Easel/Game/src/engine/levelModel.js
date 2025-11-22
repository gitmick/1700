"use strict";
/**
 * LevelModel - Pure game state, no rendering logic
 * Holds layer definitions, entity positions, and level data
 */

function LevelModel() {
    // Level dimensions
    this.width = 0;
    this.height = 350; // Gameplay area (without control bar)

    // Spawn and goal
    this.dropX = 0;
    this.dropY = 0;
    this.goalX = 0;
    this.goalY = 0;

    // Layer definitions - ordered back to front
    this.layers = [];

    // Entity references
    this.entities = [];
}

/**
 * Layer definition for backgrounds and terrain
 */
function LayerDef(config) {
    this.id = config.id || '';
    this.image = config.image || null;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.parallaxFactor = config.parallaxFactor !== undefined ? config.parallaxFactor : 1.0;
    this.tiled = config.tiled || false;
    this.visible = config.visible !== undefined ? config.visible : true;
}

/**
 * Initialize model from a loaded level
 */
LevelModel.prototype.initFromLevel = function(lvl, levelData) {
    // Set dimensions from world image
    if (lvl.worldHtmlImage) {
        this.width = lvl.worldHtmlImage.width;
    }

    // Set spawn and goal from level data
    if (levelData) {
        this.dropX = levelData.dropX || 0;
        this.dropY = levelData.dropY || 0;
        this.goalX = levelData.goalX || 0;
        this.goalY = levelData.goalY || 0;
    }

    // Clear existing layers
    this.layers = [];

    // Add background layers (back to front order)

    // Furthest back - day_houses_02 (tiled, parallax)
    if (lvl.backgroundHtmlImage2 && lvl.backgroundHtmlImage2.complete) {
        this.layers.push(new LayerDef({
            id: 'bg_far',
            image: lvl.backgroundHtmlImage2,
            x: 0,
            y: 84,
            parallaxFactor: 0.6,
            tiled: true
        }));
    }

    // Middle - day_houses_01 (tiled, parallax)
    if (lvl.backgroundHtmlImage && lvl.backgroundHtmlImage.complete) {
        this.layers.push(new LayerDef({
            id: 'bg_mid',
            image: lvl.backgroundHtmlImage,
            x: 0,
            y: 67,
            parallaxFactor: 0.6,
            tiled: true
        }));
    }

    // Main building - pizzeria (no parallax, fixed position)
    if (lvl.backgroundHtmlImage3 && lvl.backgroundHtmlImage3.complete) {
        this.layers.push(new LayerDef({
            id: 'building',
            image: lvl.backgroundHtmlImage3,
            x: 460,
            y: 10,
            parallaxFactor: 1.0,
            tiled: false
        }));
    }

    // Terrain/world (no parallax)
    if (lvl.worldHtmlImage) {
        this.layers.push(new LayerDef({
            id: 'terrain',
            image: lvl.worldHtmlImage,
            x: 0,
            y: 0,
            parallaxFactor: 1.0,
            tiled: false
        }));
    }

    // Clouds (if present, far parallax)
    if (lvl.cloudImage && lvl.cloudImage.complete) {
        // Insert at beginning (furthest back)
        this.layers.unshift(new LayerDef({
            id: 'clouds',
            image: lvl.cloudImage,
            x: 0,
            y: 0,
            parallaxFactor: 0.3,
            tiled: true
        }));
    }
};

/**
 * Add an entity to the model
 */
LevelModel.prototype.addEntity = function(entity) {
    this.entities.push(entity);
};

/**
 * Remove an entity from the model
 */
LevelModel.prototype.removeEntity = function(entity) {
    var idx = this.entities.indexOf(entity);
    if (idx >= 0) {
        this.entities.splice(idx, 1);
    }
};

/**
 * Get layer by ID
 */
LevelModel.prototype.getLayer = function(id) {
    for (var i = 0; i < this.layers.length; i++) {
        if (this.layers[i].id === id) {
            return this.layers[i];
        }
    }
    return null;
};
