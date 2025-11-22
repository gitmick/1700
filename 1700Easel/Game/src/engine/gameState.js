"use strict";
/**
 * GameState Manager
 * Handles game progress persistence via cookies
 */

var GameState = {
    // Cookie name
    cookieName: '1700_game_state',

    // Default state
    defaultState: {
        completedLevels: [],
        unlockedLevels: ['IvoLevel'], // First level always unlocked
        collectedZitate: [],
        currentLevel: null,
        highestAct: 0
    },

    // Current state in memory
    state: null,

    /**
     * Initialize state from cookie or defaults
     */
    init: function() {
        this.state = this.load() || this.getDefaultState();
    },

    /**
     * Get a fresh copy of default state
     */
    getDefaultState: function() {
        return JSON.parse(JSON.stringify(this.defaultState));
    },

    /**
     * Save state to cookie
     */
    save: function() {
        if (!this.state) return;

        var json = JSON.stringify(this.state);
        var expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1); // 1 year expiry

        document.cookie = this.cookieName + '=' + encodeURIComponent(json) +
            ';expires=' + expires.toUTCString() +
            ';path=/;SameSite=Strict';
    },

    /**
     * Load state from cookie
     */
    load: function() {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.indexOf(this.cookieName + '=') === 0) {
                var json = decodeURIComponent(cookie.substring(this.cookieName.length + 1));
                try {
                    return JSON.parse(json);
                } catch (e) {
                    console.error('Failed to parse game state cookie:', e);
                    return null;
                }
            }
        }
        return null;
    },

    /**
     * Mark a level as completed
     */
    completeLevel: function(levelName) {
        if (!this.state) this.init();

        if (!this.isLevelCompleted(levelName)) {
            this.state.completedLevels.push(levelName);
        }

        // Unlock next level based on registry
        var nextLevel = LevelRegistry.getNextLevel(levelName);
        if (nextLevel) {
            this.unlockLevel(nextLevel);
        }

        // Update highest act
        var levelData = LevelRegistry.getLevel(levelName);
        if (levelData && levelData.act > this.state.highestAct) {
            this.state.highestAct = levelData.act;
        }

        this.save();
    },

    /**
     * Unlock a level
     */
    unlockLevel: function(levelName) {
        if (!this.state) this.init();

        if (!this.isLevelUnlocked(levelName)) {
            this.state.unlockedLevels.push(levelName);
            this.save();
        }
    },

    /**
     * Check if level is completed
     */
    isLevelCompleted: function(levelName) {
        if (!this.state) this.init();
        return this.state.completedLevels.indexOf(levelName) !== -1;
    },

    /**
     * Check if level is unlocked
     */
    isLevelUnlocked: function(levelName) {
        if (!this.state) this.init();
        return this.state.unlockedLevels.indexOf(levelName) !== -1;
    },

    /**
     * Collect a Zitat (quote)
     */
    collectZitat: function(zitatId) {
        if (!this.state) this.init();

        if (this.state.collectedZitate.indexOf(zitatId) === -1) {
            this.state.collectedZitate.push(zitatId);
            this.save();
        }
    },

    /**
     * Check if Zitat is collected
     */
    hasZitat: function(zitatId) {
        if (!this.state) this.init();
        return this.state.collectedZitate.indexOf(zitatId) !== -1;
    },

    /**
     * Set current level (for continue feature)
     */
    setCurrentLevel: function(levelName) {
        if (!this.state) this.init();
        this.state.currentLevel = levelName;
        this.save();
    },

    /**
     * Get current level
     */
    getCurrentLevel: function() {
        if (!this.state) this.init();
        return this.state.currentLevel;
    },

    /**
     * Get all completed levels
     */
    getCompletedLevels: function() {
        if (!this.state) this.init();
        return this.state.completedLevels;
    },

    /**
     * Get all unlocked levels
     */
    getUnlockedLevels: function() {
        if (!this.state) this.init();
        return this.state.unlockedLevels;
    },

    /**
     * Reset all progress
     */
    reset: function() {
        this.state = this.getDefaultState();
        this.save();
    },

    /**
     * Get progress percentage
     */
    getProgress: function() {
        if (!this.state) this.init();
        var total = LevelRegistry.getTotalLevels();
        if (total === 0) return 0;
        return Math.round((this.state.completedLevels.length / total) * 100);
    }
};
