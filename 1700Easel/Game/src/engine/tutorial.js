"use strict";
/**
 * Tutorial System
 * Provides contextual hints and guided learning for new players
 * Separate from game logic - observes game state and shows hints
 *
 * All text in German for Vienna market
 */

var Tutorial = {

    // Tutorial state
    active: false,
    currentStep: 0,
    levelTutorial: null,
    hintContainer: null,
    highlightOverlay: null,
    dismissTimer: null,

    // Track what's been shown this session
    shownHints: [],

    /**
     * Tutorial content for each level (German)
     */
    content: {
        // First level - basic controls
        buerstelDream: {
            isTutorialLevel: true,
            // Slower police drop for learning
            policeDelay: 60,  // Much slower than normal
            maxPoliceMen: 20,

            steps: [
                // Step 0: Welcome & Navigation (mobile)
                {
                    mobile: {
                        hint: 'Willkommen! Oben siehst du die Übersichtskarte.',
                        highlight: 'minimap-canvas',
                        trigger: 'levelStart',
                        delay: 1000
                    },
                    desktop: {
                        hint: 'Willkommen! Scrolle mit den Pfeiltasten oder am Rand.',
                        trigger: 'levelStart',
                        delay: 1000
                    }
                },
                // Step 1: Zoom view (mobile only)
                {
                    mobile: {
                        hint: 'Hier siehst du das Spielfeld vergrößert. Ziehe um zu scrollen.',
                        highlight: 'zoom-canvas',
                        trigger: 'afterPrevious',
                        delay: 4000
                    },
                    desktop: null
                },
                // Step 2: Police arriving
                {
                    mobile: {
                        hint: 'Die Polizisten kommen! Tippe auf einen um ihn auszuwählen.',
                        trigger: 'firstPoliceDropped',
                        delay: 500
                    },
                    desktop: {
                        hint: 'Die Polizisten kommen! Wähle zuerst eine Aktion, dann klicke auf einen Polizisten.',
                        trigger: 'firstPoliceDropped',
                        delay: 500
                    }
                },
                // Step 3: Selection (mobile)
                {
                    mobile: {
                        hint: 'Gut! Die Kamera folgt jetzt dem ausgewählten Polizisten. Wische um eine Aktion zuzuweisen.',
                        trigger: 'policeSelected',
                        showArrows: true
                    },
                    desktop: null
                },
                // Step 4: Actions intro
                {
                    mobile: {
                        hint: 'Wische HOCH-RECHTS für BAUEN - der Polizist baut eine Treppe.',
                        trigger: 'afterPrevious',
                        delay: 3000,
                        highlightAction: 'Build'
                    },
                    desktop: {
                        hint: 'Klicke auf BAUEN und dann auf einen Polizisten - er baut eine Treppe.',
                        trigger: 'afterPrevious',
                        delay: 3000,
                        highlightAction: 'Build'
                    }
                },
                // Step 5: Build used
                {
                    mobile: {
                        hint: 'Super! Probiere auch andere Aktionen aus.',
                        trigger: 'actionUsed_Build'
                    },
                    desktop: {
                        hint: 'Super! Probiere auch andere Aktionen aus.',
                        trigger: 'actionUsed_Build'
                    }
                },
                // Step 6: Goal
                {
                    hint: 'Bringe die Polizisten sicher zum Ausgang rechts!',
                    trigger: 'afterPrevious',
                    delay: 5000
                },
                // Step 7: Control buttons (mobile)
                {
                    mobile: {
                        hint: 'Oben findest du Spezialaktionen: Schneller, Alle springen, Zurück zum Menü.',
                        highlight: 'control-panel',
                        trigger: 'afterPrevious',
                        delay: 8000
                    },
                    desktop: null
                }
            ]
        },

        // Second level - more actions
        couch: {
            isTutorialLevel: true,
            steps: [
                {
                    mobile: {
                        hint: 'Wische LINKS für BLOCKEN - der Polizist hält andere auf.',
                        trigger: 'levelStart',
                        delay: 2000,
                        highlightAction: 'Block'
                    },
                    desktop: {
                        hint: 'BLOCKEN hält andere Polizisten auf.',
                        trigger: 'levelStart',
                        delay: 2000,
                        highlightAction: 'Block'
                    }
                },
                {
                    mobile: {
                        hint: 'Wische HOCH-LINKS für SCHWEBEN - überlebt hohe Stürze.',
                        trigger: 'actionUsed_Block',
                        highlightAction: 'Float'
                    },
                    desktop: {
                        hint: 'SCHWEBEN lässt Polizisten hohe Stürze überleben.',
                        trigger: 'actionUsed_Block',
                        highlightAction: 'Float'
                    }
                }
            ]
        },

        // Third level - destructive actions
        Mullberg: {
            isTutorialLevel: true,
            steps: [
                {
                    hint: 'Manchmal muss man Hindernisse zerstören!',
                    trigger: 'levelStart',
                    delay: 2000
                },
                {
                    mobile: {
                        hint: 'Wische RECHTS für HAUEN - zerstört horizontal.',
                        trigger: 'afterPrevious',
                        delay: 3000,
                        highlightAction: 'Bash'
                    },
                    desktop: {
                        hint: 'HAUEN zerstört Hindernisse horizontal.',
                        trigger: 'afterPrevious',
                        delay: 3000,
                        highlightAction: 'Bash'
                    }
                },
                {
                    mobile: {
                        hint: 'Wische RUNTER für GRABEN - gräbt nach unten.',
                        trigger: 'actionUsed_Bash',
                        highlightAction: 'Dig'
                    },
                    desktop: {
                        hint: 'GRABEN gräbt senkrecht nach unten.',
                        trigger: 'actionUsed_Bash',
                        highlightAction: 'Dig'
                    }
                },
                {
                    mobile: {
                        hint: 'Halte lange gedrückt für BOMBE - Vorsicht, zerstört den Polizisten!',
                        trigger: 'actionUsed_Dig',
                        highlightAction: 'Bomb'
                    },
                    desktop: {
                        hint: 'BOMBE zerstört alles ringsum - auch den Polizisten selbst!',
                        trigger: 'actionUsed_Dig',
                        highlightAction: 'Bomb'
                    }
                }
            ]
        }
    },

    /**
     * Action descriptions (German)
     */
    actionDescriptions: {
        Build: { name: 'Bauen', desc: 'Baut eine Treppe', direction: 'hoch-rechts' },
        Block: { name: 'Blocken', desc: 'Hält andere auf', direction: 'links' },
        Float: { name: 'Schweben', desc: 'Überlebt Stürze', direction: 'hoch-links' },
        Climb: { name: 'Klettern', desc: 'Klettert Wände hoch', direction: 'hoch' },
        Bash: { name: 'Hauen', desc: 'Zerstört horizontal', direction: 'rechts' },
        Dig: { name: 'Graben', desc: 'Gräbt nach unten', direction: 'runter' },
        Mine: { name: 'Schürfen', desc: 'Gräbt diagonal', direction: 'runter-rechts' },
        Bomb: { name: 'Bombe', desc: 'Explodiert!', direction: 'lange drücken' }
    },

    /**
     * Initialize tutorial system
     */
    init: function() {
        this.createHintContainer();
        this.createHighlightOverlay();
    },

    /**
     * Create the hint display container
     */
    createHintContainer: function() {
        if (this.hintContainer) return;

        this.hintContainer = document.createElement('div');
        this.hintContainer.id = 'tutorial-hint';
        document.body.appendChild(this.hintContainer);

        var style = document.createElement('style');
        style.textContent = `
            #tutorial-hint {
                position: fixed;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.9);
                color: #fff;
                padding: 15px 25px;
                border-radius: 10px;
                font-family: Visitor, monospace;
                font-size: 16px;
                text-align: center;
                z-index: 850;
                display: none;
                max-width: 90%;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                border: 2px solid #ff7700;
                animation: tutorialSlideIn 0.3s ease;
            }
            @media (max-width: 768px) {
                #tutorial-hint {
                    bottom: 80px;
                    font-size: 14px;
                    padding: 12px 20px;
                }
            }
            @media (min-width: 769px) {
                #tutorial-hint {
                    top: 60px;
                }
            }
            #tutorial-hint .hint-text {
                margin-bottom: 10px;
            }
            #tutorial-hint .hint-dismiss {
                color: #888;
                font-size: 12px;
            }
            #tutorial-hint.hiding {
                animation: tutorialSlideOut 0.3s ease forwards;
            }
            @keyframes tutorialSlideIn {
                from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
            @keyframes tutorialSlideOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }

            /* Highlight overlay */
            #tutorial-highlight {
                position: fixed;
                pointer-events: none;
                z-index: 840;
                display: none;
            }
            #tutorial-highlight .highlight-box {
                position: absolute;
                border: 3px solid #ff7700;
                border-radius: 8px;
                box-shadow: 0 0 20px rgba(255, 119, 0, 0.5);
                animation: highlightPulse 1.5s infinite;
            }
            @keyframes highlightPulse {
                0%, 100% { box-shadow: 0 0 20px rgba(255, 119, 0, 0.5); }
                50% { box-shadow: 0 0 30px rgba(255, 119, 0, 0.8); }
            }
        `;
        document.head.appendChild(style);
    },

    /**
     * Create highlight overlay for UI elements
     */
    createHighlightOverlay: function() {
        if (this.highlightOverlay) return;

        this.highlightOverlay = document.createElement('div');
        this.highlightOverlay.id = 'tutorial-highlight';
        document.body.appendChild(this.highlightOverlay);
    },

    /**
     * Start tutorial for a level
     */
    startLevel: function(levelName) {
        this.levelTutorial = this.content[levelName];
        if (!this.levelTutorial) {
            this.active = false;
            return;
        }

        // Check if user has completed this tutorial before
        if (typeof GameState !== 'undefined' && GameState.hasTutorialSeen('level_' + levelName)) {
            this.active = false;
            return;
        }

        this.active = true;
        this.currentStep = 0;
        this.shownHints = [];
        this.firstPoliceDropped = false;

        // Apply tutorial-specific level settings
        if (this.levelTutorial.policeDelay && typeof level !== 'undefined') {
            level.policeDelay = this.levelTutorial.policeDelay;
        }
        if (this.levelTutorial.maxPoliceMen && typeof level !== 'undefined') {
            level.maxPoliceMen = this.levelTutorial.maxPoliceMen;
        }

        // Listen for first police drop
        var that = this;
        this.policeDropHandler = {
            bang: function(name) {
                if (!that.firstPoliceDropped) {
                    that.firstPoliceDropped = true;
                    that.onFirstPoliceDrop();
                }
            }
        };
        if (typeof A !== 'undefined' && A.bus) {
            A.bus.addTrigger('addPolicemen', this.policeDropHandler);
        }

        // Trigger first step
        this.checkTrigger('levelStart');
    },

    /**
     * Check if a trigger should show the next hint
     */
    checkTrigger: function(triggerName) {
        if (!this.active || !this.levelTutorial) return;

        var steps = this.levelTutorial.steps;
        if (this.currentStep >= steps.length) {
            this.complete();
            return;
        }

        var step = steps[this.currentStep];
        var isMobile = typeof isMobileDevice !== 'undefined' && isMobileDevice;

        // Get platform-specific or generic step data
        var stepData = step;
        if (isMobile && step.mobile) {
            stepData = step.mobile;
        } else if (!isMobile && step.desktop) {
            stepData = step.desktop;
        } else if (isMobile && step.desktop && !step.mobile) {
            // Skip desktop-only steps on mobile
            this.currentStep++;
            this.checkTrigger(triggerName);
            return;
        } else if (!isMobile && step.mobile && !step.desktop) {
            // Skip mobile-only steps on desktop
            this.currentStep++;
            this.checkTrigger(triggerName);
            return;
        }

        if (!stepData || !stepData.hint) {
            this.currentStep++;
            this.checkTrigger(triggerName);
            return;
        }

        // Check if trigger matches
        if (stepData.trigger === triggerName) {
            var delay = stepData.delay || 0;
            var that = this;
            setTimeout(function() {
                that.showHint(stepData);
            }, delay);
        } else if (stepData.trigger === 'afterPrevious' && this.shownHints.length > 0) {
            var delay = stepData.delay || 2000;
            var that = this;
            setTimeout(function() {
                that.showHint(stepData);
            }, delay);
        }
    },

    /**
     * Show a hint
     */
    showHint: function(stepData) {
        if (!this.hintContainer) this.init();

        // Build hint HTML
        var html = '<div class="hint-text">' + stepData.hint + '</div>';
        html += '<div class="hint-dismiss">Tippe um fortzufahren</div>';

        this.hintContainer.innerHTML = html;
        this.hintContainer.style.display = 'block';
        this.hintContainer.classList.remove('hiding');

        // Highlight element if specified
        if (stepData.highlight) {
            this.highlightElement(stepData.highlight);
        }

        // Track shown hint
        this.shownHints.push(this.currentStep);

        // Auto-dismiss after delay or on tap
        var that = this;
        var dismissHandler = function(e) {
            e.preventDefault();
            that.dismissHint();
            document.removeEventListener('click', dismissHandler);
            document.removeEventListener('touchstart', dismissHandler);
        };

        // Add dismiss handlers after a short delay to prevent immediate dismissal
        setTimeout(function() {
            document.addEventListener('click', dismissHandler);
            document.addEventListener('touchstart', dismissHandler);
        }, 500);

        // Auto-advance after 8 seconds if not dismissed
        this.dismissTimer = setTimeout(function() {
            that.dismissHint();
            document.removeEventListener('click', dismissHandler);
            document.removeEventListener('touchstart', dismissHandler);
        }, 8000);
    },

    /**
     * Dismiss current hint and advance
     */
    dismissHint: function() {
        if (this.dismissTimer) {
            clearTimeout(this.dismissTimer);
            this.dismissTimer = null;
        }

        if (this.hintContainer) {
            this.hintContainer.classList.add('hiding');
            var that = this;
            setTimeout(function() {
                that.hintContainer.style.display = 'none';
            }, 300);
        }

        this.hideHighlight();
        this.currentStep++;

        // Check for afterPrevious trigger
        var that = this;
        setTimeout(function() {
            that.checkTrigger('afterPrevious');
        }, 500);
    },

    /**
     * Highlight a UI element
     */
    highlightElement: function(elementId) {
        var element = document.getElementById(elementId);
        if (!element || !this.highlightOverlay) return;

        var rect = element.getBoundingClientRect();

        this.highlightOverlay.innerHTML = '';
        var box = document.createElement('div');
        box.className = 'highlight-box';
        box.style.left = rect.left + 'px';
        box.style.top = rect.top + 'px';
        box.style.width = rect.width + 'px';
        box.style.height = rect.height + 'px';

        this.highlightOverlay.appendChild(box);
        this.highlightOverlay.style.display = 'block';
    },

    /**
     * Hide highlight
     */
    hideHighlight: function() {
        if (this.highlightOverlay) {
            this.highlightOverlay.style.display = 'none';
        }
    },

    /**
     * Called when police is first dropped
     */
    onFirstPoliceDrop: function() {
        this.checkTrigger('firstPoliceDropped');
    },

    /**
     * Called when a police is selected
     */
    onPoliceSelected: function() {
        this.checkTrigger('policeSelected');
    },

    /**
     * Called when an action is used
     */
    onActionUsed: function(actionName) {
        this.checkTrigger('actionUsed_' + actionName);
    },

    /**
     * Complete tutorial for this level
     */
    complete: function() {
        this.active = false;
        this.hideHighlight();

        if (this.hintContainer) {
            this.hintContainer.style.display = 'none';
        }

        // Mark tutorial as seen
        if (typeof GameState !== 'undefined' && typeof level !== 'undefined') {
            GameState.setTutorialSeen('level_' + level.name);
        }
    },

    /**
     * Clean up
     */
    cleanup: function() {
        this.active = false;
        this.hideHighlight();

        if (this.dismissTimer) {
            clearTimeout(this.dismissTimer);
            this.dismissTimer = null;
        }

        if (this.hintContainer) {
            this.hintContainer.style.display = 'none';
        }

        // Remove trigger listener
        if (this.policeDropHandler && typeof A !== 'undefined' && A.bus) {
            A.bus.removeTrigger('addPolicemen', this.policeDropHandler);
            this.policeDropHandler = null;
        }
    },

    /**
     * Check if tutorial is active for current level
     */
    isActive: function() {
        return this.active;
    },

    /**
     * Get tutorial-modified level settings
     */
    getLevelSettings: function(levelName) {
        var tutorial = this.content[levelName];
        if (!tutorial) return null;

        return {
            policeDelay: tutorial.policeDelay,
            maxPoliceMen: tutorial.maxPoliceMen
        };
    }
};
