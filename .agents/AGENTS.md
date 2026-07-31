# CreditGenAI Frontend — Agent Rules

## MANDATORY: Read these docs before any task

Before making ANY change to this project — new file, new folder, new component, new route, anything — read both of these documents in full:

1. [`docs/FRONTEND_DEV_RULES_V2.md`](../docs/FRONTEND_DEV_RULES_V2.md)
   — Stack rules, component rules, data flow, styling, testing, accessibility.

2. [`docs/PROJECT_STRUCTURE.md`](../docs/PROJECT_STRUCTURE.md)
   — Entity registry, confirmed decisions, universal module pattern, routing pattern, naming conventions.

If you have not read both files, stop and read them before proceeding.

---

## Project Context (summary — full detail in docs above)

- **What it is:** A multi-portal loan origination platform. One frontend repo, multiple portals.
- **Entities:** `borrower`, `lead-partner`, `call-center`, `dsa`, `admin` — each is an isolated module under `src/modules/`.
- **Currently building:** `borrower` entity only.
- **Stack:** React + TypeScript (`.tsx`/`.ts` only) + Vite + React Hook Form + Zod + TanStack Query + SCSS Modules + Vitest/RTL.
- **Backend:** Separate repo. Frontend uses mock data via `VITE_USE_MOCK` flag until backend is ready.

---

## Non-Negotiable Behaviors

1. **Never skip the docs read.** The entity registry and confirmed decisions in `PROJECT_STRUCTURE.md` are the ground truth. Do not make assumptions about auth methods, layouts, or routing without checking.

2. **Never create a file outside the module pattern.** Every new page, component, hook, service, schema, and type lives inside `src/modules/[entity]/[feature]/` following the structure in `PROJECT_STRUCTURE.md` Section 5.

3. **Never add a component to `shared/components/` without confirming it is already used by two or more entity modules.** Start inside the module. Promote when earned.

4. **Never write a URL string anywhere except `src/services/endpoints.ts`.** Not in a service, not in a hook, not in a component.

5. **Never call `fetch` or `axios` directly in a component, page, or hook.** The call chain is always: Component → Hook (TanStack Query) → Service → `api-client`.

6. **Never use `.js` or `.jsx` files.** TypeScript only.

7. **Never use the `any` type.**

8. **Always create a `.test.tsx` or `.test.ts` sibling for every page, component, hook, and service you create.**

9. **When in doubt about a decision (routing, auth, layout), check `PROJECT_STRUCTURE.md` Section 3 (Confirmed Decisions). If it is not there, ask the user before guessing.**

---

## When Adding a New Entity Module

Follow the checklist in `PROJECT_STRUCTURE.md` Section 12 exactly. Do not skip steps.
