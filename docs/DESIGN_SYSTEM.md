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
| `--brand-primary-active` | `#1e3a8a` | Active/Pressed states |
| `--brand-primary-light` | `#eff6ff` | Light brand background, highlights |
| `--status-success` | `#15803d` | OTP verified badges, success toasts, lock icons |
| `--status-success-light` | `#f0fdf4` | Light success background for badges |
| `--status-warning` | `#b45309` | Pending states, warnings |
| `--status-warning-light` | `#fffbeb` | Light warning background for badges |
| `--status-danger` | `#b42318` | Errors, validation messages, destructive actions |
| `--status-danger-light` | `#fef2f2` | Light error background for banners |
| `--status-info` | `#0369a1` | Informational messages, hints |
| `--status-info-light` | `#f0f9ff` | Light informational background |
| `--surface-page` | `#f8fafc` | Page background (clean light tone) |
| `--surface-card` | `#ffffff` | Cards, form containers, elevated elements |
| `--surface-subtle` | `#f1f5f9` | Subtle backgrounds |
| `--surface-disabled` | `#e9eef5` | Disabled backgrounds |
| `--text-primary` | `#0f172a` | All page/card headings |
| `--text-secondary` | `#475569` | Default body text |
| `--text-muted` | `#64748b` | Labels, helper text, placeholders |
| `--text-disabled` | `#7b8798` | Disabled text |
| `--text-on-primary` | `#ffffff` | Text on primary brand background |
| `--border-default` | `#dbe3ec` | Default input borders, dividers |
| `--border-strong` | `#cbd5e1` | Strong borders, prominent dividers |
| `--border-control` | `#8796aa` | Enhanced control borders |

## 3. Typography

We use **Inter** and **Noto Sans Devanagari** (Google Fonts).

| Token | Size | Usage |
|---|---|---|
| `--font-size-xs` | 12px (`0.75rem`) | Helper text, error messages |
| `--font-size-sm` | 14px (`0.875rem`) | Labels, secondary body text |
| `--font-size-base` | 16px (`1rem`) | Default body text, button text, inputs |
| `--font-size-lg` | 18px (`1.125rem`) | Card headings, section titles |
| `--font-size-xl` | 24px (`1.5rem`) | Main page titles |
| `--font-size-2xl`| 32px (`2rem`) | Hero headings |

## 4. Spacing, Radius & Elevation

### Spacing Tokens
| Token | Size |
|---|---|
| `--space-1` | `0.25rem` (4px) |
| `--space-2` | `0.5rem` (8px) |
| `--space-3` | `0.75rem` (12px) |
| `--space-4` | `1rem` (16px) |
| `--space-5` | `1.25rem` (20px) |
| `--space-6` | `1.5rem` (24px) |
| `--space-8` | `2rem` (32px) |

### Radius Tokens
| Token | Size |
|---|---|
| `--radius-sm` | `0.375rem` (6px) |
| `--radius-md` | `0.625rem` (10px) |
| `--radius-lg` | `0.875rem` (14px) |
| `--radius-xl` | `1rem` (16px) |

### Shadows
- **Card Shadow:** `--shadow-card` (Soft elevation for auth cards and containers).

## 5. Layouts

### Borrower Auth Pages (Phone Entry & OTP)
- **Desktop:** Two-column split.
  - **Left panel (60%):** Deep indigo gradient background (`#1E1B4B` to `#312E81`). Features branding, trust badges, and marketing copy.
  - **Right panel (40%):** Light background (`--surface-page`). Contains the auth card centered.
- **Card Styling:** `background: var(--surface-card)`, `border-radius: var(--radius-xl)`, `box-shadow: var(--shadow-card)`.
- **Mobile:** Full-width layout. The marketing panel is hidden or minimized. Auth card goes edge-to-edge with 16px padding.

### Borrower Form Page (Loan Application)
- **Desktop:** Full-width.
  - **Top Bar:** White, minimal, contains logo and breadcrumb.
  - **Stepper Bar:** Clean horizontal progress indicator below the top bar.
  - **Content Area:** A centered form card (max-width `720px`).
- **Form Elements:** Inputs should be full-width within their grid columns. Labels above inputs. Clean borders turning `--brand-primary` on focus. Focus rings use the standard `:focus-visible` styling (`outline: 3px solid var(--brand-primary)`).

## 6. Material-UI (MUI) & Lucide Integration

- **Material-UI:** Used for structural components (e.g., dropdowns, sliders). Its default styles must be overridden via standard overrides or SCSS modules using our CSS variables to ensure it matches the premium aesthetic.
- **Lucide React:** The **only** icon library permitted. Use consistent stroke widths (usually `1.5` or `2`) and sizes.
