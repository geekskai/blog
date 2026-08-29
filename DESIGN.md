---
name: "Geekskai"
description: "Focused browser tools and a local-first audio workspace"
colors:
  midnight-slate: "#020617"
  midnight-gradient: "#0a0f1f"
  panel-slate: "#0f172a"
  border-slate: "#1e293b"
  muted-slate: "#94a3b8"
  text-white: "#ffffff"
  signal-sky: "#0ea5e9"
  workflow-violet: "#7c3aed"
  heritage-pink: "#ec4899"
  heritage-coral: "#ff6b6b"
  success-emerald: "#34d399"
  caution-amber: "#fcd34d"
  error-rose: "#fda4af"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3.5vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "0.14em"
rounded:
  compact: "6px"
  control: "8px"
  action: "12px"
  surface: "16px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
components:
  audio-button-primary:
    backgroundColor: "{colors.signal-sky}"
    textColor: "{colors.text-white}"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
    padding: "0 16px"
    height: "44px"
  auth-button-primary:
    backgroundColor: "{colors.heritage-pink}"
    textColor: "{colors.text-white}"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
    padding: "0 16px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.panel-slate}"
    textColor: "{colors.text-white}"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
    padding: "0 20px"
    height: "44px"
  field:
    backgroundColor: "{colors.panel-slate}"
    textColor: "{colors.text-white}"
    typography: "{typography.body}"
    rounded: "{rounded.action}"
    padding: "0 16px"
    height: "44px"
  status-chip:
    backgroundColor: "{colors.panel-slate}"
    textColor: "{colors.muted-slate}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 10px"
    height: "32px"
  tool-card:
    backgroundColor: "{colors.midnight-slate}"
    textColor: "{colors.text-white}"
    rounded: "{rounded.surface}"
    padding: "20px"
  sticky-navigation:
    backgroundColor: "{colors.midnight-slate}"
    textColor: "{colors.text-white}"
    typography: "{typography.label}"
    height: "64px"
  upload-zone:
    backgroundColor: "{colors.panel-slate}"
    textColor: "{colors.text-white}"
    rounded: "{rounded.action}"
    padding: "16px"
  result-choice:
    backgroundColor: "{colors.panel-slate}"
    textColor: "{colors.text-white}"
    typography: "{typography.body}"
    rounded: "{rounded.action}"
    padding: "12px 16px"
    height: "64px"
  batch-summary:
    backgroundColor: "{colors.midnight-slate}"
    textColor: "{colors.text-white}"
    typography: "{typography.body}"
    rounded: "{rounded.action}"
    padding: "16px"
---

# Design System: Geekskai

## Overview

**Creative North Star: "The Midnight Utility Bench"**

Geekskai should feel like a dependable workbench used at night: dark, focused, and ready for a concrete task. The interface favors precise hierarchy, restrained decoration, and trustworthy status feedback over promotional spectacle.

Depth comes from closely spaced slate surfaces, fine borders, and occasional ambient light. Bright colors behave like instrument signals: sky and violet identify Audio Toolkit workflows, while pink and coral preserve the wider Geekskai identity in authentication, editorial links, and selected brand moments.

The system is compact without becoming cramped. Controls are tactile, rounded, and visibly stateful, but animation and glow remain subordinate to the task.

**Key Characteristics:**

- Midnight slate foundations with layered, translucent work surfaces.
- Signal colors assigned to product meaning rather than used as general decoration.
- Inter-led typography with compact uppercase labels and clear task headlines.
- Mobile-first layouts, 44px action targets, and explicit focus states.
- Fine borders and top-edge highlights before large shadows or ornamental effects.

## Colors

The palette combines a nearly black slate foundation with two intentional signal families and a small set of semantic state colors.

### Primary

- **Signal Sky** (#0ea5e9): The active-work color for Audio Toolkit inputs, processing, focus, progress, and primary task actions.

### Secondary

- **Workflow Violet** (#7c3aed): The companion color for Audio Credits, saved presets, paid workflow affordances, and sky-to-violet task gradients.
- **Heritage Pink** (#ec4899): The wider Geekskai brand accent used by authentication, global focus treatments, and selected calls to action.

### Tertiary

- **Heritage Coral** (#ff6b6b): The established editorial link and typography accent inherited from the original Geekskai theme.
- **Success Emerald** (#34d399): Reserved for completed, available, or healthy states.
- **Caution Amber** (#fcd34d): Reserved for local-storage warnings, delayed states, and recoverable attention.
- **Error Rose** (#fda4af): Reserved for failed work, destructive actions, and blocking validation.

### Neutral

- **Midnight Slate** (#020617): The deepest page and panel foundation.
- **Midnight Gradient** (#0a0f1f): The subtle blue-black transition layer used by the global page background.
- **Panel Slate** (#0f172a): The main field, card, and secondary-control surface.
- **Border Slate** (#1e293b): The default separator and quiet structural outline.
- **Muted Slate** (#94a3b8): Secondary text, icons, helper copy, and inactive states.
- **Text White** (#ffffff): Primary headings, task labels, and high-confidence actions.

### Named Rules

**The Two-Signal Rule.** Use sky and violet for Audio Toolkit work; use pink and coral for global brand, authentication, and editorial emphasis. Do not make all four compete inside one control.

**The Dark Foundation Rule.** New product and tool interfaces start from the midnight slate foundation. Existing light legal pages are isolated reading surfaces, not authority for new tool UI.

**The Semantic Color Rule.** Emerald, amber, and rose communicate state. They are not decorative alternates for primary actions.

### Homepage Text and Signal Roles

| Role                  | Size and weight  | Color                   | Homepage use                                                                                     |
| --------------------- | ---------------- | ----------------------- | ------------------------------------------------------------------------------------------------ |
| Display               | 48–96px, 700     | Text White              | Hero promise only                                                                                |
| Section heading       | 30–36px, 700     | Text White              | SoundCloud and Practical guides headings                                                         |
| Primary content title | 24–30px, 600–700 | Text White              | SoundCloud hub and lead guide                                                                    |
| Secondary title       | 18–24px, 600     | Slate 100               | Tool tasks and supporting guides                                                                 |
| Body                  | 16–18px, 400     | Slate 300               | Hero explanation and important supporting copy                                                   |
| Supporting copy       | 14–16px, 400     | Muted Slate / Slate 400 | Card descriptions, summaries, and helper text                                                    |
| Metadata and label    | 11–14px, 500–600 | Slate 400               | Dates, file details, labels, and placeholders; Slate 500 is decorative only on midnight surfaces |
| Action and focus      | 14–16px, 600     | Signal Sky              | Primary action, text links, caret, focus, and selection                                          |
| Workflow input        | 12–14px, 500–600 | Signal Sky              | Audio input labels and values                                                                    |
| Workflow output       | 12–14px, 500–600 | Workflow Violet         | Target format and processing parameters                                                          |
| Healthy state         | 12–16px, 600     | Success Emerald         | On-device, available, and completed states with an icon or label                                 |
| Editorial category    | 12–14px, 500–600 | Heritage Coral          | Blog tags and editorial wayfinding only                                                          |

Text roles are hierarchical before they are colorful. White identifies certainty, slate establishes reading depth, and signal colors appear only when they explain an action, workflow direction, state, or content category.

## Typography

**Display Font:** Inter (with ui-sans-serif and system fallbacks)

**Body Font:** Inter (with ui-sans-serif and system fallbacks)

**Label/Mono Font:** Inter for labels; the system monospace stack for code, timestamps, and numeric editor values

**Character:** Inter keeps the varied tool portfolio neutral and operational. Weight, scale, and tracking create hierarchy; decorative typefaces are not part of the incumbent system.

### Hierarchy

- **Display** (700, fluid 24–32px, tight tracking): Product and workspace titles that anchor a task surface.
- **Headline** (700, 30px, tight tracking): Major marketing and pricing section statements.
- **Title** (600, 18–20px): Cards, panels, project sections, and dialog headers.
- **Body** (400, 14–16px, 1.5 line height): Instructions, explanations, and readable tool content; long prose stays within a comfortable measure.
- **Label** (600, 11–12px, 0.14em tracking, uppercase): Eyebrows, field groups, queue labels, and compact workflow metadata.

### Named Rules

**The Operational Label Rule.** Uppercase tracking belongs to short navigation and state labels, never paragraphs or long button copy.

**The One-Family Rule.** Use Inter for the interface and reserve monospace for content that benefits from character alignment or code semantics.

## Layout

The global content frame is mobile-first and centered at a maximum width of 1280px. Horizontal page padding begins at 16px, increases to 24px from the small breakpoint, and disappears only when the wide container itself supplies the edge constraint.

Task surfaces stack vertically on phones, become two-column compositions for paired work panels, and use three columns only for comparable choices such as pricing or settings. Repeated internal spacing follows a 4px-based Tailwind rhythm, with 12–16px for control groups and 20–24px for card interiors.

Interactive targets use a minimum height of 44px. Dense metadata chips may use 32–36px when they are not the primary touch action. Layouts should tolerate localized copy and long filenames by wrapping explanatory content and truncating only identity strings that have an adjacent full-context path.

Within a technical workflow, present the user's intended result before exposing raw parameters. Recommended choices occupy the primary reading path; advanced settings remain available in a collapsed secondary section. Reusable settings such as presets and projects use flat, divided rows so their hierarchy stays subordinate to the active tool.

**The Outcome-First Grid Rule.** The active tool or promised result occupies the strongest and widest region; supporting projects, presets, pricing, and explanation follow its hierarchy.

**The Mobile Stack Rule.** Collapse multi-panel layouts into a single reading and interaction order before reducing type or touch targets.

**The Result-Before-Parameters Rule.** Present an outcome-oriented choice before exposing raw technical controls; advanced settings disclose detail without replacing the recommended path.

## Elevation & Depth

Geekskai uses layered depth rather than floating every card. Most surfaces separate through tonal shifts, translucent slate fills, 20–30% borders, and occasional one-pixel top highlights. Shadows are structural: sticky navigation uses an ambient shadow, popovers use a deep overlay shadow, and high-value authentication actions receive a small colored lift.

### Shadow Vocabulary

- **Card Hover** (`0 4px 12px rgba(0, 0, 0, 0.1)`): A restrained lift for legacy hoverable cards; never a default resting shadow.
- **Sticky Chrome** (`0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`): A broad, low-contrast shadow for the global header above scrolling content.
- **Overlay** (`0 25px 50px -12px rgb(0 0 0 / 0.25)`): A deep shadow for popovers, calendars, selectors, and modal-like panels.
- **Auth Signal** (`0 12px 28px -16px rgba(236, 72, 153, 0.94)`): A compact pink ambient shadow under the primary authentication action.
- **Auth Panel** (`0 26px 70px -28px rgba(2, 6, 23, 0.95)`): A large, dark ambient shadow that separates the Clerk panel from the page background.

### Named Rules

**The Layer Before Shadow Rule.** First separate surfaces with value, border, and transparency. Add a shadow only when the element truly sits above the document plane.

**The Single Highlight Rule.** A one-pixel gradient highlight may identify the top edge of an important work panel; do not surround the same surface with multiple glows.

## Shapes

The form language is softly technical rather than playful. Compact editorial cards use 6px corners, navigation and small controls use 8px, primary controls use 12px, and major panels use 16px. Pills are reserved for compact badges, identity marks, and small status groups.

Borders are usually one pixel and low contrast. Dashed borders indicate a drop or empty-input zone. Circular shapes are reserved for icons, status dots, and compact tool handles rather than general containers.

**The Radius Follows Scale Rule.** Increase corner radius with component size: 8px controls, 12px actions and fields, 16px work surfaces.

## Components

Components should feel precise, tactile, and restrained. Every interactive primitive exposes a visible hover, keyboard focus, disabled state when relevant, and motion-reduced behavior.

### Buttons

- **Shape:** Gently rounded actions (12px) with a minimum 44px height.
- **Audio Primary:** Sky-to-violet task gradient or solid sky for a single-workflow action, white semibold text, and modest opacity or color movement on hover.
- **Auth Primary:** Pink-to-fuchsia-to-violet gradient, a fine pink border, and a restrained one-pixel lift.
- **Secondary:** Dark slate surface with a slate border; hover increases both surface and border contrast.
- **Result Choices:** Paired, left-aligned 64px-or-taller controls name the intended outcome first and show supporting technical values second. Sky and violet may distinguish adjacent workflow choices; the selected state uses `aria-pressed` plus a visible border and ring.
- **Hover / Focus:** State changes complete in 200ms; focus uses a two-pixel signal-colored ring and remains visible against the midnight background.

### Chips

- **Style:** Compact 32px-height groups with 8px corners, translucent signal or slate surfaces, fine borders, and 11–12px labels.
- **State:** Color communicates credit, workflow, completion, or warning meaning; chips do not masquerade as primary buttons.

### Cards / Containers

- **Corner Style:** Large work panels use 16px corners; nested items use 12px.
- **Background:** Midnight or panel slate at 30–70% opacity to retain the page's blue-black depth.
- **Shadow Strategy:** Flat by default; use border and top-edge light before shadow.
- **Border:** Slate for neutral structure, or a low-opacity signal border when the entire card belongs to one workflow.
- **Internal Padding:** 20px on compact cards and 24px on larger desktop panels.

### Inputs / Fields

- **Style:** 44px minimum height, 12px corners, dark slate fill, one-pixel slate border, and 12–16px horizontal padding.
- **Focus:** Border shifts to the current workflow signal and gains a soft two-pixel ring.
- **Error / Disabled:** Amber or rose copy accompanies the state; disabled controls reduce opacity without removing labels or context.

### Navigation

- **Style:** Sticky, translucent midnight header with backdrop blur, a quiet slate bottom border, and an ambient shadow.
- **Typography:** Medium or semibold labels; active routes use white text and a narrow signal underline.
- **Responsive:** Desktop navigation gives way to a compact mobile control before labels or touch targets become crowded.

### Upload Zone

The signed-in Audio Toolkit upload zone is a signature operating component: a large dashed 12px container, centered icon, concise file guidance, and explicit on-device reassurance. Hover and focus strengthen the sky border without turning the area into a glowing billboard.

Before authentication, the same structural slot becomes a sign-in gate rather than an active file picker. It keeps the sky workflow signal, explains why sign-in comes first, and uses one clear 44px action so a local selection is never discarded by navigation.

### Batch Summary

Completed and partially completed batches resolve into a compact semantic summary rather than another generic card. An emerald icon and border identify success; counts, consumed Credits, and output format remain plain text. Recovery and continuation actions sit directly below the summary, with retry reserved for failed or canceled items.

### Workspace Setting Rows

Presets and projects use flat rows separated by quiet slate rules. The name and compact technical summary take the flexible column; one 44px action occupies the trailing edge. Presets apply settings directly. Projects open a saved settings snapshot and remain visually explicit that audio is not stored.

## Do's and Don'ts

### Do:

- **Do** begin new tool surfaces with the midnight foundation, layered slate panels, and one workflow signal family.
- **Do** preserve 44px primary targets, visible keyboard focus, and motion-reduced alternatives.
- **Do** use signal colors to explain product state and workflow ownership.
- **Do** favor borders, transparency, and one-pixel highlights before adding shadows.
- **Do** keep helper copy quieter than task labels while maintaining readable contrast.
- **Do** reveal advanced controls after outcome-oriented choices when novices and experts share a tool.
- **Do** place retry, remove, and clear actions next to the queue state they affect, with full touch targets.

### Don't:

- **Don't** turn the system into a generic SaaS marketing template with interchangeable gradient heroes and decorative dashboard metrics.
- **Don't** add neon glow, gradient text, or motion when it does not clarify hierarchy or state.
- **Don't** combine sky, violet, pink, and coral as equal accents in one component.
- **Don't** use success, warning, or error colors for ordinary calls to action.
- **Don't** copy the isolated light legal-page treatment into new tool or workspace interfaces.
- **Don't** present presets and projects as competing dashboard cards when a divided settings list communicates their supporting role.
