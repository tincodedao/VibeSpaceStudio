# VibeSpace — Design System Specification (`DESIGN.md`)

> **Derived from Google Stitch Screens:** `1a5881dd`, `52741d2f`, `9fbcecf0`, `b4862b92`, `3bfd5e02`, `1999f7eb`  
> **Aesthetic Philosophy:** Frosted Glassmorphism, Deep Dark Nature, Atmospheric Minimal Focus.

---

## 1. Visual Language & Atmosphere

VibeSpace combines high-contrast dark nature imagery with tactile, frosted glass panels. Every interface element feels weightless, non-intrusive, and translucent, keeping the user immersed in a deep flow state.

- **Background Tone:** Deep slate/emerald forest base (`#0c1512` - `#07100d`) with radial dark vignetting.
- **Surface Elevation:** Frosted glass layers (`backdrop-blur-md` to `backdrop-blur-2xl`) layered with semi-transparent tinted backgrounds (`rgba(24, 33, 30, 0.6)` to `rgba(45, 55, 51, 0.4)`).
- **Light Accents (Specular Rim):** 1px borders with subtle highlight gradients (`border-white/10` to `border-white/15`) and inset specular highlights (`inset 0 1px 0 rgba(255, 255, 255, 0.15)`).
- **Focal Bloom:** Warm Amber glow for Focus state (`#f59e0b` / `#ffc174`) and Soft Cyan/Emerald for Break state (`#4edea3` / `#00a572`).

---

## 2. Color Tokens

### 2.1. Brand & Accents
| Token | Hex Value | Semantic Usage |
| :--- | :--- | :--- |
| `primary` | `#ffc174` | Accent highlight, active state text, focused icons |
| `primary-container`| `#f59e0b` | Focus mode timer ring, start CTA button, amber bloom |
| `secondary` | `#4edea3` | Short break indicator, completed task checkmark, active sound toggle |
| `secondary-container`| `#00a572` | Subtle badge fill, positive status indicators |
| `tertiary` | `#e2cc73` | Warm warning or highlight, subtle glow |

### 2.2. Surfaces & Backgrounds
| Token | Hex Value | CSS Equivalent | Semantic Usage |
| :--- | :--- | :--- | :--- |
| `background` | `#0c1512` | `bg-slate-950` | Primary app canvas backdrop |
| `surface-container-lowest` | `#07100d` | `rgba(7, 16, 13, 0.8)` | Deepest layer (overlay backdrop) |
| `surface-container-low` | `#141d1a` | `rgba(20, 29, 26, 0.5)` | Modal and drawer backgrounds |
| `surface-container` | `#18211e` | `rgba(24, 33, 30, 0.65)` | Standard card and dock surface |
| `surface-container-high`| `#232c28` | `rgba(35, 44, 40, 0.75)` | Interactive button states & chips |
| `surface-container-highest` | `#2d3733` | `rgba(45, 55, 51, 0.85)` | Active inputs, slider tracks |

### 2.3. Text & Borders
| Token | Hex Value | Semantic Usage |
| :--- | :--- | :--- |
| `on-surface` | `#dbe5df` | Primary high-contrast text |
| `on-surface-variant`| `#a08e7a` / `#94a3b8` | Muted descriptions, secondary labels, placeholders |
| `outline` | `#a08e7a` | Subtle icons, divider lines |
| `outline-variant` | `rgba(255, 255, 255, 0.1)` | Specular border rims for glassmorphism |

---

## 3. Typography Scale

Fonts loaded via Google Fonts: `Plus Jakarta Sans` (Display & Headlines) and `Inter` (Body & Tabular numbers).

| Token | Family | Size / Leading | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| `display-timer` | Plus Jakarta Sans | 5rem (80px) / 1.0 | 300 (Light) | Large Pomodoro countdown display |
| `display-zen` | Plus Jakarta Sans | 9rem (144px) / 1.0 | 200 (Extra-Light)| Zen mode center timer |
| `headline-lg` | Plus Jakarta Sans | 2rem (32px) / 2.5rem | 600 (Semi-Bold)| Modal & Drawer titles |
| `headline-md` | Plus Jakarta Sans | 1.25rem (20px) / 1.75rem | 600 (Semi-Bold)| Brand logo, card headers |
| `headline-sm` | Plus Jakarta Sans | 1rem (16px) / 1.5rem | 600 (Semi-Bold)| Section headers, primary button labels |
| `tabular-clock` | Inter | 1rem (16px) / 1.5rem | 500 (Medium) | Real-time header clock (`font-mono` / tabular digits) |
| `body-lg` | Inter | 1.125rem (18px) / 1.75rem | 400 (Regular) | Important descriptions |
| `body-md` | Inter | 0.9375rem (15px) / 1.5rem | 400 (Regular) | Default task titles, sound names |
| `body-sm` | Inter | 0.8125rem (13px) / 1.25rem| 400 (Regular) | Secondary details, timestamps |
| `label-sm` | Inter | 0.75rem (12px) / 1rem | 500 (Medium) | Pill tags, dock item labels, badges |

---

## 4. Glassmorphism & Elevation System

```css
/* Glass Surface Utilities */
.glass-panel {
  background: rgba(24, 33, 30, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.15),
              0 20px 40px -15px rgba(0, 0, 0, 0.5);
}

.glass-dock {
  background: rgba(35, 44, 40, 0.7);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.6),
              inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
}

.amber-bloom {
  filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.5));
}

.cyan-bloom {
  filter: drop-shadow(0 0 10px rgba(78, 222, 163, 0.5));
}
```

---

## 5. Component Specifications

1. **Header Bar:** Fixed top, translucent glass, height 64px, contains Brand with glowing indicator dot, Tabular real-time clock, Master volume trigger, Fullscreen toggle, Settings.
2. **Pomodoro Center:** Concentric SVG progress ring (radius 140px, circumference 879.64px) with smooth linear progress stroke-dashoffset transition, giant light digits (`25:00`), status pill badge, and Play/Pause/Skip/Reset control deck.
3. **Floating Quick Dock:** Fixed bottom (bottom: 24px), centered, pill-shaped, 5 buttons with Material/Lucide symbols and active indicators.
4. **Ambient Soundboard Drawer:** Slide-in from right edge, width 420px, contains Master volume, 5 presets pills, and 10 ambient sound cards with toggle switches and volume sliders.
5. **Lofi Music Widget:** Floating popup card (width 390px) with album art, YouTube link parser, live animated equalizer wave, and quick channel presets.
6. **Daily Todo Drawer:** Slide-in from left edge, width 390px, circular progress ring, quick-add input, task list items with rounded checkboxes and "Daily" badges, and midnight auto-reset indicator.
7. **Wallpaper Selector Modal:** Centered dialog (width 740px), category tabs, 6 preview cards with active selection ring, Overlay Dimmer slider (0-80%), and Background Blur slider (0-20px).
8. **Zen Mode View:** Total uncluttered isolation, hidden header and dock, centered minimalist clock with subtle 2px bottom progress line and ESC key hint.

