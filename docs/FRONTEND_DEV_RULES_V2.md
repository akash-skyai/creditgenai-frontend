# Frontend Rules

This document has two parts:

- **Section A — Global Rules.** These are standard practice, true for any React project we ever build. They don't change from project to project.
- **Section B — Project Rules.** Decisions specific to *this* app — how we split repos, how we mock APIs, and what we're intentionally skipping for now.

If you're new to the team, read both sections once, then keep this open as reference while you work.

---

# Section A — Global Rules

## A1. Stack

```
React + TypeScript (.tsx / .ts only — no .js/.jsx)
Vite
React Router          → routing
React Hook Form + Zod → forms & validation
TanStack Query        → server/API data
PrimeReact            → UI component library (buttons, inputs, dropdowns, etc.)
Lucide React          → Official icon library (lucide-react)
SCSS Modules          → component layout and custom styling
Vitest + RTL          → testing
```

## A2. Folder Structure — the part everyone gets confused by

There are **two different kinds of "components"**, sitting at two different levels. This is the source of most confusion, so read this carefully.

```
src/
├── modules/                 ← every "main page" / feature lives here
│   ├── auth/
│   │   ├── pages/           ← the actual screen (LoginPage)
│   │   ├── components/      ← pieces used ONLY inside auth (e.g. LoginForm)
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   └── dashboard/
│       ├── pages/
│       ├── components/      ← pieces used ONLY inside dashboard
│       └── ...
│
├── shared/
│   └── components/          ← pieces used by 2+ modules (Button, Navbar, Modal, Toast)
```

**Rule of thumb (promotion, not prediction):** build every new component inside the module you're working in. Only move it to `shared/components` the moment a *second* module actually needs it. Don't guess in advance — that's how we end up with a bloated `shared` folder full of things nobody reuses.

Both `modules/` and `shared/` sit at the same root level, next to `services/`, `config/`, `styles/`, `routes/`. See Section B4 for a filled-in example with two real pages.

## A3. Component Rules

Every component:
- Written in TypeScript, typed props, no `any`
- Does one job
- Works at mobile / tablet / desktop
- Handles missing/empty data safely
- Never calls an API directly

## A4. Page Rules

A page = one route. It assembles components, connects hooks/services, and handles loading/empty/error/success. It never contains a raw API call, a hardcoded URL, or a large chunk of UI that should've been its own component. Keep pages under ~250 lines as a soft ceiling — split earlier if it's getting hard to read.

## A5. The One Data Flow

```
Component → Hook → Service → API Client → Backend
```

No exceptions. This is also what makes the mock-to-real API switch painless — see Section B2.

## A6. Responsive Breakpoints

```
Mobile:   380px – 767px
Tablet:   768px – 1200px
Desktop:  1201px and up
```

Mobile-first. Test at minimum: 380 / 768 / 1024 / 1201 / 1440 / 1920px. No fixed widths, no horizontal scroll.

## A7. Styling — Global vs Component-Level

```
styles/globals.scss     → reset, typography, design tokens, colors, dark-mode variables
modules/**/*.module.scss → styling that belongs to ONE component only
```

Anything shared across the whole app (colors, spacing, font sizes, radius values) is a **CSS variable defined once in `globals.scss`**. A component's own `.module.scss` should only contain layout/spacing specific to that component — it should reference the global variables, never redefine its own color or spacing values.

**PrimeReact overrides:** Since we use PrimeReact for core UI components, use CSS variables and global SCSS to override PrimeReact's default theme tokens to match our premium, custom design language. Avoid `!important` tags where possible.

```scss
// styles/globals.scss
:root {
  --color-primary: #2563eb;
  --color-danger: #dc2626;
  --spacing-md: 1rem;
  --radius-md: 0.5rem;
}
```

```scss
// OfferCard.module.scss
.card {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}
```

## A8. Images & Icons

> **Designer's note:** this is a big one for responsiveness specifically, so don't treat it as an afterthought.

**Icons, logos, simple illustrations → SVG.** They stay perfectly sharp at any screen size or zoom level, they're tiny in file size, and their color can be controlled with CSS (useful for dark mode — see A10). This is the right default for almost everything in the UI.

**Photos, screenshots, complex/detailed illustrations → WebP** (with a JPEG/PNG fallback only if we need older-browser support). SVG isn't built for this kind of content and the file size would be worse, not better.

**Icon Library: Lucide React (`lucide-react`).** We strictly use Lucide for all icons. Do not pull in PrimeIcons, FontAwesome, or Material Icons. Mixed icon styles is one of the fastest ways an app looks unpolished. Stick to Lucide everywhere.

Every image, regardless of format, must:
- Have a defined width/height or `aspect-ratio` set in CSS, so the page doesn't jump around while it loads
- Be compressed before it's committed to the repo
- Use `loading="lazy"` if it sits below the initial viewport
- Scale with its container — `max-width: 100%; height: auto;` — never a hardcoded pixel width. This is what actually makes an image "responsive," not just its file format
- Have real `alt` text if it conveys information, or `alt=""` if it's purely decorative

Don't paste large inline SVG markup directly inside a page component — keep it as its own file/component so pages stay readable.

## A9. Animations

Use **CSS3 transitions/animations** for interactions — hover states, dropdowns opening, fades, button feedback — instead of reaching for a JS animation library. It's lighter, and the browser renders it more smoothly than JS-driven animation.

- Keep it short and subtle: **150–300ms** is the usual range for UI feedback. Anything slower starts to feel like it's in the user's way.
- An animation should make a change easier to *understand* (e.g. a modal growing out from the button that opened it) — not exist purely for decoration.
- Always respect the user's system-level motion preference:

```scss
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Don't animate a component just because it's technically possible to. If it doesn't help the user follow what happened, skip it.

## A10. Theming & Dark Mode

> **Designer's note:** this is where teams usually go wrong — every module ends up with its own dark-mode `if` statement and things fall out of sync. Don't do that.

- Dark mode is controlled **globally**, once, via CSS variables in `styles/globals.scss` using a `[data-theme="dark"]` override.
- The **toggle button lives in one place: the shared Navbar/Topbar component** (`shared/components/Navbar`). No module owns it, no module re-implements it.
- Individual components never contain dark-mode logic — they just use the CSS variables, and the variables change value when the theme flips.

```scss
:root {
  --bg-primary: #ffffff;
  --text-primary: #111827;
}
[data-theme="dark"] {
  --bg-primary: #111827;
  --text-primary: #f9fafb;
}
```

This is the standard pattern used by most modern products (GitHub, Linear, Notion, etc.) — one toggle, one source of truth, every component just reacts to it.

## A11. Loading / Empty / Error States

> **Designer's note:** a table that just shows nothing when there's no data is the #1 thing that makes users think the app is broken or still loading. Never let that happen silently.

Every data-driven component needs all four states, and they must look *visibly different* from each other:

| State | What the user sees |
|---|---|
| Loading | Skeleton or spinner |
| Success | The actual data |
| Empty | An explicit message — "No results found" — not a blank space |
| Error | A friendly message + retry option, never the raw backend error |

Build one reusable `EmptyState` and `ErrorState` component in `shared/components` so every table/list in the app uses the same pattern instead of every developer inventing their own.

## A12. Filters Need a Reset

> **Designer's note:** yes, this is standard UX practice — you'll find it in every serious product with filters (tables, search, dropdowns). Once a user has changed something, they need a fast way to undo it without manually reverting every filter one by one.

Any component with active filters must show a **"Reset" / "Clear all"** action as soon as at least one filter is active. Keep it conditionally rendered — don't show it when nothing's been changed, that's just clutter.

## A13. Repeated UI → Config-Driven, Not Copy-Pasted

If you're writing the same block of JSX more than twice (sidebar items, nav links, tabs, similar cards), stop and turn it into one component driven by a data array instead.

```ts
// shared/components/Sidebar/sidebar.config.ts
export const sidebarItems = [
  { label: "Dashboard", icon: "home", path: "/dashboard" },
  { label: "Offers", icon: "tag", path: "/offers" },
  { label: "Profile", icon: "user", path: "/profile" },
];
```

```tsx
// Sidebar.tsx
{sidebarItems.map((item) => (
  <SidebarItem key={item.path} {...item} />
))}
```

Adding or removing an item becomes a one-line change to the config, not a hunt through markup.

## A14. Lazy Loading — Only Where It Matters

Lazy-load route-level pages, heavy dashboards, large charts, and rarely-opened modals. **Don't** lazy-load small shared components (a Button, an Icon) — that adds overhead for no real benefit. Every lazy-loaded section needs a fallback (`<Suspense fallback={<PageLoader />}>`).

## A15. Forms & Validation

React Hook Form + Zod schemas. Field-specific errors show next to the field; server/API errors show as a toast. Disable submit while a request is in flight. Keep entered values if submission fails — don't clear the form.

## A16. Accessibility (baseline, not optional)

Every input has a real `<label>`. Use `<button>` for actions and links for navigation — never a clickable `<div>`. Keyboard navigation must work. Decorative images get `alt=""`; meaningful images get real alt text.

## A17. Testing

Every component/hook/service that matters gets a test file. Test what the user sees and does — clicks, validation messages, empty/error states — not internal implementation details.

## A18. Before Opening a Pull Request

- [ ] No `console.log`, no commented-out code, no `any`
- [ ] Lint + type-check + tests all pass
- [ ] Checked on mobile, tablet, desktop
- [ ] Loading / empty / error states implemented
- [ ] No hardcoded API URLs or secrets
- [ ] Reused `shared/components` instead of duplicating UI
- [ ] Images have defined dimensions and are compressed

---

# Section B — Project Rules (specific to this app)

## B1. One Frontend Repo, Backend Separate

All pages of the app live in a single frontend repository. Backend is its own repo. The frontend team's job is to build everything so that swapping mock data for the real backend later is a config change, not a rewrite — see B2.

## B2. Mock API Strategy — the switch lives in one file

While the backend isn't ready, every service function returns mock JSON instead of calling the real API — but through the exact same function signature the real call will use later. The switch is controlled from `config/environment.ts`.

```ts
// config/environment.ts
export const environment = {
  useMock: import.meta.env.VITE_USE_MOCK === "true",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
};
```

```ts
// modules/dashboard/services/dashboard.service.ts
import { environment } from "@/config/environment";
import { apiClient } from "@/services/api-client";
import mockStats from "@/mocks/dashboard.mock.json";

export async function getDashboardStats() {
  if (environment.useMock) {
    return mockStats;
  }
  const response = await apiClient.get("/dashboard/stats");
  return response.data;
}
```

When the backend is ready: flip `VITE_USE_MOCK=false` in `.env`. Nothing in the component, hook, or page changes — only this one flag.

## B3. No i18n — For Now

The app is India-only at launch, so we're not building a multi-language setup (no `locales/en.json` etc.) right now. Keep text in the components as normal. If we expand to other languages later, we'll extract strings then — no need to over-engineer for a requirement we don't have yet.

## B4. Concrete Example — Two Real Pages

Here's exactly how `auth` and `dashboard` look side by side, so the module/shared split in A2 is unambiguous:

```
src/
├── modules/
│   ├── auth/
│   │   ├── pages/
│   │   │   └── LoginPage/
│   │   │       ├── LoginPage.tsx
│   │   │       ├── LoginPage.module.scss
│   │   │       └── LoginPage.test.tsx
│   │   ├── components/
│   │   │   └── LoginForm/
│   │   │       ├── LoginForm.tsx
│   │   │       ├── LoginForm.module.scss
│   │   │       └── LoginForm.test.tsx
│   │   ├── hooks/useLogin.ts
│   │   ├── services/auth.service.ts
│   │   ├── schemas/login.schema.ts
│   │   └── types/auth.types.ts
│   │
│   └── dashboard/
│       ├── pages/
│       │   └── DashboardPage/
│       │       ├── DashboardPage.tsx
│       │       ├── DashboardPage.module.scss
│       │       └── DashboardPage.test.tsx
│       ├── components/
│       │   └── StatsCard/
│       │       ├── StatsCard.tsx
│       │       ├── StatsCard.module.scss
│       │       └── StatsCard.test.tsx
│       ├── hooks/useDashboardStats.ts
│       ├── services/dashboard.service.ts
│       └── types/dashboard.types.ts
│
├── shared/
│   ├── components/
│   │   ├── Button/
│   │   ├── Navbar/          ← dark mode toggle lives here (A10)
│   │   ├── Sidebar/         ← config-driven (A13)
│   │   ├── Toast/
│   │   ├── Modal/
│   │   ├── EmptyState/      ← used by every table/list (A11)
│   │   └── ErrorState/
│   ├── hooks/
│   └── utils/
│
├── services/
│   ├── api-client.ts
│   └── endpoints.ts
├── config/
│   └── environment.ts       ← mock/real API switch (B2)
├── mocks/
│   ├── auth.mock.json
│   └── dashboard.mock.json
├── assets/
│   ├── icons/                ← SVGs (A8)
│   └── images/               ← WebP photos (A8)
├── styles/
│   └── globals.scss         ← design tokens + dark mode variables (A7, A10)
├── routes/
│   └── AppRoutes.tsx
└── main.tsx
```

`LoginForm` stays inside `auth/components` because only the login page uses it. `Button` and `Navbar` live in `shared/components` because they're used by both `auth` and `dashboard` — and every other module we add later.

## B5. Our Actual Entities — Lead Partner & Borrower

> **Designer's note:** this app has two genuinely different user experiences, not two features of the same experience — different login method, different layout, and Borrower never gets a dashboard at all. When that's true, the split has to happen *above* `modules/`, not inside it. Treating them as regular sibling modules (like `auth`/`dashboard` above) would eventually force one shared navbar, one shared auth service, and one shared layout to awkwardly handle two unrelated flows.

**Naming:** use `lead-partner` and `borrower`, not abbreviations like `LP`. Full words cost nothing in a folder name and remove any ambiguity for a new developer opening the repo.

```
src/
├── modules/
│   ├── lead-partner/
│   │   ├── auth/                       ← LP login (session/password)
│   │   │   ├── pages/LoginPage/
│   │   │   ├── components/LoginForm/
│   │   │   ├── services/auth.service.ts
│   │   │   └── schemas/login.schema.ts
│   │   │
│   │   ├── dashboard/
│   │   │   ├── pages/DashboardPage/
│   │   │   └── components/
│   │   │
│   │   └── leads/                      ← "create lead for loan" — minimal borrower detail
│   │       ├── pages/CreateLeadPage/
│   │       ├── components/LeadForm/
│   │       ├── services/leads.service.ts
│   │       └── schemas/lead.schema.ts
│   │
│   └── borrower/
│       ├── auth/                       ← mobile OTP login only
│       │   ├── pages/OtpLoginPage/
│       │   ├── components/OtpForm/
│       │   └── services/otpAuth.service.ts
│       │
│       └── loan-application/           ← the full form filled after opening the link
│           ├── pages/LoanApplicationPage/
│           ├── components/LoanApplicationForm/
│           ├── services/loanApplication.service.ts
│           └── schemas/loanApplication.schema.ts
│           (no dashboard folder — it doesn't exist for this entity, don't scaffold a placeholder for it)
│
├── shared/
│   ├── layouts/
│   │   ├── LeadPartnerLayout/          ← navbar + sidebar + dark mode toggle, wraps all LP pages
│   │   └── BorrowerLayout/             ← minimal shell: logo + form container, no nav
│   └── components/                     ← only things genuinely shared by BOTH entities
│       ├── Button/
│       ├── Input/
│       ├── Toast/
│       ├── Modal/
│       └── OtpInput/
│
├── routes/
│   ├── AppRoutes.tsx                   ← top-level split between the two portals
│   ├── LeadPartnerRoutes.tsx           ← behind session/auth guard
│   └── BorrowerRoutes.tsx              ← behind link-token guard, e.g. /apply/:leadId
```

**Why the split happens where it does:**

- **Layout, not just components, differs.** LP keeps a persistent navbar/sidebar/dark-mode toggle across every screen (A10); Borrower is a single-purpose form flow and should feel lightweight — one shell, not the full app chrome. That's why there are two entries under `shared/layouts` instead of one `MainLayout` with conditionals inside it.
- **Auth is two real services, not one with branching logic.** LP is session/password-based; Borrower is OTP plus a lead-specific link token. Keeping `lead-partner/auth` and `borrower/auth` separate avoids one auth service trying to serve two unrelated flows.
- **`leads` and `loan-application` are related but distinct.** LP creates a lead with minimal borrower info; Borrower later fills the full application against that lead. Different forms, different validation depth (A15) — so they're separate modules even though they're two ends of one business process.
- **`shared/components` stays strict.** Only things like `Button`, `Input`, `OtpInput` belong there — genuinely used by both entities. Anything LP-specific (e.g. a lead status badge) stays inside `lead-partner/`, following the same promotion rule from A2: build it where it's used first, promote it to shared only when a second entity actually needs it.
- **Routing enforces the boundary too.** `LeadPartnerRoutes` sits behind a session guard; `BorrowerRoutes` sits behind whatever token arrives via the link — the two never share a guard or touch each other's session state.

If a third entity is added later (e.g. an internal Ops/Admin portal), it follows the same pattern: another folder under `modules/`, its own `auth`, its own layout, its own feature modules underneath.
