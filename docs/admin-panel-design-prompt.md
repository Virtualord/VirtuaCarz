---
title: VirtuaCarz Editorial Design System
aliases:
  - VirtuaCarz design prompt
  - Mistral-inspired editorial UI
  - Admin panel design prompt
tags:
  - design-system
  - prompt
  - virtuacarz
  - frontend
  - obsidian
created: 2026-11-05
status: active
---

# VirtuaCarz Editorial Design System

> [!info] What this note is
> A reusable design prompt and implementation reference for the VirtuaCarz editorial interface. It captures the visual language used in the admin panel and the client app so future pages, tools, or AI-assisted redesigns stay in the same system.
>
> **How to use it:** copy the [[#Master prompt|Master prompt]] into an AI coding agent, fill in the `[[placeholders]]`, and attach the relevant page/component files. Keep [[#2. Non-negotiables]] and [[#12. QA checklist]] in the prompt as hard constraints.

> [!tip] One-line summary
> Warm paper, sharp ink, one orange accent, oversized display type, hairline structure, and asymmetric editorial layouts — never a generic SaaS dashboard.

---

## 1. Design intent

The interface should feel like a well-set print magazine that happens to be interactive:

- **Warm and quiet.** Cream paper backgrounds, ink-black type, no visual noise.
- **Typographic first.** Hierarchy comes from scale, weight, and spacing — not from cards, gradients, or color blocks.
- **Structurally honest.** Hairline rules, aligned baselines, visible grids, and clear sections.
- **Asymmetric, not chaotic.** Strong left-aligned headlines, offset sidebars, and deliberate negative space.
- **One accent.** A single orange is used for emphasis, periods, eyebrows, active states, and primary actions.
- **Restrained motion.** Fades and soft rises in the spirit of a page settling, never a circus.

The reference point is Mistral-style editorial web design: confident display headlines, cream backgrounds, small uppercase labels, thin rules, and orange punctuation. Do not copy Mistral brand assets, logos, or copy — borrow only the compositional discipline.

---

## 2. Non-negotiables

### Always

- Cream background (`#FBFBF8`) with ink text (`#18181B`).
- Figtree for all UI and display type.
- Oversized headlines: tight tracking, short leading, sentence case, orange full stop.
- Hairline borders (`1px #E5E5E5`) to structure sections, grids, lists, tables, and modals.
- Small uppercase eyebrows with a short orange rule.
- Asymmetric multi-column layouts on desktop.
- Generous vertical rhythm: `py-16` on mobile, `py-24` on desktop for major sections.
- Mobile-first responsive checks at **375px**, **768px**, and **1440px**.
- Real content hierarchy: headline → supporting copy → action.
- Visible keyboard focus states and `prefers-reduced-motion` support.

### Never

- Large rounded corners. Keep radii at `0` or `6px` (`rounded-md`) maximum.
- Heavy drop shadows, floating cards, or layered elevation.
- Gradients as page backgrounds or decorative washes.
- Glassmorphism, frosted panels, or translucent header chrome.
- Purple/blue SaaS gradients, neon glows, or gradient text.
- Generic card grids where a hairline list or table would be clearer.
- Icon soup, emoji as UI icons, or decorative icon tiles without meaning.
- Center-aligned everything. Center alignment is reserved for small empty states and short utility blocks.
- Lorem ipsum or placeholder marketing copy in shipped UI.
- Page-level horizontal scrolling at any supported width.

---

## 3. Design tokens

```css
@theme {
  /* Surfaces */
  --color-cream: #fbfbf8;
  --color-cream-dark: #f5f4ef;
  --color-cream-deep: #f0eee6;

  /* Type */
  --color-ink: #18181b;
  --color-ink-soft: #737373;
  --color-ink-inverse: #fafafa;

  /* Accent */
  --color-accent: #fa520f;
  --color-accent-deep: #d94400;

  /* Structure */
  --color-line: #e5e5e5;

  /* Type families */
  --font-sans: "Figtree", ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-display: "Figtree", ui-sans-serif, system-ui, -apple-system, sans-serif;

  /* Motion */
  --ease-editorial: cubic-bezier(0.22, 1, 0.36, 1);
}
```

### Color usage

| Token | Hex | Use |
| --- | --- | --- |
| `cream` | `#FBFBF8` | Default page background |
| `cream-dark` | `#F5F4EF` | Alternate sections, footer, sidebars |
| `cream-deep` | `#F0EEE6` | Image placeholders, subtle inset areas |
| `ink` | `#18181B` | Headlines, body, primary buttons, dark CTA |
| `ink-soft` | `#737373` | Body copy, metadata, secondary labels |
| `accent` | `#FA520F` | Orange periods, eyebrows, active states, primary CTA |
| `accent-deep` | `#D94400` | Accent hover only |
| `line` | `#E5E5E5` | Hairline borders and dividers |

Status colors are the only exception to the palette, and only for small dots/labels:

- Success / confirmed / available: `emerald-500` dot, `emerald-700` text.
- Waiting / pending: `amber-500` dot, `amber-700` text.
- Danger / cancelled: `red-500` dot, `red-700` text.

Never use status colors as large fills.

---

## 4. Typography

**Family:** Figtree, weights 300–900. Use 400 for body, 500–600 for UI labels, 700–800 for display.

### Display headlines

- Sentence case. Short. Usually two or three lines.
- Weight 700.
- Tracking `-0.04em` to `-0.055em`.
- Leading `0.90` to `0.98`.
- End the headline with an orange period: `<span className="text-accent">.</span>`.
- Never put a period on every heading — reserve it for the main page or section statement.

Responsive display scale:

| Context | Mobile 375 | Tablet 768 | Desktop 1440 |
| --- | --- | --- | --- |
| Hero / page title | `3.25–3.5rem` | `4–5rem` | `5–7rem` |
| Section heading | `2.25–2.5rem` | `3–3.5rem` | `3–3.75rem` |
| Subsection heading | `1.5–2rem` | `2rem` | `2–2.5rem` |

### Eyebrow

```jsx
<div className="flex items-center gap-3">
  <span className="h-px w-10 bg-accent" aria-hidden="true" />
  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
    Section label
  </p>
</div>
```

- 10–11px, 700, uppercase, tracking `0.22em–0.3em`.
- Orange text with a 40px orange rule.
- Use once per section, never as a decorative label on every card.

### Body and UI

- Body: 14–16px, line-height 1.6, `text-ink-soft`.
- Lead paragraph: 16–18px, max width `36–42ch`.
- Small labels: 9–11px, 600–700, uppercase, tracking `0.14em–0.2em`.
- Mono metadata: `font-mono` at 9–10px, tracking `0.12em–0.16em`, for counts, indexes, and dates only.
- Buttons: 12–14px, 700, tight tracking.

### Voice

- Direct, calm, specific. Short sentences.
- Prefer concrete promises: “Zero security deposit.” “Doorstep delivery.” “24/7 support.”
- Avoid hype, exclamation marks, “revolutionary”, “seamless”, “unlock the power of”.
- Headlines can be poetic; supporting copy should be plain.

---

## 5. Layout system

### Page shell

```jsx
<section className="bg-cream">
  <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
    {/* PageHeader */}
    {/* content */}
  </div>
</section>
```

- Container: `max-w-7xl` (80rem), horizontal padding `px-4 sm:px-6 lg:px-8`.
- Major sections: `py-16 sm:py-24`.
- Alternate section background between `cream` and `cream-dark` using `border-y border-line` or `border-b border-line`.
- Avoid nested cards. Use rules and spacing to group content.

### Asymmetric grids

Use 12 columns and deliberately unequal splits:

- Editorial hero: `lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]`
- Text + list: `lg:grid-cols-12`, text `lg:col-span-4`, list `lg:col-span-8`
- Content + sidebar: `lg:grid-cols-[minmax(0,1fr)_320px]`
- Media + detail: `lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]`
- Stack on mobile; keep gutters `gap-10`–`gap-16`.

### Hairline structure

- Sections: `border-b border-line`.
- Lists and rows: `border-t border-line` on each row, `border-b` on the wrapper.
- Sidebars: `lg:border-l lg:border-t-0 lg:pl-10`.
- Stat grids: `grid gap-px bg-line border-y border-line`, with cells `bg-cream` or `bg-cream-dark`.
- Inputs: 1px border, square or `rounded-md`, no inner shadow.
- Tables: header row with 10px uppercase labels, body rows separated by hairlines, hover `bg-cream-dark/40`.

### Whitespace

- Prefer more space than feels necessary between sections.
- Keep headings away from borders; use `mt-5`–`mt-7` after eyebrows.
- Let images breathe; avoid text wrapping around media.
- On desktop, align actions to the baseline of the heading or the bottom of the row.

---

## 6. Component recipes

### Header

- 64px tall, solid `bg-cream`, `border-b border-line`, sticky.
- Brand at left: 32–40px orange square with a car icon and `VirtuaCarz` wordmark; “Carz” in accent.
- Desktop nav centered or right-aligned: 12–13px semibold, quiet gray, active item ink with a 1px orange underline.
- Account: bordered control with initial avatar, truncated name, chevron, and a dropdown panel.
- Dropdown: `max-w-60`, `bg-white`, `border border-line`, small restrained shadow, hairline sections, 12px items.
- Mobile: left drawer, solid `bg-cream-dark`, hairline nav rows, account summary card, backdrop `bg-ink/30` without blur.
- No translucent sticky chrome.

### Page header

Use a shared component:

```jsx
<PageHeader
  eyebrow="Our collection"
  title={<>The fleet<span className="text-accent">.</span></>}
  description="One sentence of concrete supporting copy."
  aside={<div className="sm:text-right">…count or primary action…</div>}
  backTo="/cars"
  backLabel="Back to fleet"
/>
```

Structure:

1. Optional back link, 10px uppercase with arrow.
2. Orange eyebrow.
3. Oversized title with orange period.
4. Description, max `xl`.
5. Optional aside aligned to the bottom on desktop.

Bottom border `border-b border-line`, generous bottom padding.

### Buttons

Three variants only:

- **Primary:** ink background, cream text; hover to accent.
- **Accent:** orange background, white text; hover to deep orange.
- **Outline:** transparent with hairline border; hover to ink fill.

Rules:

- `rounded-md`, 700 weight, 12–14px.
- Padding `px-4 py-2.5` (sm) to `px-6 py-3.5` (lg).
- `transition-all duration-300 ease-editorial`, `active:scale-[0.99]`.
- `focus-visible:ring-2 ring-accent ring-offset-2 ring-offset-cream`.
- No glow shadows. A restrained accent shadow is acceptable on a dark section, but keep it optional.
- Text links use an ink bottom border that turns orange on hover; pair with a small arrow that slides 2–4px.

### Cards and media

- Image wrapper: `border border-line`, `bg-cream-deep`, no radius or `rounded-md`.
- Use `aspect-[4/3]`, `aspect-[16/10]`, or a deliberate portrait ratio.
- Image hover: `scale-[1.03]` over 700ms with editorial easing.
- Text sits below the image, separated by a hairline — not inside a floating card.
- Title 18–24px, 600–700; metadata 10px uppercase; price in display weight.
- On hover: title turns accent, arrow nudges right.
- Never put image, title, copy, metadata, and CTA inside a padded white rounded card with a shadow.

### Lists and tables

Desktop:

- Hairline table, no zebra striping.
- Uppercase 10px column headers.
- Body 13–14px; primary cell semibold ink, secondary cell `ink-soft`.
- Row actions right-aligned text buttons.
- Row hover only changes background to `cream-dark/40`.

Mobile (< `lg`):

- Convert each row into a stacked block with a top hairline.
- Keep vehicle name and status on the first line.
- Dates on the second line.
- Price and actions on a bottom hairline row.

### Forms

- Label: 9–10px, 700, uppercase, tracking `0.16em`, `ink-soft`.
- Input: full width, `border border-line`, `bg-white` or transparent, `px-3.5 py-2.5`, 13–14px, 500.
- Focus: `border-ink`, no glow. A subtle `ring-1 ring-ink/10` is acceptable.
- Placeholder: `ink-soft/70`.
- Group fields with `space-y-5`.
- Inline help: 11px, `ink-soft`, max two lines.
- Error: left border `border-red-500` plus tinted background `bg-red-500/5`; no large red cards.

### Modals

- Overlay: solid `bg-ink/60`, no blur.
- Panel: `bg-cream`, `border border-line`, `max-w-md`–`max-w-lg`, `max-h-[92vh]`, scroll inside.
- Header: orange eyebrow, display title with orange period, small square close button with hairline border.
- Body: hairline sections, uppercase labels, ledger-style rows.
- Totals: 24–28px display weight.
- Footer: hairline top border, outline cancel + accent confirm, stacked on mobile.
- Close on Escape and overlay click. Lock background scroll when open.
- Never use `rounded-2xl`, `shadow-2xl`, or translucent frosted panels.

### Badges and status

- Tiny 9–10px uppercase labels, optional 1.5px dot.
- Border or transparent background; avoid saturated fills.
- Status labels stay near the content they describe.
- Availability: emerald dot for available, orange dot for booked out.

### Empty states

- Centered, hairline-bounded block with generous padding.
- Small accent icon, display headline, one short paragraph, one action.
- No illustration blobs or cartoon mascots unless the brand explicitly adopts them.

### Footer

- `bg-cream-dark`, top hairline.
- Brand block with a large display statement and orange period.
- Two to three link columns with 10px uppercase headings and 14px links.
- Bottom row separated by a hairline with copyright and credit.
- Keep the footer quiet; no newsletter card unless it is a real product feature.

### Auth screens

- Full-screen split: dark editorial panel on the left, cream form panel on the right.
- Left panel: ink background, technical dot field, subtle orange glow, brand, oversized statement, three-word values, bottom meta rule.
- Right panel: centered form, max width 400–440px, orange eyebrow, display title, hairline inputs, accent CTA.
- On mobile, hide the dark panel and show a compact brand lockup above the form.
- Keep the auth screen free of the global header and footer.
- Do not add fake SSO or non-functional controls unless the product supports them.

---

## 7. Motion

- Primary easing: `cubic-bezier(0.22, 1, 0.36, 1)` (`ease-editorial`).
- Section reveals: opacity 0→1 plus `y: 18–28px→0`, 0.6–0.9s.
- Stagger children by 0.05–0.10s, never more than 0.4s total.
- Page transitions: fade plus a small 10–14px vertical shift, 0.3–0.55s.
- Image hover: scale to 1.03–1.05 over 700ms.
- Underline/arrow hover: 200–300ms.
- Accordions: height auto with opacity, 250–350ms.
- Respect `prefers-reduced-motion`; disable transforms and shorten durations.
- No bounce, spring, parallax, spinning badges, or looping decorative animation.

---

## 8. Responsive rules

### 375px (mobile)

- Single column everywhere.
- Page padding `px-4`.
- Hero title `3.25–3.5rem`; avoid orphan words by using explicit line breaks.
- Header shows logo, menu button, and account/sign-up control.
- Nav moves into a left drawer.
- Filters wrap into rows with horizontal gaps; search and sort become full-width or stacked.
- Tables become stacked blocks.
- Modals fill most of the viewport with `max-h-[92vh]` and internal scrolling.
- Check long emails, URLs, and car names for overflow; use `break-all` or `truncate` deliberately.
- No element may extend past `100vw`.

### 768px (tablet)

- Two-column content where useful.
- Hero title `4–5rem`.
- Header still uses the mobile drawer until `lg`.
- Data tables may remain stacked until `lg`.
- Fleet rows can show image left, text right (`md:grid-cols-...`).
- Keep section padding generous; don’t compress whitespace to fit more.

### 1440px (desktop)

- Container `max-w-7xl`, centered.
- Full desktop nav visible at `lg`.
- Use asymmetric 4/8, 5/7, or 1.15/0.85 splits.
- Sidebars with a left hairline and `pl-10`.
- Display headlines can reach 6–7rem on hero surfaces.
- Ensure row content aligns to a shared baseline; avoid centered vertical stacks in wide rows.

---

## 9. Accessibility

- Maintain at least 4.5:1 contrast for body text; `ink-soft` on cream passes for secondary text.
- Every icon-only button needs an `aria-label`.
- Use real `<button>`, `<a>`, `<label>`, `<table>`, and heading order.
- Focus states must be visible on cream and dark surfaces.
- Modals: `role="dialog"`, `aria-modal="true"`, Escape to close, overlay click to close, focusable close button.
- Accordions: `aria-expanded` on the trigger.
- Touch targets at least 40×40px where possible.
- Motion must respect `prefers-reduced-motion`.
- Do not convey status by color alone; pair dots with text.

---

## 10. Implementation constraints

- React + Tailwind CSS v4 (`@theme` tokens in `index.css`).
- Figtree loaded from Google Fonts; Font Awesome for icons.
- Framer Motion for reveals, page transitions, drawers, and accordions.
- Keep existing routing, Redux state, API calls, auth, and form behavior intact. A redesign is a visual and structural pass, not a feature rewrite.
- Centralize image resolution:
  - HTTP/data URI → use as-is.
  - Raw base64 → prefix with `data:image/jpeg;base64,`.
- Prefer existing shared primitives (`Button`, `Eyebrow`, `PageHeader`, `SectionHeading`, `Reveal`, `CarCard`) over one-off styles.
- No new UI libraries, CSS frameworks, or icon packs.
- No layout shift: reserve image aspect ratios and avoid absolute positioning for primary content.
- Run a production build after changes.

---

## 11. Anti-patterns

> [!warning] These instantly break the system
> - Rounded-2xl white cards on a cream page.
> - Colored gradient hero backgrounds.
> - Blurred glass headers and frosted modals.
> - Multiple accent colors.
> - Big shadows on every element.
> - Centered hero copy with three generic feature cards underneath.
> - 12px body text with 20px headings.
> - Icons inside colored circles above every section.
> - “Lorem ipsum” or vague AI marketing copy.
> - Desktop-only layouts squeezed into mobile.
> - Text touching the viewport edge.
> - Buttons with no hover, focus, or active state.

---

## 12. QA checklist

Before calling a page finished:

- [ ] Palette matches tokens; no off-brand colors.
- [ ] Figtree loaded; display tracking and leading are tight.
- [ ] The main headline has an orange period and no awkward orphan word.
- [ ] Eyebrows use a hairline rule and uppercase tracking.
- [ ] Sections alternate surfaces with hairline separators.
- [ ] At least one asymmetric layout on desktop.
- [ ] No rounded-2xl cards, heavy shadows, gradients, or glass panels.
- [ ] Images have borders, fixed aspect ratios, and hover scale.
- [ ] Tables stack below `lg`.
- [ ] Forms have visible labels and focus states.
- [ ] Modals close on Escape and overlay click; background is locked.
- [ ] Auth screens hide the global header and footer.
- [ ] No page-level horizontal overflow at 375, 768, and 1440.
- [ ] Long names, emails, URLs, and prices do not break layout.
- [ ] All interactive elements have hover/focus/active states.
- [ ] `prefers-reduced-motion` is respected.
- [ ] `npm run build` succeeds.
- [ ] Key flows still work: navigation, search/filter, booking, profile update, booking update.

---

## 13. Master prompt

Copy this into an AI coding agent. Replace `[[bracketed]]` values, attach the relevant files, and keep the constraints verbatim.

```text
You are a senior product designer and frontend engineer. Redesign [[APP / PAGE NAME]] for VirtuaCarz.

GOAL
Make it feel like a refined editorial magazine, not a generic SaaS dashboard. Preserve every existing route, API call, Redux action, auth flow, and interaction. This is a design pass, not a feature rewrite.

VISUAL SYSTEM
- Palette: cream #FBFBF8, cream-dark #F5F4EF, cream-deep #F0EEE6, ink #18181B, ink-soft #737373, accent #FA520F, accent-deep #D94400, line #E5E5E5. Status colors only for small dots/labels.
- Type: Figtree. Display 700 weight, tracking -0.04em to -0.055em, leading 0.90–0.98. Body 14–16px, line-height 1.6. Eyebrows 10–11px uppercase, tracking 0.22–0.3em, with a 40px orange rule.
- Headlines: sentence case, two or three lines, ending in an orange period. Mobile 3.25–3.5rem, tablet 4–5rem, desktop 5–7rem.
- Structure: max-w-7xl container, px-4 sm:px-6 lg:px-8, py-16 sm:py-24 sections. Alternate cream and cream-dark surfaces separated by hairline borders. Use asymmetric 4/8, 5/7, or 1.15/0.85 splits. Sidebars use lg:border-l and lg:pl-10.
- Motion: cubic-bezier(0.22, 1, 0.36, 1). Reveal 0.6–0.9s with y 18–28px, stagger 0.05–0.1s. Hover image scale 1.03. Respect prefers-reduced-motion.

COMPONENTS
- Buttons: ink primary, orange accent, hairline outline. rounded-md, 700 weight, px-4–6 py-2.5–3.5, visible focus ring, active scale 0.99.
- Cards: image in a hairline border with fixed aspect ratio, text below separated by hairlines. No floating white cards, no heavy shadows.
- Tables: hairline desktop table with 10px uppercase headers; convert to stacked blocks below lg.
- Forms: 9–10px uppercase labels; bordered white inputs; focus changes border to ink, no glow.
- Modals: solid bg-ink/60 overlay without blur; cream panel with hairline border; eyebrow, display title with orange period, ledger rows, outline cancel + accent confirm.
- Header: solid cream, border-b, 64px, brand mark, desktop nav with orange active underline, account dropdown, mobile left drawer with dim backdrop.
- Page header: optional back link, eyebrow, oversized title, description, optional aside, bottom hairline.
- Footer: cream-dark, large display statement, link columns, bottom rule.

HARD CONSTRAINTS
- No border radius above 6px. No shadows beyond a faint dropdown shadow. No gradients as backgrounds. No glassmorphism or backdrop blur. No purple/blue SaaS colors. No generic feature-card grids. No centered-everything layouts. No lorem ipsum.
- Ensure no page-level horizontal overflow at 375, 768, and 1440.
- Mobile: single column, drawer nav, stacked tables, full-width controls.
- Tablet: two-column where useful; drawer nav until lg.
- Desktop: full nav, asymmetric layouts, aligned baselines.
- Accessibility: labels, aria-labels for icon buttons, visible focus, Escape/overlay modal close, aria-expanded accordions, reduced motion.
- Keep image resolution centralized (HTTP/data URI as-is; raw base64 prefixed with data:image/jpeg;base64,).
- Reuse shared primitives where they exist. Do not add UI libraries.

CONTENT
Rewrite any placeholder copy into direct, warm, specific brand copy. Short sentences. Concrete promises. No hype.

PROCESS
1. Audit the current page and list every behavior to preserve.
2. Propose the section order and asymmetric layout.
3. Implement the shared primitives first, then the page sections, then modals and responsive states.
4. Run the production build and fix errors.
5. Verify at 375, 768, and 1440 with no horizontal overflow.
6. Exercise every interactive flow and report the results.

DELIVERABLE
A complete, responsive, production-ready implementation using the existing React + Tailwind + Redux architecture, with a short summary of what changed and what was verified.
```

---

## 14. Related

- [[Admin panel redesign]]
- [[Client app redesign]]
- [[Design tokens]]
- [[Responsive QA]]
