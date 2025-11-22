"use strict";
/**
 * Stats Tracker
 * Central tracking of game stats for both mobile and desktop display
 */

var StatsTracker = {
    policeSaved: 0,
    policeOut: 0,

    init: function() {
        this.reset();

        // Subscribe to bus events
        if (typeof A !== 'undefined' && A.bus) {
            var that = this;
            A.bus.addTrigger(POLICEMAN_SAVED, {
                bang: function() {
                    that.policeSaved++;
                }
            });
        }
    },

    reset: function() {
        this.policeSaved = 0;
        this.policeOut = 0;
    },

    getSaved: function() {
        return this.policeSaved;
    },

    getOut: function() {
        // Count active lemmings
        var out = 0;
        if (typeof game !== 'undefined' && game.lemmings) {
            for (var i = 0; i < game.lemmings.length; i++) {
                if (!game.lemmings[i].dead) {
                    out++;
                }
            }
        }
        return out;
    },

    getMoney: function() {
        if (typeof timeKeeper !== 'undefined') {
            return timeKeeper.moneyLeft;
        }
        return 870000;
    },

    getRequired: function() {
        if (typeof level !== 'undefined' && level.minSafeCount) {
            return level.minSafeCount;
        }
        return 0;
    }
};
