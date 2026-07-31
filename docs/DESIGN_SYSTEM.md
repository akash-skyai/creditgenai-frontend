# CreditGenAI Frontend — Design System & UI Guidelines

This document serves as the ground truth for the visual aesthetic of the CreditGenAI platform, specifically focusing on the Borrower flow.

## 1. Aesthetic Goal
We are building a **premium, production-grade Indian fintech application**. The design should feel native, incredibly smooth, and highly trustworthy. It should evoke the same quality as apps like Razorpay, Jupiter, and Cred. 

- **Vibrant but professional:** Deep indigo blues for trust, cyan accents for energy.
- **Airy and spacious:** Lots of white space, clean borders.
- **Micro-animations:** Smooth transitions on hover, focus, and route changes.

## 2. Color Palette (CSS Variables)

These tokens are globally defined in `src/styles/globals.scss`. **Never hardcode hex values in component SCSS.** Always use these variables.

| Token | Hex | Usage |
|---|---|---|
| `--brand-navy` | `#123b6d` | Dark brand color, secondary branding |
| `--brand-primary` | `#1d4ed8` | Primary buttons, active states, links, main brand color |
| `--brand-primary-hover` | `#1e40af` | Primary button hover, pressed states |
| `--brand-primary-light` | `#eff6ff` | Light brand background, highlights |
| `--status-success` | `#15803d` | OTP verified badges, success toasts, lock icons |
| `--status-warning` | `#b45309` | Pending states, warnings |
| `--status-danger` | `#b42318` | Errors, validation messages, destructive actions |
| `--status-info` | `#0369a1` | Informational messages, hints |
| `--surface-page` | `#f8fafc` | Page background (clean light tone) |
| `--surface-card` | `#ffffff` | Cards, form containers, elevated elements |
| `--surface-subtle` | `#f1f5f9` | Subtle backgrounds, disabled states |
| `--text-primary` | `#0f172a` | All page/card headings |
| `--text-secondary` | `#475569` | Default body text |
| `--text-muted` | `#64748b` | Labels, helper text, placeholders |
| `--border-default` | `#dbe3ec` | Default input borders, dividers |
| `--border-strong` | `#cbd5e1` | Strong borders, prominent dividers |

## 3. Typography

We use **Inter** (Google Fonts) exclusively.

| Token | Size | Usage |
|---|---|---|
| `--font-size-xs` | 12px (`0.75rem`) | Helper text, error messages |
| `--font-size-sm` | 14px (`0.875rem`) | Labels, secondary body text |
| `--font-size-base` | 16px (`1rem`) | Default body text, button text, inputs |
| `--font-size-lg` | 18px (`1.125rem`) | Card headings, section titles |
| `--font-size-xl` | 24px (`1.5rem`) | Main page titles |
| `--font-size-2xl`| 32px (`2rem`) | Hero headings |

## 4. Layouts

### Borrower Auth Pages (Phone Entry & OTP)
- **Desktop:** Two-column split.
  - **Left panel (60%):** Deep indigo gradient background (`#1E1B4B` to `#312E81`). Features branding, trust badges, and marketing copy.
  - **Right panel (40%):** Light background (`--surface-page`). Contains the auth card centered.
- **Card Styling:** `background: var(--surface-card)`, `border-radius: 16px`, `box-shadow: 0 8px 32px rgba(29, 78, 216, 0.12)`.
- **Mobile:** Full-width layout. The marketing panel is hidden or minimized. Auth card goes edge-to-edge with 16px padding.

### Borrower Form Page (Loan Application)
- **Desktop:** Full-width.
  - **Top Bar:** White, minimal, contains logo and breadcrumb.
  - **Stepper Bar:** Clean horizontal progress indicator below the top bar.
  - **Content Area:** A centered form card (max-width `720px`).
- **Form Elements:** Inputs should be full-width within their grid columns. Labels above inputs. Clean `#dbe3ec` borders turning `#1d4ed8` on focus.

## 5. Material-UI (MUI) & Lucide Integration

- **Material-UI:** Used for structural components (e.g., dropdowns, sliders). Its default styles must be overridden via standard overrides or SCSS modules using our CSS variables to ensure it matches the premium aesthetic.
- **Lucide React:** The **only** icon library permitted. Use consistent stroke widths (usually `1.5` or `2`) and sizes. 
