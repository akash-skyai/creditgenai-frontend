# CreditGenAI Frontend — Agent Rules

## MANDATORY: Read these docs before any task

Before making ANY change to this project — new file, new folder, new component, new route, anything — read both of these documents in full:

1. [`docs/FRONTEND_DEV_RULES_V2.md`](../docs/FRONTEND_DEV_RULES_V2.md)
   — Stack rules, component rules, data flow, styling, testing, accessibility.

2. [`docs/PROJECT_STRUCTURE.md`](../docs/PROJECT_STRUCTURE.md)
   — Confirmed decisions, borrower UI flow, folder structure, naming conventions, module rules.

3. [`docs/DESIGN_SYSTEM.md`](../docs/DESIGN_SYSTEM.md)
   — The official color palette, typography, and layout rules for the premium UI. Always use its CSS variables.

If you have not read all three files, stop and read them before proceeding.

---

## Project Context

- **What it is:** A loan origination platform. One frontend repo. Backend is a separate repo.
- **Currently building:** The `borrower` module only — migrating from `borrower-page-old/` into the proper module structure under `src/modules/borrower/`. **Goal:** We are elevating the intern's old HTML/CSS into a highly responsive, production-grade, modern UI/UX (premium feel, vibrant but professional colors, micro-animations). Do not just blindly copy the old CSS; translate it to modern React component standards.
- **Stack:** React + TypeScript (`.tsx`/`.ts` only) + Vite + PrimeReact + Lucide React + React Hook Form + Zod + TanStack Query + SCSS Modules + Vitest/RTL.
- **Mock data:** All services use a `VITE_USE_MOCK` flag in `.env`. Real API is not ready yet.
- **Other modules:** Other portals will exist in the future. Do not scaffold, reference, or think about them. Focus only on `borrower`.

---

## Non-Negotiable Behaviors

1. **Never skip the docs read.** Confirmed decisions in `PROJECT_STRUCTURE.md` are ground truth. Do not assume auth methods, layouts, or routing without checking.

2. **Never create a file outside the module pattern.** Every page, component, hook, service, schema, and type lives inside `src/modules/borrower/[feature]/` as defined in `PROJECT_STRUCTURE.md` Section 4.

3. **Never add a component to `shared/components/` without confirming it is used by two or more modules.** Start inside the module. Promote when earned. The pre-approved list is in `PROJECT_STRUCTURE.md` Section 6.

4. **Never write a URL string anywhere except `src/services/endpoints.ts`.** Not in a service, not in a hook, not in a component.

5. **Never call `fetch` or `axios` directly in a component, page, or hook.** The call chain is always: `Component → Hook (TanStack Query) → Service → api-client`.

6. **Never use `.js` or `.jsx` files.** TypeScript only.

7. **Never use the `any` type.**

8. **Always create a `.test.tsx` or `.test.ts` sibling for every page, component, hook, and service you create.**

9. **Never hard-code auth implementation details** (JWT storage, token refresh, cookie logic). Auth internals are a backend decision — deferred. The UI only shows screens and calls services.

10. **When in doubt about a decision, check `PROJECT_STRUCTURE.md` Section 2 (Confirmed Decisions). If it is not there, ask the user before guessing.**

11. **Do not hallucinate component APIs.** If you need to use a PrimeReact component (or any third-party library) and you are not 100% sure of the exact props/API for the current version, explicitly tell the user: *"Please search the web for the [Component Name] documentation and provide it to me so I can implement it correctly."*
