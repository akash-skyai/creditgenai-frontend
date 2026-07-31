# CreditGenAI Frontend — Project Structure & Architecture Guide

> **Who this is for:** Any developer or AI agent working on this repo.
> Read this file before writing a single line of code or creating any folder.
> This is the *project-specific* layer on top of `FRONTEND_DEV_RULES_V2.md`.
> Both files must be read together.

---

## 1. What This Project Is

CreditGenAI is a loan origination platform with multiple user portals, all served from this one frontend repository. The backend is a completely separate repository — this repo is frontend only.

**Currently building:** The `borrower` module only. Other modules (internal portals for partners, agents, and admins) will follow the same folder pattern documented here when their turn comes. Do not scaffold, reference, or think about those modules now.

---

## 2. Confirmed Project Decisions (locked — do not re-debate)

| Decision | Detail |
|---|---|
| One frontend repo | All portals will live here. Backend is a separate repo. |
| Borrower = OTP only | No password, no Google, no magic link. Mobile number → 6-digit OTP → verified. Auth session/token internals are **backend concern — deferred**. UI just shows the screens. |
| Borrower has no dashboard | The borrower fills a form and leaves. There is no post-submission logged-in view. |
| Borrower has no dark mode toggle | Single-purpose form. CSS variables are defined globally — the toggle just isn't exposed in `BorrowerLayout`. |
| Borrower form is text-only | No document upload at this stage. |
| Mock strategy = one flag | `VITE_USE_MOCK=true` in `.env` → mock data. `false` → real API. Flip one flag, nothing else changes. |
| Routing root is TBD | Exact path prefix (`/creditgenai`, `/app`, etc.) is undecided. All routes are relative. Only `AppRoutes.tsx` changes when the root is decided. |
| Auth implementation is deferred | JWT format, token storage, refresh strategy — all backend decisions. Do not hard-code auth storage logic now. |
| No i18n | India-only launch. Text stays in components. No `locales/` folder. |
| No `.js` or `.jsx` files | TypeScript only. Every file is `.tsx` or `.ts`. |
| No `any` type | TypeScript strict mode. No exceptions. |

---

## 3. Borrower — UI Flow (production-grade, screens only)

This describes **what the user sees** at each step. Implementation details (how sessions are stored, token format) are backend decisions — deferred. Do not hard-code them in the UI.

```
LP creates a referral link  →  /apply  OR  /apply/:trackingId
                                         (trackingId held in UI state, sent at final submit)
         │
         ▼
╔═════════════════════════════════╗
║  SCREEN 1 — PhoneEntryPage      ║  PUBLIC (no guard)
║  URL: /apply  or  /apply/:id    ║
║                                 ║
║  • CreditGenAI logo + tagline   ║
║  • "Enter your mobile number"   ║
║  • +91 prefix, 10-digit input   ║
║  • [Send OTP] primary button    ║
║  • Terms & Privacy link         ║
╚═════════════════════════════════╝
         │  valid 10-digit number submitted
         ▼
╔═════════════════════════════════╗
║  SCREEN 2 — OtpVerifyPage       ║  SOFT GUARD (phone must be in state)
║  URL: /apply/verify-otp         ║
║                                 ║
║  • "OTP sent to +91 XXXXXX7890" ║
║  • 6-box OTP input (auto-focus) ║
║  • Countdown timer (30s)        ║
║  • [Resend OTP] after timer     ║
║  • [← Change Number] back link  ║
║  • [Verify & Continue] button   ║
╚═════════════════════════════════╝
         │  OTP verified
         ▼
         ├─── NEW user ──────────────────────────────────────────────────────┐
         │                                                                   │
         │                              RETURNING user (prior draft exists)  │
         │                         ╔══════════════════════════════════════╗  │
         │                         ║  ReturningUserModal (inline modal)   ║  │
         │                         ║                                      ║  │
         │                         ║  "Welcome Back 👋"                   ║  │
         │                         ║  Progress bar (e.g. 45% complete)    ║  │
         │                         ║  Steps completed checklist           ║  │
         │                         ║                                      ║  │
         │                         ║  [Resume Application]  ← primary     ║  │
         │                         ║  [Start New Application] ← secondary ║  │
         │                         ╚══════════════════════════════════════╝  │
         │                                      │                            │
         │                         resume ──────┘          start new ────────┤
         └───────────────────────────────────────────────────────────────────┘
         │
         ▼
╔═════════════════════════════════════════════════════════════════════╗
║  SCREEN 3 — LoanApplicationPage                                     ║  HARD GUARD
║  URL: /apply/form                                                   ║
║                                                                     ║
║  Stepper:  [1 Personal] ──── [2 Employment & Loan] ──── [3 Review] ║
║                                                                     ║
║  STEP 1 — Personal Details                                          ║
║    First / Middle / Last Name                                       ║
║    Mobile (pre-filled, read-only, verified lock icon)               ║
║    Email, Gender, Date of Birth                                     ║
║    PAN Number (format: ABCDE1234F)                                  ║
║    PIN Code → auto-fills City + State via Postal API               ║
║    [Next →]                                                         ║
║                                                                     ║
║  STEP 2 — Employment & Loan Details                                 ║
║    Employment Type: [Salaried] / [Self-Employed]                    ║
║      If Salaried → Sector (Govt/Private) → Org/Company name        ║
║      If Self-Employed → Business type → Total experience            ║
║    Monthly Income, Existing EMI                                     ║
║    Loan Amount (slider + number input)                              ║
║    Loan Purpose (dropdown, "Other" reveals text field)              ║
║    Loan Tenure (12/24/36/48/60/72/84 months)                        ║
║    Estimated EMI (live calculation, read-only)                      ║
║    [← Back]  [Next →]                                              ║
║                                                                     ║
║  STEP 3 — Review & Submit                                           ║
║    Summary of all entered data (read-only)                          ║
║    [← Back]  [Submit Application] ← final CTA                      ║
╚═════════════════════════════════════════════════════════════════════╝
         │  submitted
         ▼
╔═════════════════════════════════╗
║  SuccessScreen (component,      ║  Rendered inside LoanApplicationPage
║  not a separate route)          ║  NOT a new URL
║                                 ║
║  Application Reference ID       ║
║  "Under Review" status badge    ║
║  Expected SLA / next steps      ║
║  "Our advisor will contact you" ║
╚═════════════════════════════════╝
```

### Why this flow order
- **OTP before form** — Identity first. Prevents fake submissions. Enables resume-from-draft on the same number. Standard in every Indian fintech (BankBazaar, PaisaBazaar, MoneyView).
- **Mobile pre-filled + locked** — Verified number can't be tampered with. Visible trust signal.
- **Returning user modal** — Prevents frustration of refilling a long form. Progress % motivates completion.
- **Review step before submit** — Lets borrower catch errors. Reduces support tickets.
- **SuccessScreen = component, not a route** — Prevents direct navigation to success without submitting.

### Implementation notes
- `trackingId` is captured from the URL on Screen 1 and passed through to the final submit payload.
- PIN Code auto-fill (City + State) uses the India Postal API — a frontend-to-third-party call, not through the main backend.
- EMI calculator is a pure frontend computation — no API call needed.
- No document upload. The borrower form is **text-only**.

---

## 4. Folder Structure

```
src/
│
├── modules/
│   └── borrower/                        ← the only module being built now
│       ├── auth/
│       │   ├── pages/
│       │   │   ├── PhoneEntryPage/
│       │   │   │   ├── PhoneEntryPage.tsx
│       │   │   │   ├── PhoneEntryPage.module.scss
│       │   │   │   └── PhoneEntryPage.test.tsx
│       │   │   └── OtpVerifyPage/
│       │   │       ├── OtpVerifyPage.tsx
│       │   │       ├── OtpVerifyPage.module.scss
│       │   │       └── OtpVerifyPage.test.tsx
│       │   ├── components/
│       │   │   ├── PhoneForm/
│       │   │   │   ├── PhoneForm.tsx
│       │   │   │   ├── PhoneForm.module.scss
│       │   │   │   └── PhoneForm.test.tsx
│       │   │   └── OtpForm/
│       │   │       ├── OtpForm.tsx
│       │   │       ├── OtpForm.module.scss
│       │   │       └── OtpForm.test.tsx
│       │   ├── hooks/
│       │   │   ├── useSendOtp.ts
│       │   │   └── useVerifyOtp.ts
│       │   ├── services/
│       │   │   └── otpAuth.service.ts
│       │   ├── schemas/
│       │   │   ├── phone.schema.ts
│       │   │   └── otp.schema.ts
│       │   └── types/
│       │       └── auth.types.ts
│       │
│       └── loan-application/
│           ├── pages/
│           │   └── LoanApplicationPage/
│           │       ├── LoanApplicationPage.tsx
│           │       ├── LoanApplicationPage.module.scss
│           │       └── LoanApplicationPage.test.tsx
│           ├── components/
│           │   ├── PersonalInfoStep/
│           │   │   ├── PersonalInfoStep.tsx
│           │   │   ├── PersonalInfoStep.module.scss
│           │   │   └── PersonalInfoStep.test.tsx
│           │   ├── EmploymentLoanStep/
│           │   │   ├── EmploymentLoanStep.tsx
│           │   │   ├── EmploymentLoanStep.module.scss
│           │   │   └── EmploymentLoanStep.test.tsx
│           │   ├── ReviewStep/
│           │   │   ├── ReviewStep.tsx
│           │   │   ├── ReviewStep.module.scss
│           │   │   └── ReviewStep.test.tsx
│           │   ├── SuccessScreen/
│           │   │   ├── SuccessScreen.tsx
│           │   │   ├── SuccessScreen.module.scss
│           │   │   └── SuccessScreen.test.tsx
│           │   └── ReturningUserModal/
│           │       ├── ReturningUserModal.tsx
│           │       ├── ReturningUserModal.module.scss
│           │       └── ReturningUserModal.test.tsx
│           ├── hooks/
│           │   └── useSubmitApplication.ts
│           ├── services/
│           │   └── loanApplication.service.ts
│           ├── schemas/
│           │   ├── personalInfo.schema.ts
│           │   └── employmentLoan.schema.ts
│           └── types/
│               └── loanApplication.types.ts
│
├── shared/
│   ├── layouts/
│   │   └── BorrowerLayout/             ← logo + form shell, no nav, no dark mode toggle
│   │       ├── BorrowerLayout.tsx
│   │       ├── BorrowerLayout.module.scss
│   │       └── BorrowerLayout.test.tsx
│   └── components/                     ← only components confirmed used by 2+ modules
│       ├── Button/
│       ├── Input/
│       ├── OtpInput/
│       ├── Toast/
│       ├── Modal/
│       ├── EmptyState/
│       ├── ErrorState/
│       └── PageLoader/
│
├── routes/
│   ├── AppRoutes.tsx                   ← top-level router, lazy loads BorrowerRoutes
│   └── BorrowerRoutes.tsx             ← all borrower routes + guards
│
├── services/
│   ├── api-client.ts                   ← axios instance, one file
│   └── endpoints.ts                    ← every URL string lives here ONLY
│
├── config/
│   └── environment.ts                  ← VITE_USE_MOCK flag + API base URL
│
├── mocks/
│   ├── otpAuth.mock.json
│   └── loanApplication.mock.json
│
├── assets/
│   ├── icons/                          ← SVGs only (A8)
│   └── images/                         ← WebP photos (A8)
│
├── styles/
│   └── globals.scss                    ← design tokens, CSS vars, reset, prefers-reduced-motion
│
└── main.tsx
```

> **Other modules** (for partners, agents, admins) will each get their own folder under `src/modules/` when their time comes. They will follow the exact same pattern as `borrower/`. Do not scaffold them now.

---

## 5. Module Rules

1. **One folder per concern.** `auth/` is always separate from feature folders. Never mix auth logic with business features.
2. **Pages = one route each.** A page assembles components and connects hooks. No raw API calls, no hardcoded URLs. Soft ceiling: ~250 lines.
3. **Components = one job each.** Renders UI, emits events upward. Never calls a service or a network hook directly — receives data via props.
4. **Hooks = TanStack Query wrappers.** `useQuery` for reads, `useMutation` for writes. Never call `fetch`/`axios` directly.
5. **Services = the only place that calls `api-client`.** Also contains the `if (environment.useMock) return mockData` guard.
6. **Schemas = Zod only.** One schema file per form. Shared between `useForm<>` generic and the service's input type.
7. **Types = module-level shared definitions.** Single-use types stay in the file that uses them.

---

## 6. Shared Components — Promotion Rule

Build every new component **inside the module** that needs it first.  
Move it to `shared/components/` **only when a second module actually needs it**.

Pre-approved for `shared/` (genuinely used by multiple modules):

| Component | Why |
|---|---|
| `Button` | Every form across all modules |
| `Input` | Every form across all modules |
| `OtpInput` | Borrower auth + any future module with OTP |
| `Toast` | Server errors shown as toast everywhere (A15) |
| `Modal` | Confirmations across modules |
| `EmptyState` | Every data list/table (A11) |
| `ErrorState` | Every data list/table (A11) |
| `PageLoader` | Suspense fallback for every lazy route (A14) |

---

## 7. Routing

```
AppRoutes.tsx
└── BorrowerRoutes.tsx   →  /apply
                              /apply/:trackingId
                              /apply/verify-otp
                              /apply/form
```

- Root prefix is TBD. When decided, update `AppRoutes.tsx` only. No module file knows the root.
- Every page is lazy-loaded: `React.lazy()` + `<Suspense fallback={<PageLoader />}>`.
- `BorrowerRoutes.tsx` owns all guard logic for the borrower flow.

### Guard levels
```
PUBLIC     → No prior state needed. (PhoneEntryPage)
SOFT GUARD → A previous UI step must have completed. (OtpVerifyPage: phone must be in state)
HARD GUARD → Verification must be complete. (LoanApplicationPage)
             How this is checked is decided when the backend auth contract is finalised.
```

---

## 8. Services & Mock Strategy

```ts
// src/modules/borrower/[feature]/services/[feature].service.ts

import { environment } from "@/config/environment";
import { apiClient } from "@/services/api-client";
import mockData from "@/mocks/[feature].mock.json";
import { endpoints } from "@/services/endpoints";

export async function actionName(payload: PayloadType): Promise<ReturnType> {
  if (environment.useMock) {
    return mockData.actionName;
  }
  const response = await apiClient.post(endpoints.ENDPOINT_KEY, payload);
  return response.data;
}
```

- `environment.ts` — one flag: `VITE_USE_MOCK`
- `endpoints.ts` — every URL string. No URL is ever written anywhere else.
- `mocks/` — one `.mock.json` per service. Shape must exactly match what the real API will return.

---

## 9. Data Flow — No Exceptions

```
Page / Component  →  Hook (TanStack Query)  →  Service  →  api-client  →  Backend
```

If you find `fetch` or `axios` inside a component or page, stop and extract it.

---

## 10. Styling

- `styles/globals.scss` — design tokens (colors, spacing, radius, fonts), CSS variables, dark mode overrides, reset, `prefers-reduced-motion` block.
- `[Component].module.scss` — layout/spacing for that component only. References global CSS vars. Never redefines colors or spacing values.
- No inline `style={{}}` props.
- SCSS modules only — no global class names in component files.

---

## 11. Testing

Every file that matters gets a sibling test file:

| File | Test file |
|---|---|
| `MyPage.tsx` | `MyPage.test.tsx` |
| `MyComponent.tsx` | `MyComponent.test.tsx` |
| `useMyHook.ts` | `useMyHook.test.ts` |
| `my.service.ts` | `my.service.test.ts` |

Test what the user sees (rendered output, interactions, validation messages, empty/error states). Do not test implementation internals.

---

## 12. File Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Pages | PascalCase + `Page` suffix | `LoanApplicationPage.tsx` |
| Components | PascalCase | `OtpForm.tsx`, `PersonalInfoStep.tsx` |
| Hooks | camelCase + `use` prefix | `useSendOtp.ts`, `useSubmitApplication.ts` |
| Services | camelCase + `.service` suffix | `otpAuth.service.ts` |
| Schemas | camelCase + `.schema` suffix | `phone.schema.ts` |
| Types | camelCase + `.types` suffix | `auth.types.ts` |
| SCSS modules | PascalCase + `.module.scss` | `OtpForm.module.scss` |
| Mock data | camelCase + `.mock.json` | `otpAuth.mock.json` |

---

## 13. Related Documents

| Document | Purpose |
|---|---|
| [`FRONTEND_DEV_RULES_V2.md`](./FRONTEND_DEV_RULES_V2.md) | Global coding standards — stack, component rules, styling, testing, accessibility. Read first. |
| [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md) | This file. Project-specific decisions, borrower flow, folder structure. |

> If there is ever a conflict between `FRONTEND_DEV_RULES_V2.md` and `PROJECT_STRUCTURE.md`, this file takes precedence because it documents decisions made specifically for this project.
