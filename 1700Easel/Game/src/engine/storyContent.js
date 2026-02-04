"use strict";
/**
 * Story Content
 * Centralized narrative data for the 1700 game
 * All story text in one place for easy editing
 */

var StoryContent = {

    // ========================================
    // GAME INTRO SEQUENCE
    // Shown on first play before any level
    // ========================================
    gameIntro: {
        id: 'game_intro',
        pages: [
            { text: 'Wien, 2025', style: 'location', duration: 2000 },
            { text: 'St. Marx: Skatepark muss weichen', style: 'headline', duration: 3000 },
            { text: 'Wien Holding Arena: 500 Millionen Euro', style: 'small', duration: 2500 },
            { text: 'Es gibt eine Legende in Wien...', style: 'narrative', duration: 2500 },
            { text: 'Die 1700.', style: 'title', duration: 2000 },
            { text: 'Wiens schlafende Helden.', style: 'narrative', duration: 2000 },
            { text: 'Wenn Wien in Not ist, erwachen die 1700.', style: 'narrative', duration: 3000 },
            { text: 'Aber um zu verstehen wer sie sind...', style: 'narrative', duration: 2500 },
            { text: 'Wien, 2014', style: 'location', effect: 'sepia', duration: 2000 }
        ]
    },

    // ========================================
    // FLASHBACK TRANSITIONS
    // Shown when jumping from St. Marx to 2014
    // ========================================
    flashbackTransitions: {
        // After stapelweise → Mullberg2
        'stapelweise_to_Mullberg2': {
            pages: [
                { text: 'Diese Container...', style: 'narrative', duration: 2000 },
                { text: 'Sie erinnern mich an etwas.', style: 'narrative', duration: 2000 },
                { text: 'Wien, 2014', style: 'location', effect: 'sepia', duration: 2000 }
            ]
        },
        // After betretenVerboten → absperrungen
        'betretenVerboten_to_absperrungen': {
            pages: [
                { text: 'Absperrungen...', style: 'narrative', duration: 2000 },
                { text: 'Wie damals.', style: 'narrative', duration: 2000 },
                { text: 'Wien, 2014', style: 'location', effect: 'sepia', duration: 2000 }
            ]
        },
        // After letzteZugabe → derFluch
        'letzteZugabe_to_derFluch': {
            pages: [
                { text: 'Die Menge... der Mistkübel...', style: 'narrative', duration: 2000 },
                { text: 'Wien, 2016', style: 'location', effect: 'sepia', duration: 2000 },
                { text: 'Akademikerball', style: 'headline', duration: 2000 }
            ]
        },
        // After fortschrittWartet → panzerLevel
        'fortschrittWartet_to_panzerLevel': {
            pages: [
                { text: 'Bagger...', style: 'narrative', duration: 2000 },
                { text: 'Wie die Panzer damals.', style: 'narrative', duration: 2000 },
                { text: 'Wien, 2014', style: 'location', effect: 'sepia', duration: 2000 }
            ]
        }
    },

    // ========================================
    // ACT INTROS
    // Shown at the start of each act
    // ========================================
    actIntros: {
        0: null, // Prolog starts with game intro
        1: {
            pages: [
                { text: 'Akt 1', style: 'small', duration: 1500 },
                { text: 'Der Ruf', style: 'title', duration: 2500 },
                { text: 'Wien, 2025', style: 'location', duration: 2000 }
            ]
        },
        2: {
            pages: [
                { text: 'Akt 2', style: 'small', duration: 1500 },
                { text: 'Erinnerungen', style: 'title', duration: 2500 }
            ]
        },
        3: {
            pages: [
                { text: 'Akt 3', style: 'small', duration: 1500 },
                { text: 'Eskalation', style: 'title', duration: 2500 }
            ]
        },
        4: {
            pages: [
                { text: 'Akt 4', style: 'small', duration: 1500 },
                { text: 'Der Kreuzzug', style: 'title', duration: 2500 }
            ]
        }
    },

    // ========================================
    // TUTORIAL HINTS
    // Contextual hints shown during gameplay
    // Different text for mobile (touch) vs desktop (mouse/keyboard)
    // ========================================
    tutorialHints: {
        // Level 1: IvoLevel - Basic selection and actions
        'IvoLevel': [
            {
                id: 'selection',
                textMobile: 'Tippe auf einen Polizisten',
                textDesktop: 'Klicke auf einen Polizisten',
                condition: function(game) {
                    return game.added > 2 && !game.selectedLemming;
                },
                dismissOn: 'selection',
                delay: 3000
            },
            {
                id: 'action_swipe',
                textMobile: 'Wische um eine Aktion zuzuweisen',
                textDesktop: 'Klicke auf eine Aktion in der Leiste unten',
                condition: function(game) {
                    return game.selectedLemming && !game.actionUsed;
                },
                dismissOn: 'action_used',
                delay: 1000
            },
            {
                id: 'goal',
                textMobile: 'Bringe die Polizisten zum Ausgang',
                textDesktop: 'Bringe die Polizisten zum Ausgang',
                condition: function(game) {
                    return game.added > 0 && game.winCount === 0;
                },
                dismissOn: 'policeman_saved',
                delay: 8000
            }
        ],

        // Level 2: Mullberg - Float action
        'Mullberg': [
            {
                id: 'float_intro',
                textMobile: 'Manche Polizisten werden fallen...',
                textDesktop: 'Manche Polizisten werden fallen...',
                condition: function(game) {
                    return game.added > 0;
                },
                dismissOn: 'timeout',
                delay: 2000,
                duration: 3000
            },
            {
                id: 'float_hint',
                textMobile: 'Float: Wische nach oben-links',
                textDesktop: 'Float: Klicke auf das Fallschirm-Symbol',
                condition: function(game) {
                    // Show when a lemming is falling
                    for (var i = 0; i < game.lemmings.length; i++) {
                        var l = game.lemmings[i];
                        if (l && l.action && l.action.name === 'Fall') {
                            return true;
                        }
                    }
                    return false;
                },
                dismissOn: 'float_used',
                delay: 0
            }
        ],

        // Level 3: baumgartner - Block action
        'baumgartner': [
            {
                id: 'block_intro',
                textMobile: 'Zu viele auf einmal?',
                textDesktop: 'Zu viele auf einmal?',
                condition: function(game) {
                    return game.added > 5;
                },
                dismissOn: 'timeout',
                delay: 3000,
                duration: 3000
            },
            {
                id: 'block_hint',
                textMobile: 'Block: Wische nach links',
                textDesktop: 'Block: Klicke auf das Block-Symbol',
                condition: function(game) {
                    return game.added > 8 && !game.blockUsed;
                },
                dismissOn: 'block_used',
                delay: 0
            }
        ]
    },

    // ========================================
    // GAME ENDING
    // Shown after completing the final level
    // ========================================
    ending: {
        id: 'game_ending',
        pages: [
            { text: 'Die Räumung ist abgeschlossen.', style: 'narrative', duration: 3000 },
            { text: 'Wien Holding dankt.', style: 'headline', duration: 3000 },
            { text: 'Santa Marx.', style: 'title', duration: 3000 },
            { text: 'Frohe Weihnachten.', style: 'narrative', duration: 2500 },
            { text: 'Die 1700 ruhen wieder.', style: 'narrative', duration: 3000 },
            { text: 'Bis Wien sie wieder ruft.', style: 'narrative', duration: 3000 },
            { text: '...', style: 'small', duration: 2000 },
            { text: 'Aber was haben sie wirklich gerettet?', style: 'narrative', duration: 4000 }
        ]
    },

    // ========================================
    // HELPER METHODS
    // ========================================

    /**
     * Get flashback transition for a level
     */
    getFlashbackTransition: function(fromLevel, toLevel) {
        var key = fromLevel + '_to_' + toLevel;
        return this.flashbackTransitions[key] || null;
    },

    /**
     * Get act intro
     */
    getActIntro: function(actNumber) {
        return this.actIntros[actNumber] || null;
    },

    /**
     * Get tutorial hints for a level
     */
    getTutorialHints: function(levelName) {
        return this.tutorialHints[levelName] || [];
    },

    /**
     * Format a quote for display
     */
    formatQuote: function(zitat) {
        if (!zitat) return null;

        var pages = [
            { text: '"' + zitat.text + '"', style: 'quote', duration: 5000 }
        ];

        var attribution = '— ' + zitat.author;
        if (zitat.year) {
            attribution += ', ' + zitat.year;
        }
        pages.push({ text: attribution, style: 'attribution', duration: 2000 });

        return { id: 'zitat_' + zitat.id, pages: pages };
    }
};
