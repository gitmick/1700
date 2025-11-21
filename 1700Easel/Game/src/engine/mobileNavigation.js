"use strict";
/**
 * Mobile Navigation Screens
 * HTML/CSS based navigation for portrait mode
 */

var MobileNavigation = {

    container: null,

    init: function() {
        // Create container for mobile navigation
        this.container = document.createElement('div');
        this.container.id = 'mobile-nav';
        this.container.style.cssText =
            'position:absolute;top:0;left:0;width:100%;height:100%;' +
            'display:none;flex-direction:column;align-items:center;' +
            'justify-content:center;background:#1a1a2e;font-family:Visitor,monospace;';
        document.body.appendChild(this.container);
    },

    show: function() {
        if (this.container) {
            this.container.style.display = 'flex';
        }
        // Hide game canvases
        var canvas = document.getElementById('canvas');
        if (canvas) canvas.style.display = 'none';
        var mobileContainer = document.getElementById('mobile-container');
        if (mobileContainer) mobileContainer.style.display = 'none';
    },

    hide: function() {
        if (this.container) {
            this.container.style.display = 'none';
        }
    },

    clear: function() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    },

    // --- Main Menu Screen ---
    showMainMenu: function() {
        this.clear();
        this.show();

        // Title
        var title = document.createElement('h1');
        title.textContent = '1700 3/4';
        title.style.cssText =
            'color:#ff7700;font-size:48px;margin-bottom:60px;text-shadow:3px 3px #000;';
        this.container.appendChild(title);

        // Start Button
        this.addNavButton('Spiel Starten', function() {
            MobileNavigation.showLevelSelect();
        });

        // Fluch Mode Button (optional)
        this.addNavButton('Fluch Modus', function() {
            MobileNavigation.hide();
            flavor = new FluchFlavor();
            flavor.init();
        });
    },

    // --- Level Select Screen ---
    showLevelSelect: function() {
        this.clear();
        this.show();

        // Title
        var title = document.createElement('h2');
        title.textContent = 'Level Auswahl';
        title.style.cssText =
            'color:#ff7700;font-size:32px;margin-bottom:30px;';
        this.container.appendChild(title);

        // Level grid container
        var grid = document.createElement('div');
        grid.style.cssText =
            'display:grid;grid-template-columns:repeat(2,1fr);gap:15px;' +
            'padding:20px;max-width:350px;width:100%;';
        this.container.appendChild(grid);

        // Level buttons
        var levels = [
            {name: 'buerstelDream', label: 'Bürstel Dream'},
            {name: 'couch', label: 'Couch'},
            {name: 'block', label: 'Block'},
            {name: 'heli', label: 'Heli'},
            {name: 'heliBridge', label: 'Heli Bridge'},
            {name: 'devLevel', label: 'Dev Level'},
            {name: 'jump', label: 'Jump'},
            {name: 'Mullberg', label: 'Müllberg'},
            {name: 'subterra', label: 'Subterra'},
            {name: 'Mullberg2', label: 'Müllberg 2'}
        ];

        for (var i = 0; i < levels.length; i++) {
            var lvl = levels[i];
            this.addLevelButton(grid, lvl.name, lvl.label);
        }

        // Back button
        var backContainer = document.createElement('div');
        backContainer.style.cssText = 'margin-top:30px;';
        this.container.appendChild(backContainer);

        var backBtn = document.createElement('button');
        backBtn.textContent = 'Zurück';
        backBtn.style.cssText = this.getButtonStyle() + 'background:#555;';
        backBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            MobileNavigation.showMainMenu();
        });
        backContainer.appendChild(backBtn);
    },

    addNavButton: function(label, callback) {
        var btn = document.createElement('button');
        btn.textContent = label;
        btn.style.cssText = this.getButtonStyle() + 'width:250px;margin:10px 0;';
        btn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            callback();
        });
        this.container.appendChild(btn);
    },

    addLevelButton: function(container, levelName, label) {
        var btn = document.createElement('button');
        btn.textContent = label;
        btn.style.cssText =
            'padding:15px 10px;font-size:14px;font-family:Visitor,monospace;' +
            'background:#2a2a4e;color:#fff;border:2px solid #ff7700;' +
            'border-radius:8px;cursor:pointer;';

        btn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            MobileNavigation.hide();
            MobileNavigation.startLevel(levelName);
        });

        container.appendChild(btn);
    },

    startLevel: function(levelName) {
        // Don't show mobile layout yet - intro screen needs fullscreen
        // Mobile layout will be shown when gameplay starts (in loadAssets.load)

        game.level = new FolderLevel(levelName);
        game.level.start(game.machine);
    },

    getButtonStyle: function() {
        return 'padding:20px 30px;font-size:18px;font-family:Visitor,monospace;' +
               'background:#ff7700;color:#fff;border:none;border-radius:8px;' +
               'cursor:pointer;box-shadow:3px 3px 0 #000;';
    },

    // --- Intro Screen ---
    showIntro: function(title, description, callback) {
        this.clear();
        this.show();

        // Title
        var titleEl = document.createElement('h2');
        titleEl.textContent = title;
        titleEl.style.cssText =
            'color:#ff7700;font-size:28px;margin-bottom:20px;text-align:center;padding:0 20px;';
        this.container.appendChild(titleEl);

        // Description
        if (description) {
            var descEl = document.createElement('p');
            descEl.textContent = description;
            descEl.style.cssText =
                'color:#fff;font-size:16px;margin-bottom:40px;text-align:center;padding:0 20px;max-width:350px;';
            this.container.appendChild(descEl);
        }

        // Tap to continue hint
        var hint = document.createElement('p');
        hint.textContent = 'Tap to start';
        hint.style.cssText =
            'color:#888;font-size:14px;position:absolute;bottom:50px;';
        this.container.appendChild(hint);

        // Tap anywhere to continue
        var that = this;
        this.container.addEventListener('touchstart', function onTap(e) {
            e.preventDefault();
            that.container.removeEventListener('touchstart', onTap);
            that.hide();
            if (callback) callback();
        }, {once: true});
    }
};
