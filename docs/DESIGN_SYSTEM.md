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
| `--color-primary` | `#4F46E5` | Primary buttons, active states, links, main brand color |
| `--color-primary-dark` | `#3730A3` | Primary button hover, pressed states |
| `--color-accent` | `#06B6D4` | Progress bar highlights, secondary accents |
| `--color-success` | `#10B981` | OTP verified badges, success toasts, lock icons |
| `--color-warning` | `#F59E0B` | Pending states, warnings |
| `--color-danger` | `#EF4444` | Errors, validation messages, destructive actions |
| `--color-bg` | `#F8FAFF` | Page background (very slight blue tint) |
| `--color-surface` | `#FFFFFF` | Cards, form containers, elevated elements |
| `--color-text-heading` | `#111827` | All page/card headings |
| `--color-text-body` | `#374151` | Default body text |
| `--color-text-muted` | `#6B7280` | Labels, helper text, placeholders |
| `--color-border` | `#E5E7EB` | Default input borders, dividers |
| `--color-border-focus` | `#4F46E5` | Input borders when focused |

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
  - **Right panel (40%):** Light background (`--color-bg`). Contains the auth card centered.
- **Card Styling:** `background: var(--color-surface)`, `border-radius: 16px`, `box-shadow: 0 8px 32px rgba(79, 70, 229, 0.12)`.
- **Mobile:** Full-width layout. The marketing panel is hidden or minimized. Auth card goes edge-to-edge with 16px padding.

### Borrower Form Page (Loan Application)
- **Desktop:** Full-width.
  - **Top Bar:** White, minimal, contains logo and breadcrumb.
  - **Stepper Bar:** Clean horizontal progress indicator below the top bar.
  - **Content Area:** A centered form card (max-width `720px`).
- **Form Elements:** Inputs should be full-width within their grid columns. Labels above inputs. Clean `#E5E7EB` borders turning `#4F46E5` on focus.

## 5. PrimeReact & Lucide Integration

- **PrimeReact:** Used for structural components (e.g., dropdowns, sliders). Its default styles must be overridden in `globals.scss` using our CSS variables to ensure it matches the premium aesthetic.
- **Lucide React:** The **only** icon library permitted. Use consistent stroke widths (usually `1.5` or `2`) and sizes. 
