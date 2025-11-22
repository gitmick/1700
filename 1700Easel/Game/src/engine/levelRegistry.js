"use strict";
/**
 * Level Registry
 * Central registry of all levels with metadata for story/timeline
 */

var LevelRegistry = {
    // All levels in order
    levels: [
        // Prolog (Act 0)
        {
            id: 'IvoLevel',
            number: 1,
            title: 'Investorentraum',
            act: 0,
            actName: 'Prolog',
            year: 2014,
            isFlashback: true,
            introText: 'Punks haben besetzt. Zeit zum Aufräumen!',
            outroText: 'Die haben einen Mietvertrag? Ohne Miete?'
        },
        {
            id: 'Mullberg',
            number: 2,
            title: 'Müllberg 3000',
            act: 0,
            actName: 'Prolog',
            year: 2014,
            isFlashback: true,
            introText: 'Die Chaoten haben alles vollgemüllt!',
            outroText: 'Die Kanalisation wurde von der Hausverwaltung verstopft?'
        },
        {
            id: 'baumgartner',
            number: 3,
            title: 'Baumgartner Höhe',
            act: 0,
            actName: 'Prolog',
            year: 2014,
            isFlashback: true,
            introText: 'Wir müssen die Mieter schützen!',
            outroText: 'Die Punks haben die Mieter geschützt?'
        },

        // Akt 1: Der Ruf
        {
            id: 'brachLiegts',
            number: 4,
            title: "Brach liegt's schön",
            act: 1,
            actName: 'Der Ruf',
            year: 2025,
            isFlashback: false,
            introText: 'St. Marx, 2025. Der Skatepark muss weichen.',
            outroText: null
        },
        {
            id: 'obaGehts',
            number: 5,
            title: 'Oba gehts oiwei',
            act: 1,
            actName: 'Der Ruf',
            year: 2025,
            isFlashback: false,
            introText: 'Die Skater wollen nicht gehen.',
            outroText: null
        },

        // Akt 2: Erinnerungen
        {
            id: 'stapelweise',
            number: 6,
            title: 'Stapelweise Probleme',
            act: 2,
            actName: 'Erinnerungen',
            year: 2025,
            isFlashback: false,
            introText: 'Container blockieren den Weg.',
            outroText: 'Diese Container erinnern mich an etwas...'
        },
        {
            id: 'Mullberg2',
            number: 7,
            title: 'Müllberg (Replay)',
            act: 2,
            actName: 'Erinnerungen',
            year: 2014,
            isFlashback: true,
            introText: 'Wien, 2014. Der Sperrmüll.',
            outroText: 'Sperrmüll... Container... alles dasselbe.'
        },
        {
            id: 'betretenVerboten',
            number: 8,
            title: 'Betreten verboten',
            act: 2,
            actName: 'Erinnerungen',
            year: 2025,
            isFlashback: false,
            introText: 'Bauzäune überall.',
            outroText: 'Absperrungen... wie damals.'
        },
        {
            id: 'absperrungen',
            number: 9,
            title: 'Absperrungen (Replay)',
            act: 2,
            actName: 'Erinnerungen',
            year: 2014,
            isFlashback: true,
            introText: 'Wien, 2014. Die Polizeiabsperrung.',
            outroText: 'Im Weg steht man sich selbst.'
        },

        // Akt 3: Eskalation
        {
            id: 'betonPflanze',
            number: 10,
            title: 'Beton ist auch eine Pflanze',
            act: 3,
            actName: 'Eskalation',
            year: 2025,
            isFlashback: false,
            introText: '"Sanfte Räumung" nennen sie es.',
            outroText: null
        },
        {
            id: 'letzteZugabe',
            number: 11,
            title: 'Letzte Zugabe',
            act: 3,
            actName: 'Eskalation',
            year: 2025,
            isFlashback: false,
            introText: 'Müllanfuhr spielen ihr letztes Konzert.',
            outroText: 'Die Menge... der Mistkübel...'
        },
        {
            id: 'derFluch',
            number: 12,
            title: 'Der Fluch',
            act: 3,
            actName: 'Eskalation',
            year: 2016,
            isFlashback: true,
            isEndlessRunner: true,
            introText: 'Akademikerball, 2016.',
            outroText: 'Der Mistkübel an der Leine.'
        },

        // Akt 4: Der Kreuzzug
        {
            id: 'fortschrittWartet',
            number: 13,
            title: 'Fortschritt wartet nicht',
            act: 4,
            actName: 'Der Kreuzzug',
            year: 2025,
            isFlashback: false,
            introText: 'Die Bagger rollen.',
            outroText: 'Bagger... wie die Panzer damals.'
        },
        {
            id: 'panzerLevel',
            number: 14,
            title: 'Panzer-Level (Replay)',
            act: 4,
            actName: 'Der Kreuzzug',
            year: 2014,
            isFlashback: true,
            introText: 'Wien, 2014. Die Panzerwagen.',
            outroText: 'Damals Panzer, heute Bagger.'
        },
        {
            id: 'wienHolding',
            number: 15,
            title: 'Wien Holding dankt',
            act: 4,
            actName: 'Der Kreuzzug',
            year: 2025,
            isFlashback: false,
            introText: 'Die finale Räumung.',
            outroText: 'Santa Marx. Frohe Weihnachten.'
        }
    ],

    // Zitate (quotes) that can be collected
    zitate: [
        {
            id: 'lacordaire',
            afterAct: 0,
            author: 'Lacordaire',
            year: 1848,
            text: 'Zwischen dem Starken und dem Schwachen ist es die Freiheit, die unterdrückt, und das Gesetz, das befreit.'
        },
        {
            id: 'marx',
            afterAct: 2,
            author: 'Karl Marx',
            year: null,
            text: 'Die Sicherheit ist der höchste soziale Begriff der bürgerlichen Gesellschaft, der Begriff der Polizei.'
        },
        {
            id: 'rousseau',
            afterAct: 3,
            author: 'Rousseau',
            year: null,
            text: 'Der Mensch ist frei geboren und liegt überall in Ketten!'
        }
    ],

    /**
     * Get level by ID
     */
    getLevel: function(levelId) {
        for (var i = 0; i < this.levels.length; i++) {
            if (this.levels[i].id === levelId) {
                return this.levels[i];
            }
        }
        return null;
    },

    /**
     * Get level by number
     */
    getLevelByNumber: function(number) {
        for (var i = 0; i < this.levels.length; i++) {
            if (this.levels[i].number === number) {
                return this.levels[i];
            }
        }
        return null;
    },

    /**
     * Get next level ID
     */
    getNextLevel: function(currentLevelId) {
        var current = this.getLevel(currentLevelId);
        if (!current) return null;

        var next = this.getLevelByNumber(current.number + 1);
        return next ? next.id : null;
    },

    /**
     * Get all levels in an act
     */
    getLevelsByAct: function(actNumber) {
        var result = [];
        for (var i = 0; i < this.levels.length; i++) {
            if (this.levels[i].act === actNumber) {
                result.push(this.levels[i]);
            }
        }
        return result;
    },

    /**
     * Get total number of levels
     */
    getTotalLevels: function() {
        return this.levels.length;
    },

    /**
     * Get all flashback levels
     */
    getFlashbackLevels: function() {
        var result = [];
        for (var i = 0; i < this.levels.length; i++) {
            if (this.levels[i].isFlashback) {
                result.push(this.levels[i]);
            }
        }
        return result;
    },

    /**
     * Get Zitat for after completing an act
     */
    getZitatForAct: function(actNumber) {
        for (var i = 0; i < this.zitate.length; i++) {
            if (this.zitate[i].afterAct === actNumber) {
                return this.zitate[i];
            }
        }
        return null;
    },

    /**
     * Get all Zitate
     */
    getAllZitate: function() {
        return this.zitate;
    }
};
