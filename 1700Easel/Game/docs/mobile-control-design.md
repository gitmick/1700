# Mobile Control Design

## Übersicht

Dieses Dokument beschreibt das mobile Steuerungskonzept für das Spiel im Hochformat (Portrait Mode).
Das Desktop-Spiel (Querformat) bleibt unverändert erhalten.

## Device Detection

```javascript
// Erkennung ob Mobile oder Desktop
function isMobile() {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || (window.innerWidth < window.innerHeight); // Portrait = Mobile
}
```

## Screen Layouts

### Desktop (Querformat 800x384)
Bleibt unverändert:
- Vollbild-Spielansicht
- Action-Bar unten (36x36px Buttons)
- Maus-Scrolling am Rand

### Mobile (Hochformat ~400x700)

```
┌─────────────────────────────┐
│                             │
│   MINIMAP                   │
│   (komplettes Level)        │
│   Höhe: ~150px              │
│                             │
├─────────────────────┬───────┤
│                     │       │
│   ZOOM VIEW         │ CTRL  │
│   (Detail)          │       │
│   ~300x400px        │ 100px │
│                     │       │
│                     │[Jump] │
│                     │[Bomb] │
│                     │[Speed]│
│                     │[Back] │
│                     │       │
└─────────────────────┴───────┘
```

## Navigation Screens

### Main Screen (Mobile)
- Buttons vertikal anordnen statt horizontal
- Touch-optimierte Größe (min 48x48px)

### Level Select (Mobile)
- Grid-Layout anpassen für Portrait
- Scroll falls nötig

## Gameplay Controls

### Minimap Interaktion
- **Tap auf Minimap**: Zoom-View verschiebt sich zu dieser Position
- **Viewport-Indikator**: Rechteck zeigt aktuellen Zoom-Bereich
- **Effekt**: Selektierter Lemming wird deselektiert

### Zoom-View Interaktion
- **Tap auf Lemming**: Lemming wird selektiert
- **Selektierter Lemming**: Zoom-View folgt automatisch
- **Swipe auf selektiertem Lemming**: Aktion ausführen

### Swipe-Gesten (Absolut)

| Richtung | Winkel | Aktion | Beschreibung |
|----------|--------|--------|--------------|
| ↓ | 247.5° - 292.5° | Dig | Gerade nach unten graben |
| ↘ | 292.5° - 337.5° | Mine | Schräg nach unten graben |
| → | 337.5° - 22.5° | Bash | Horizontal graben |
| ↗ | 22.5° - 67.5° | Build | Treppe bauen |
| ↑ | 67.5° - 112.5° | Float | Fallschirm aktivieren |
| ↖ | 112.5° - 157.5° | - | (reserviert) |
| ← | 157.5° - 202.5° | Block | Stoppen/Blockieren |
| ↙ | 202.5° - 247.5° | - | (reserviert) |

### Spezielle Gesten
- **Doppel-Tap auf Lemming**: Bomb (Selbstzerstörung)
- **Long-Press auf Lemming**: Climb (Kletterer)

### Jump Mode
- Toggle-Button in Control Panel
- Wenn aktiv: Swipe über beliebige Lemminge → alle berührten springen
- Visuelles Feedback: Button hervorgehoben

## Global Controls Panel

| Button | Aktion |
|--------|--------|
| Jump | Jump-Mode Toggle |
| Bomb | Alle Lemminge sprengen |
| Speed | Spielgeschwindigkeit erhöhen |
| +/- | Mehr/Weniger Lemminge |
| Back | Zurück zum Level-Select |

## Technische Implementierung

### Neue Dateien
- `src/engine/mobileControl.js` - Mobile Steuerungslogik
- `src/engine/mobileLayout.js` - Layout-Management
- `src/engine/gestureRecognizer.js` - Swipe/Tap/Long-Press Erkennung

### Änderungen an bestehenden Dateien
- `game.html` - Mobile Scripts einbinden
- `src/main.js` - Device Detection, Layout-Switch
- `src/engine/game.js` - Mobile/Desktop Control-Instanz
- `src/flavor/lemming/mainScreen.js` - Portrait Layout
- `src/flavor/lemming/world.js` - Minimap Rendering

### Rendering

#### Minimap
- Skalierter Canvas des kompletten Levels
- Faktor: `minimapWidth / levelWidth`
- Viewport-Rechteck zeichnen
- Lemminge als Punkte darstellen

#### Zoom-View
- Ausschnitt des Levels
- Zoom-Faktor konfigurierbar (default: 1.5x)
- Zentriert auf Viewport-Position oder selektierten Lemming

### Gesture Recognition

```javascript
class GestureRecognizer {
    constructor(element) {
        this.startX = 0;
        this.startY = 0;
        this.startTime = 0;

        // Thresholds
        this.swipeMinDistance = 30;  // px
        this.longPressTime = 500;    // ms
        this.doubleTapTime = 300;    // ms
    }

    getSwipeDirection(dx, dy) {
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        // Map angle to 8 directions
        // 0° = right, 90° = down, 180° = left, -90° = up
    }
}
```

### State Management

```javascript
class MobileGameState {
    selectedLemming: null,
    viewportX: 0,
    viewportY: 0,
    jumpModeActive: false,
    zoomFactor: 1.5
}
```

## Offene Punkte

1. **Canvas-Größe**: Dynamisch an Bildschirm anpassen?
2. **Zoom-Faktor**: Fest oder vom Spieler einstellbar?
3. **Lemming-Selektion**: Visuelles Feedback (Highlight)?
4. **Sound**: Feedback-Sounds für Gesten?
5. **Tutorial**: Gesten-Anleitung für neue Spieler?

## Testplan

1. Device Detection auf verschiedenen Geräten
2. Alle Swipe-Richtungen testen
3. Minimap-Navigation
4. Lemming-Tracking
5. Jump-Mode
6. Performance (zwei Render-Passes)
7. Desktop-Version weiterhin funktionsfähig
