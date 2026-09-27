---
name: Gabriel Fuli portfolio
description: Dark personal portfolio with code-inspired motion
colors:
  background: "#000000"
  foreground: "#ffffff"
  muted: "#8e8e8e"
  body-text: "#d0d0d0"
  dark-pill: "#28282a"
  pill-text: "#c8c8c8"
  nav-text: "#d0d0d0"
  linkedin: "#0a66c2"
  github: "#000000"
  header-glass: "rgba(19, 21, 23, 0.72)"
  menu-glass: "rgba(19, 21, 23, 0.92)"
  header-rim: "rgba(255, 255, 255, 0.2)"
typography:
  display:
    fontFamily: "BubbledotICG-FinePos, Geist Pixel Circle, monospace"
    fontSize: "clamp(50px, 10vw, 110px)"
    fontWeight: 400
    lineHeight: 1.02
  body:
    fontFamily: "Inter, Segoe UI, system-ui, sans-serif"
    fontSize: "16.5px"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  pill: "999px"
  circle: "50%"
spacing:
  compact: "8px"
  base: "16px"
  section: "clamp(56px, 9vh, 104px)"
components:
  primary-action:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.background}"
    rounded: "{rounded.pill}"
    padding: "clamp(11px, 1.6vh, 13px) clamp(22px, 3vw, 28px)"
  dark-action:
    backgroundColor: "{colors.dark-pill}"
    textColor: "{colors.pill-text}"
    rounded: "{rounded.pill}"
    height: "clamp(44px, 5.2vw, 48px)"
  navigation:
    backgroundColor: "transparent"
    textColor: "{colors.nav-text}"
    rounded: "{rounded.pill}"
    padding: "4px 8px"
  header-shell:
    backgroundColor: "{colors.header-glass}"
    borderColor: "{colors.header-rim}"
    rounded: "{rounded.pill}"
    backdropBlur: "18px"
---

# Design System: Gabriel Fuli portfolio

## Overview

**Creative North Star: "Terminal noturno" (provisional description of the current site).**

White content sits on black. The matrix animation adds a restrained code reference behind the hero. The charcoal glass header groups its controls on one surface; the main action carries the strongest contrast. Small edits preserve this identity.

## Colors

Black (`#000000`) owns the page. White (`#ffffff`) carries headings, the main action and active navigation labels. Body copy and header links use `#d0d0d0`; `#8e8e8e` is for quiet metadata. Dark pills use `#28282a` and `#c8c8c8`. Social buttons use their platform backgrounds: LinkedIn blue (`#0a66c2`) and GitHub black (`#000000`). The hero's live matrix uses soft green glyphs.

## Typography

BubbledotICG-FinePos, with Geist Pixel Circle and monospace fallbacks, is the display face. Gabriel Fuli is the largest text at `clamp(50px, 10vw, 110px)`. Section headings use the same face at smaller sizes. Inter and system sans are for body and controls. Body text is 16.5px with 1.65 line-height and a 68ch maximum measure.

## Layout

The first viewport centers the trust badge, name, introduction, action and statistics. The content below has a 1040px maximum width and a title/content grid. Sections stack at 860px; the navigation becomes a menu and statistics form two columns at 720px. Section spacing uses `clamp(56px, 9vh, 104px)`.

## Elevation & Depth

The page is flat black. Floating navigation sits inside a charcoal glass shell with a thin white rim and a soft shadow. The primary action glows white. Translucent rules divide long sections. Code-generated matrix rain has no loop seam.

## Shapes

Pills use 999px radius. Logo, language controls and icon links are circular. The mobile menu is a rounded white panel. Thin rules and square timeline markers balance the rounded controls.

## Components

### Primary action

White pill with black text and soft glow. Hover lifts and strengthens the glow; active presses inward. Keyboard focus has a visible 2px outline.

### Dark action

Charcoal pill with light text. Hover brightens and raises it; active scales down. The LinkedIn variant uses its own blue.

### Navigation

The charcoal glass shell groups the header controls. Desktop navigation has no separate capsule; quiet light links gain a translucent gray active state. The logo is transparent with a white mark. LinkedIn and GitHub buttons keep their solid platform backgrounds on desktop and mobile; they lift by 2–3px and press back down without changing those colors. The language pair sits inside one outlined capsule, while PT and EN remain separate controls with a gray pressed state. The mobile menu uses a more opaque version of the same glass so page content stays behind readable links. Keyboard focus remains visible and header motion is reduced when the visitor requests reduced motion.

### Hero

Trust badge, name, introduction, action and statistics form a centered composition. The name remains the focal point; decorative rain stays behind readable content.

## Do's and Don'ts

### Do

- Preserve black and white contrast, with color used sparingly.
- Keep Portuguese and English controls available on desktop and mobile.
- Check both desktop and mobile layouts after visual edits.

### Don't

- Add a looping video background.
- Let decorative type outrank the owner's name.
- Invent endorsements or factual claims.
