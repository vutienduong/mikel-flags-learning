---
name: Junior Navigator
colors:
  surface: '#faf9f8'
  surface-dim: '#dadad9'
  surface-bright: '#faf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f2'
  surface-container: '#eeeeec'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e3e2e1'
  on-surface: '#1a1c1b'
  on-surface-variant: '#3d484e'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#6d797f'
  outline-variant: '#bdc8cf'
  surface-tint: '#006685'
  primary: '#006685'
  on-primary: '#ffffff'
  primary-container: '#2bb6e6'
  on-primary-container: '#004459'
  inverse-primary: '#6ad3ff'
  secondary: '#755b00'
  on-secondary: '#ffffff'
  secondary-container: '#fec700'
  on-secondary-container: '#6e5400'
  tertiary: '#bb1522'
  on-tertiary: '#ffffff'
  tertiary-container: '#ff857e'
  on-tertiary-container: '#820010'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bee9ff'
  primary-fixed-dim: '#6ad3ff'
  on-primary-fixed: '#001f2a'
  on-primary-fixed-variant: '#004d65'
  secondary-fixed: '#ffdf92'
  secondary-fixed-dim: '#f4bf00'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#594400'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ae'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930014'
  background: '#faf9f8'
  on-background: '#1a1c1b'
  surface-variant: '#e3e2e1'
typography:
  headline-xl:
    fontFamily: Lexend
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Lexend
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Lexend
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.5'
  body-md:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Lexend
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base-unit: 8px
  gutter: 16px
  margin-mobile: 24px
  margin-desktop: 48px
  touch-target-min: 56px
---

## Brand & Style

The brand personality is energetic, encouraging, and adventurous. This design system is built for children aged 5-10, focusing on making the educational process of pattern recognition and world geography feel like a rewarding quest. The emotional response should be one of "joyful focus"—minimizing frustration through clear visual cues while maximizing the excitement of discovery.

The visual style is a blend of **Tactile** and **High-Contrast / Bold**. It utilizes thick, "squishy" borders and exaggerated physical metaphors to make the interface feel like a high-quality physical toy. By using deep shadows and bright "plastic" surfaces, the design system creates a world that is tangible, cartoonish, and deeply engaging, similar to the gamified interfaces of Duolingo.

## Colors

The palette is anchored in high-saturation primary and secondary colors to define different functional areas of the game.

- **Sky Blue (Primary):** Used for the main brand elements, backgrounds, and headers to create a calm yet bright environment.
- **Sunny Yellow (Secondary):** Reserved for "Golden Path" actions—highlights, achievements, and main call-to-action buttons.
- **Action Red (Tertiary):** Used for urgent feedback, timers, and "odd one out" indicators.
- **Go Green (Quaternary):** Signifies success, correct answers, and progress completion.

A soft, off-white background (#F0F0F0) is used to prevent eye strain, while deep "shadow" versions of each color are utilized to create the 3D tactile effect on interactive elements.

## Typography

This design system utilizes **Lexend** exclusively. Chosen for its specific design intent to improve reading proficiency, its hyper-legible, open letterforms are perfect for young learners.

Headlines should use the Bold or ExtraBold weights to feel friendly and impactful. Body text remains generous in size (never below 16px) to ensure accessibility on tablets and desktops alike. To maintain the playful character, all caps are used sparingly for labels and buttons to give them a "stamp-like" appearance.

## Layout & Spacing

The layout follows a **Fixed Grid** model centered on the screen, creating a focused "game board" area. This contains the cognitive load by keeping the interactive elements within a predictable field of vision.

The spacing rhythm is chunky and generous. We use an 8px base unit, but most interactive elements are separated by at least 24px to prevent "fat-finger" errors on touch devices. The game grid for the flags should be fluid within its container, automatically adjusting the number of columns to keep the flags large and easy to distinguish.

## Elevation & Depth

Hierarchy is achieved through **Tactile Layering**. This design system avoids blurry, realistic shadows in favor of "Block Shadows"—solid, darker offsets of the base color.

- **Level 0 (Floor):** The main background.
- **Level 1 (Card):** White containers with a 4px solid grey bottom border.
- **Level 2 (Interactive):** Buttons and flags with a 6px solid bottom border in a darker shade of the element’s color.
- **Level 3 (Pressed):** When clicked, the element shifts down by 4px, and the bottom border shrinks, simulating a physical button press.

## Shapes

The shape language is defined by "Squishy Geometry." Every corner is rounded to remove "sharpness" and make the UI feel safe and friendly.

Standard components use a **16px (1rem)** radius. Large game containers and the main game board use a **24px (1.5rem)** radius. Progress bars and badges use a **Pill-shape** (fully rounded) to contrast against the more rectangular flags and cards.

## Components

### Buttons
Buttons are the primary interaction point. They feature a 3D effect with a thick bottom border. The text is always centered and set in **label-bold**. 
- **Primary:** Yellow with a Golden-Brown base.
- **Secondary:** White with a Light-Grey base.

### Flags & Game Tiles
Flags are presented in "Tiles." Each tile has a subtle white inner glow and a 2px stroke. When a user hovers or selects a tile, a thick blue border appears around it.

### Progress Indicators
The "Timer" is a circular ring that depletes clockwise. The "Level Tracker" is a horizontal bar using the Go Green color, filling a light grey track. Use "pop" animations when the progress bar increases.

### Friendly Icons
Icons should use "Super-Bold" strokes (3px or higher) with rounded ends. They should be monochromatic, matching the color of the button or label they accompany.

### Feedback Toasts
When a child finds the "Odd Flag," a large, centered modal appears with a cartoonish star and the text "GREAT JOB!" in **headline-xl**. These should use a slight "bounce" entry animation.