# CreditGenAI Frontend — Project Structure & Architecture Guide

> **Who this is for:** Any developer or AI agent working on this repo.
> Read this file before writing a single line of code or creating any folder.
> This is the *project-specific* layer on top of `FRONTEND_DEV_RULES_V2.md`.
> Both files must be read together.

---

## 1. What This Project Is

CreditGenAI is a loan origination platform. It has **multiple portals** served from one frontend repository. Each portal belongs to a different type of user (entity). The backend is a completely separate repository — this repo is frontend only.

The full pipeline in plain English:

```
Borrower fills form → Lead Partner refers them → Call Center verifies → DSA applies to banks → Admin oversees all
```

---

## 2. Entity Registry

These are all the portals this frontend serves. Each entity is its own isolated module under `src/modules/`.

| Entity | Folder name | User type | Auth method | Has dashboard | Dark mode |
|---|---|---|---|---|---|
| **Borrower** | `borrower` | External (public) | Mobile OTP only | ❌ No | ❌ No |
| **Lead Partner** | `lead-partner` | External (partner) | Google Sign-In / phone / password | ✅ Yes | ✅ Yes |
| **Call Center** | `call-center` | Internal (employee) | Username + password | ✅ Yes | ✅ Yes |
| **DSA** | `dsa` | Internal (agent) | Username + password | ✅ Yes | ✅ Yes |
| **Admin** | `admin` | Internal (admin) | Username + password | ✅ Yes | ✅ Yes |

> **Build order (current):** Only `borrower` is being built now.
> All other entities follow the exact same module pattern below when their turn comes.

---

## 3. Confirmed Project Decisions (locked — do not re-debate)

These decisions were made deliberately. Do not reverse them without a documented reason.

| Decision | Detail |
|---|---|
| One frontend repo | All portals live here. Backend is a separate repo. |
| Auth is per-entity | Each entity has its own `auth/` sub-module and its own service. There is no shared auth service. |
| Borrower = OTP only | No password, no Google, no magic link. Mobile number → 6-digit OTP → JWT token |
| Borrower has no dashboard | The borrower fills a form and leaves. No logged-in state after submission. |
| Borrower has no dark mode toggle | The borrower portal is a single-purpose form. No theme toggle is shown. CSS variables are still defined globally — the toggle just isn't exposed. |
| Dark mode toggle is Internal only | Toggle lives in `InternalLayout` (used by LP, Call Center, DSA, Admin). `BorrowerLayout` has no toggle. |
| Two layouts | `BorrowerLayout` = minimal shell (logo + form). `InternalLayout` = full shell (navbar + sidebar + dark mode toggle). |
| Mock strategy = one flag | `VITE_USE_MOCK=true` in `.env` → mock data. `false` → real API. Flip one flag, nothing else changes. |
| Routing is root-agnostic | Exact root path prefix (`/creditgenai`, `/app`, etc.) is TBD. All routes are relative. Only `AppRoutes.tsx` is updated when the root is decided. No module needs to know the root. |
| No i18n | India-only launch. Text stays in components. No `locales/` folder. |
| No `.js` or `.jsx` files | TypeScript only. Every file is `.tsx` or `.ts`. |
| No `any` type | TypeScript strict mode. No exceptions. |

---

## 4. Layouts

There are exactly two layouts. Never add conditional logic inside a layout to handle both entity types — that is the pattern we are avoiding.

### `shared/layouts/BorrowerLayout`
- Used by: `borrower` entity only
- Contains: logo, form container, step progress indicator
- Does NOT contain: navbar, sidebar, dark mode toggle, user menu

### `shared/layouts/InternalLayout`
- Used by: `lead-partner`, `call-center`, `dsa`, `admin`
- Contains: top navbar (with dark mode toggle and user menu), sidebar (config-driven per entity), main content area
- Dark mode toggle lives here and only here (A10)

---

## 5. Universal Module Pattern

This is the **template** for every entity module. When adding a new entity, follow this exactly.
Replace `[entity]` with the folder name from the Entity Registry (e.g. `call-center`, `dsa`).

```
src/modules/[entity]/
│
├── auth/                              ← authentication sub-module (always present)
│   ├── pages/
│   │   └── [AuthPage]/               ← e.g. LoginPage/, OtpVerifyPage/
│   │       ├── [AuthPage].tsx
│   │       ├── [AuthPage].module.scss
│   │       └── [AuthPage].test.tsx
│   ├── components/
│   │   └── [AuthForm]/               ← e.g. LoginForm/, OtpForm/, PhoneForm/
│   │       ├── [AuthForm].tsx
│   │       ├── [AuthForm].module.scss
│   │       └── [AuthForm].test.tsx
│   ├── hooks/
│   │   └── use[AuthAction].ts        ← useMutation (TanStack Query) — one hook per action
│   ├── services/
│   │   └── auth.service.ts           ← mock/real switch via environment.ts
│   ├── schemas/
│   │   └── [form].schema.ts          ← Zod schema per form
│   └── types/
│       └── auth.types.ts
│
├── [feature-1]/                       ← first business feature (e.g. dashboard/, queue/, leads/, cases/)
│   ├── pages/
│   │   └── [FeaturePage]/
│   │       ├── [FeaturePage].tsx
│   │       ├── [FeaturePage].module.scss
│   │       └── [FeaturePage].test.tsx
│   ├── components/
│   │   └── [ComponentName]/
│   │       ├── [ComponentName].tsx
│   │       ├── [ComponentName].module.scss
│   │       └── [ComponentName].test.tsx
│   ├── hooks/
│   │   └── use[FeatureAction].ts     ← useQuery or useMutation (TanStack Query)
│   ├── services/
│   │   └── [feature].service.ts      ← mock/real switch via environment.ts
│   ├── schemas/
│   │   └── [feature].schema.ts       ← Zod (only if feature has a form)
│   └── types/
│       └── [feature].types.ts
│
└── [feature-2]/                       ← additional features follow the same pattern
    └── ...
```

### Rules for every module

1. **One folder per concern.** `auth/` is always separate from feature folders. Never mix auth logic with business features.
2. **Pages = one route each.** A page file assembles components + connects hooks. No raw API calls, no hardcoded URLs. Keep under ~250 lines.
3. **Components = one job each.** A component renders UI and emits events upward. It never calls a service or hook that makes a network request — it receives data as props.
4. **Hooks = TanStack Query wrappers.** Use `useQuery` for reads, `useMutation` for writes/submits. Never call `fetch`/`axios` directly in a hook.
5. **Services = the only place that calls `api-client`.** The service also contains the `if (environment.useMock) return mockData` guard.
6. **Schemas = Zod only.** One schema file per form. The same schema is shared between the form's `useForm<>` generic and the service's input type.
7. **Types = shared type definitions.** Only put types here that are used by more than one file inside the module. Single-use types stay in the file that uses them.

---

## 6. Shared Components — Promotion Rule

Do NOT add a component to `shared/components/` speculatively.

**Rule:** Build the component inside the module that needs it first. Move it to `shared/components/` only when a **second module actually uses it**.

**Exception:** The following components are pre-approved for `shared/` because they are definitively used by multiple entities:

| Component | Reason |
|---|---|
| `Button` | Used by every form across all entities |
| `Input` | Used by every form across all entities |
| `OtpInput` | Used by Borrower auth + will be used by any other entity with OTP |
| `Toast` | Server errors shown as toast in every module (A15) |
| `Modal` | Used for confirmations across all entities |
| `EmptyState` | Required by A11 for every data list/table |
| `ErrorState` | Required by A11 for every data list/table |
| `PageLoader` | Required by A14 as Suspense fallback for every lazy-loaded route |

Everything else starts inside the module. Promote later when earned.

---

## 7. Routing Pattern

```
AppRoutes.tsx
├── BorrowerRoutes.tsx      → /[root]/apply/*
├── LeadPartnerRoutes.tsx   → /[root]/lp/*
├── CallCenterRoutes.tsx    → /[root]/call-center/*
├── DsaRoutes.tsx           → /[root]/dsa/*
└── AdminRoutes.tsx         → /[root]/admin/*
```

- `[root]` prefix is TBD. When decided, update `AppRoutes.tsx` only.
- Every sub-routes file uses relative paths (`/login`, `/dashboard`, etc.) — never absolute.
- Every route-level page is **lazy loaded** with `React.lazy()` and wrapped in `<Suspense fallback={<PageLoader />}>`.
- Each entity's routes file is responsible for its own auth guard.

### Guard levels (standard pattern)
```
PUBLIC      → No token required (login pages, borrower entry)
SOFT GUARD  → Intermediate state required (e.g. phone in state before OTP page)
HARD GUARD  → Valid JWT token required (all authenticated pages)
```

---

## 8. Services & Mock Strategy

Every service file follows this exact pattern. No exceptions.

```ts
// src/modules/[entity]/[feature]/services/[feature].service.ts

import { environment } from "@/config/environment";
import { apiClient } from "@/services/api-client";
import mockData from "@/mocks/[feature].mock.json";
import { endpoints } from "@/services/endpoints";

export async function [actionName](payload: [PayloadType]): Promise<[ReturnType]> {
  if (environment.useMock) {
    return mockData.[actionName]; // return the matching mock shape
  }
  const response = await apiClient.post(endpoints.[ENDPOINT_KEY], payload);
  return response.data;
}
```

- `environment.ts` — controls mock vs real. One flag: `VITE_USE_MOCK`
- `endpoints.ts` — all URL strings. No URL is ever written in a service, hook, or component directly.
- `mocks/` — one `.mock.json` file per service. Shape must exactly match what the real API will return.

---

## 9. Styling Rules (summary — full detail in FRONTEND_DEV_RULES_V2.md)

- `styles/globals.scss` — design tokens (colors, spacing, radius, font sizes), CSS variables, dark mode overrides, reset, `prefers-reduced-motion` block
- `[Component].module.scss` — layout and spacing for that component only. References CSS vars from globals. Never redefines color or spacing values.
- No inline styles. No `style={{}}` props.
- SCSS modules only — no global class names in component files.

---

## 10. Data Flow — One Rule, No Exceptions

```
Page / Component  →  Hook (TanStack Query)  →  Service  →  api-client  →  Backend
```

If you find yourself calling `fetch` or `axios` inside a component or a page, stop. Extract it.

---

## 11. Testing Convention

Every file that matters gets a sibling test file.

| File type | Test file |
|---|---|
| `MyPage.tsx` | `MyPage.test.tsx` |
| `MyComponent.tsx` | `MyComponent.test.tsx` |
| `useMyHook.ts` | `useMyHook.test.ts` |
| `my.service.ts` | `my.service.test.ts` |

Test what the user sees (rendered output, interactions, validation messages, empty/error states). Do not test implementation internals.

---

## 12. Adding a New Entity — Checklist for Agents

When a new entity module needs to be created (e.g. `call-center`):

- [ ] Add the entity to the Entity Registry table in this file
- [ ] Create `src/modules/[entity]/` following the Universal Module Pattern (Section 5)
- [ ] Create a layout in `shared/layouts/` only if this entity needs a shell different from `InternalLayout`
- [ ] Add `[Entity]Routes.tsx` to `src/routes/`
- [ ] Register the new routes file in `AppRoutes.tsx`
- [ ] Add mock JSON file(s) to `src/mocks/`
- [ ] Add new endpoint constants to `src/services/endpoints.ts`
- [ ] Do NOT create a dashboard stub or placeholder pages — only scaffold what is being built now

---

## 13. File Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Pages | PascalCase, suffix `Page` | `LoanApplicationPage.tsx` |
| Components | PascalCase | `OtpForm.tsx`, `PersonalInfoStep.tsx` |
| Hooks | camelCase, prefix `use` | `useSendOtp.ts`, `useSubmitLead.ts` |
| Services | camelCase, suffix `.service` | `otpAuth.service.ts` |
| Schemas | camelCase, suffix `.schema` | `phone.schema.ts`, `loanApplication.schema.ts` |
| Types | camelCase, suffix `.types` | `auth.types.ts` |
| SCSS modules | PascalCase, suffix `.module.scss` | `OtpForm.module.scss` |
| Mock data | camelCase, suffix `.mock.json` | `otpAuth.mock.json` |

---

## 14. Related Documents

| Document | Purpose |
|---|---|
| [`FRONTEND_DEV_RULES_V2.md`](./FRONTEND_DEV_RULES_V2.md) | Global coding standards, stack rules, component rules, styling rules. Read this first. |
| [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md) | This file. Project-specific decisions, entity registry, module pattern template. |

> If there is ever a conflict between `FRONTEND_DEV_RULES_V2.md` and `PROJECT_STRUCTURE.md`, this file (`PROJECT_STRUCTURE.md`) takes precedence because it documents decisions made specifically for this project.
