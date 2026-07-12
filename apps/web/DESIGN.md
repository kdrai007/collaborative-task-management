# Design System Specification: The Collaborative Canvas

## 1. Overview & Creative North Star
### The Creative North Star: "The Fluid Studio"
The objective of this design system is to move away from the rigid, "boxed-in" feel of traditional project management tools. We are building a "Fluid Studio"—an environment that feels like a shared digital desk where ideas flow without friction. 

To achieve this, we reject the standard "admin dashboard" aesthetic. Instead, we utilize **Editorial Asymmetry** and **Tonal Depth**. By leveraging expansive whitespace (the "Canvas") and overlapping surfaces, we create a sense of momentum. The system feels premium not because of what we add, but because of what we omit: unnecessary borders, harsh dividers, and cluttered grids.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a sophisticated "Deep Indigo" (`primary: #3525cd`) that acts as the pulse of the system.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define major sections. Structural boundaries must be established via **Background Shifts**. 
*   *Application:* A sidebar (`surface_container_low`) should sit against the main workspace (`surface`) without a stroke. The change in tone is the boundary.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of materials. 
*   **Base:** `surface` (#f8f9ff) – The floor of the application.
*   **Level 1:** `surface_container_low` (#eff4ff) – Used for large structural areas like sidebars.
*   **Level 2:** `surface_container` (#e5eeff) – Used for the primary workspace or "Board."
*   **Level 3:** `surface_container_highest` (#d3e4fe) – Reserved for active task cards or floating modals.

### The "Glass & Gradient" Rule
To inject "soul" into the professional layout:
*   **Floating Navigation:** Use a glassmorphic effect (`surface_container_lowest` at 80% opacity) with a `backdrop-filter: blur(20px)`.
*   **The Pulse Gradient:** For primary CTAs and progress indicators, use a linear gradient from `primary` (#3525cd) to `primary_container` (#4f46e5) at a 135-degree angle.

---

## 3. Typography
We employ a dual-font strategy to balance character with utility.

*   **Display & Headlines (Manrope):** Chosen for its geometric precision and modern "editorial" feel. 
    *   *Usage:* Use `display-lg` (3.5rem) for high-level project titles to create an authoritative, magazine-like header.
*   **Functional UI (Inter):** Chosen for its exceptional legibility at small sizes.
    *   *Usage:* Use `body-md` (0.875rem) for task descriptions and `label-sm` (0.6875rem) for metadata.

**The Hierarchy Rule:** Always skip a weight or size in the scale when transitioning between sections to ensure a "High-Contrast" hierarchy that guides the eye instantly.

---

## 4. Elevation & Depth
In this design system, depth is a tool for focus, not just decoration.

### The Layering Principle
Rather than shadows, use the **Spacing Scale** combined with Tonal Layering. 
*   *The Stack:* A `surface_container_lowest` card placed on a `surface_container_low` background creates a natural, soft lift.

### Ambient Shadows
Shadows are reserved only for "Active" or "Floating" elements (e.g., a dragged task card).
*   **Value:** `0px 20px 40px rgba(11, 28, 48, 0.06)`. 
*   **Color Tinting:** Shadows must never be pure grey. Use a 4-8% opacity tint of `on_surface` (#0b1c30) to ensure the shadow feels like a natural extension of the UI.

### The "Ghost Border" Fallback
If a container requires a border for accessibility (e.g., in Dark Mode), use a **Ghost Border**: `outline_variant` at 15% opacity. Never use 100% opaque lines.

---

## 5. Components

### Buttons
*   **Primary:** Pulse Gradient (Primary to Primary-Container), `rounded-md` (0.75rem), white text.
*   **Secondary:** `surface_container_high` background with `on_surface` text. No border.
*   **Tertiary:** Ghost style. No background/border until hover, then `surface_container_low`.

### Task Cards & Lists
*   **Constraint:** No dividers. Use `spacing-4` (1.4rem) as a vertical gutter between list items.
*   **Visual Shift:** On hover, a card should transition from `surface_container_lowest` to `surface_container` to indicate interactivity.

### Avatar Stacks (Collaborative Focus)
*   **Styling:** Circular (`rounded-full`), with a 2px "Ghost Border" matching the background color to create a clean "cutout" effect between overlapping users.
*   **Presence:** Use `tertiary` (#004d70) for active presence indicators.

### Status Badges
*   **Form:** `rounded-full` with high-padding horizontal (`spacing-2.5`).
*   **Coloration:** Use low-saturation background tints (e.g., `error_container`) with high-saturation text (`on_error_container`) for a modern, soft-vibrant look.

### Collaborative Input Fields
*   **Styling:** `surface_container_low` background, `rounded-DEFAULT`. 
*   **Focus State:** Instead of a thick border, use a 2px `primary` glow and shift the background to `surface_container_lowest`.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical margins. For example, give a right-hand sidebar more breathing room (`spacing-10`) than the left to create a unique visual rhythm.
*   **Do** lean into `surface_bright` for Dark Mode accents to avoid a flat, "muddy" appearance.
*   **Do** use `spacing-20` or `spacing-24` for hero sections to create a sense of premium "luxury space."

### Don't
*   **Don't** use 1px solid dividers (e.g., `<hr>`). Use a `0.35rem` gap or a tonal shift instead.
*   **Don't** use pure black (#000) for Dark Mode. Use `surface` (#0b1c30) for the background to maintain a soft, navy-charcoal sophistication, and ensure elevated elements like cards become progressively lighter.
*   **Don't** use "Drop Shadows" on flat buttons. Only use shadows for elements that truly "hover" over the main canvas.