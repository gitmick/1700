# 1700 Santa Marx - Implementation Phases

Based on story-design.md analysis. Each phase builds on the previous.

---

## Phase 1: Foundation (COMPLETED)

**Game State & Metadata**
- [x] Cookie-based game state persistence
- [x] Level registry with 15 levels and metadata (year, act, intro/outro text)
- [x] Central StatsTracker for both platforms
- [x] Stats display (scoreImage with police out, saved, money)

**Flashback Visual Effects**
- [x] Sepia filter (desktop & mobile)
- [x] Vignette effect (desktop & mobile)
- [x] Year indicator with background

**Bug Fixes**
- [x] Progress bars on mobile
- [x] Mobile back button
- [x] Various asset errors

---

## Phase 2: Navigation & UI Overhaul

**Main Menu**
- [ ] New main menu layout
  - Fortsetzen (Continue)
  - Timeline
  - Zwischensequenzen (Cutscenes)
  - Zitate-Sammlung (Quote Collection)
  - Einstellungen (Settings)

**Timeline Level Select**
- [ ] Dual timeline visualization (2025 above, 2014 below)
- [ ] Visual connections between related levels
- [ ] Santa Marx as final goal indicator
- [ ] Level lock/unlock based on GameState
- [ ] Show completed levels

**Act Transitions**
- [ ] Display Zitate (quotes) between acts
  - After Prolog: Lacordaire (Freiheit/Gesetz)
  - After Akt 2: Marx (Sicherheit = Polizei)
  - After Akt 3: Rousseau (In Ketten geboren)
- [ ] Transition animations

---

## Phase 3: St. Marx Levels (4-11)

**New Backgrounds**
- [ ] "Skatepark Tag" background
  - Blue sky, clouds (parallax)
  - Wiener Skyline/Gasometer
  - Used for: Level 4, 5, 6, 8, 10, 11
- [ ] "Baustelle/Nacht" background
  - Dusk/night atmosphere
  - Construction lights, cranes
  - Arena-Rohbau in background
  - Used for: Level 13, 15, Der Fluch

**New Assets**
- [ ] Container (based on MetBox) - climbable blocks
- [ ] Bauzaun-Segment (based on Sign) - one-way wall
- [ ] Feuertonne (based on barrel) - obstacle + light
- [ ] Transparent (based on Sign) - story text display

**Level Creation**
- [ ] Level 4: "Brach liegt's schön" - flat terrain, introduction
- [ ] Level 5: "Oba gehts oiwei" - concave ramps, timing
- [ ] Level 6: "Stapelweise Probleme" - stacked containers, climb/dig
- [ ] Level 7: Müllberg Replay (already exists, add flashback trigger)
- [ ] Level 8: "Betreten verboten" - vertical barriers, one-way
- [ ] Level 9: Absperrungen Replay (needs creation)
- [ ] Level 10: "Beton ist auch eine Pflanze" - narrow passages, precision
- [ ] Level 11: "Letzte Zugabe" - elevated stage, crowd control

---

## Phase 4: Endless Runner & Final Levels

**Der Fluch - Endless Runner (Level 12)**
- [ ] New game mode: Endless Runner
- [ ] Perspective switch to Demonstrant
- [ ] Mistkübel (trash can) obstacles
- [ ] Night/Akademikerball theme
- [ ] Walzer music

**Bagger Asset**
- [ ] Create Bagger (based on Tank)
- [ ] Movement pattern
- [ ] Becomes DEADLY after time/trigger

**Final Levels**
- [ ] Level 13: "Fortschritt wartet nicht" - open with pit, timing
- [ ] Level 14: Panzer-Level Replay (already exists, enhance)
- [ ] Level 15: "Wien Holding dankt" - finale, all mechanics combined

---

## Phase 5: Story & Polish

**Zwischensequenzen (Cutscenes)**
- [ ] Intro sequence (Wien 2025 → 2014 transition)
- [ ] Between-act story sequences
- [ ] Ending sequence

**Zitate-Sammlung**
- [ ] Collectible quotes throughout levels
- [ ] Gallery view of collected quotes
- [ ] Persist to GameState

**Audio**
- [ ] Flashback-Levels: Original 2014er tracks
- [ ] St. Marx Levels: Müllanfuhr music
- [ ] Der Fluch: Walzer
- [ ] Audio for Zitate displays

**Polish**
- [ ] Level difficulty balancing
- [ ] Budget calculation refinement
- [ ] Mobile optimization
- [ ] Performance testing

---

## Level Status

| # | Level Name | Status | Phase |
|---|------------|--------|-------|
| 1 | Investorentraum | Exists | - |
| 2 | Müllberg 3000 | Exists | - |
| 3 | Baumgartner Höhe | Needs creation | 3 |
| 4 | Brach liegt's schön | Needs creation | 3 |
| 5 | Oba gehts oiwei | Needs creation | 3 |
| 6 | Stapelweise Probleme | Needs creation | 3 |
| 7 | Müllberg (Replay) | Exists | - |
| 8 | Betreten verboten | Needs creation | 3 |
| 9 | Absperrungen (Replay) | Needs creation | 3 |
| 10 | Beton ist auch eine Pflanze | Needs creation | 3 |
| 11 | Letzte Zugabe | Needs creation | 3 |
| 12 | Der Fluch | Needs creation | 4 |
| 13 | Fortschritt wartet nicht | Needs creation | 4 |
| 14 | Panzer-Level (Replay) | Exists (heli?) | 4 |
| 15 | Wien Holding dankt | Needs creation | 4 |

---

## Notes

- Phase 2 can be worked on in parallel with Phase 3 art assets
- Phase 4 requires significant new game mechanics (endless runner)
- Consider playtesting after each phase
- Mobile should be tested throughout
