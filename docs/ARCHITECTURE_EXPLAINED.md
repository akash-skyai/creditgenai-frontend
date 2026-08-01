# Architecture Explained: Frames vs. Content

This document explains the core philosophy behind how we structure folders and components in the CreditGenAI frontend. Understanding this will make it much easier to know where to put new code.

The most important concept to understand is the difference between **Layouts** and **Feature Slices** (`auth`, `loan-application`).

---

## 1. The `layouts/` Folder (The "Picture Frame")

Think of the `layouts/` folder as the **picture frame** or the **shell** of your application. 

### What belongs here?
- **Global Wrappers:** The components that wrap around your actual pages.
- **Structural UI:** Things like sidebars, navbars, background gradients, and split-screen columns.
- **Static Content:** Trust badges (RBI logo), marketing copy that sits outside the form, footers.

### What does a Layout look like?
A layout is fundamentally "empty" on the inside. It defines the structure, but leaves a placeholder called `{children}` for React to inject the actual page into.

```tsx
// Example: src/modules/borrower/layouts/borrower-auth-layout/BorrowerAuthLayout.tsx

import type { ReactNode } from 'react';
import { BorrowerNavbar } from '../components/borrower-navbar/BorrowerNavbar';

export function BorrowerAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="layout-wrapper">
      {/* 1. The Global Navbar */}
      <BorrowerNavbar />

      <div className="split-screen">
        {/* 2. The Left Panel (Static Marketing) */}
        <div className="left-panel">
          <h2>Zero hidden fees.</h2>
          <p>RBI Registered Partner</p>
        </div>

        {/* 3. The Right Panel (The Empty Placeholder) */}
        <div className="right-panel">
          {children}  <-- THIS IS THE MAGIC! The actual page gets injected here.
        </div>
      </div>
    </div>
  );
}
```

### What does NOT belong here?
- **No Business Logic:** Layouts should not know anything about forms, validation, OTPs, or API calls.
- **No State:** You rarely see `useState` or `useEffect` in a layout.

---

## 2. Feature Slices (The "Painting")

Feature Slices are folders like `auth/` or `loan-application/`. Think of these as the actual **painting** that goes *inside* the picture frame.

### What belongs here?
- **Pages:** The actual screens the user interacts with (`PhoneEntryPage.tsx`, `PersonalInfoStep.tsx`).
- **Components:** The specific pieces that make up those pages (`OtpForm.tsx`, `PhoneForm.tsx`).
- **Business Logic:** API calls, `react-hook-form` state, Zod validation schemas.

### What does a Page look like?
Pages do **not** define backgrounds or navbars. They just define the inputs and buttons. React takes this component and passes it as the `{children}` to the Layout above.

```tsx
// Example: src/modules/borrower/auth/pages/phone-entry/PhoneEntryPage.tsx

import { useForm } from 'react-hook-form';

export function PhoneEntryPage() {
  const form = useForm();
  
  const onSubmit = (data) => {
    // Call the backend API
    sendOtp(data.phone);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Just the inputs and logic, NO background styling or navbars */}
      <h2>Enter your mobile number</h2>
      <input {...form.register('phone')} />
      <button type="submit">Get OTP</button>
    </form>
  );
}
```

---

## 3. How they connect (The Router)

The Layout and the Page are connected in the Router (`BorrowerRoutes.tsx`). The router says, *"Use the `BorrowerAuthLayout` as the frame, and put the `PhoneEntryPage` inside it."*

```tsx
// Example: src/routes/BorrowerRoutes.tsx

<Route element={<BorrowerAuthLayout />}>          <-- The Frame
  <Route path="login" element={<PhoneEntryPage />} />  <-- The Painting
</Route>
```

---

## 4. Why keep them separate? (Reusability)

If we put the "Frame" (the split-screen design) directly inside `PhoneEntryPage.tsx`, then when we build `OtpVerifyPage.tsx`, we would have to copy and paste the entire split-screen code again. 

By separating them into `layouts/` and `auth/`, we can easily say:
*"Hey Router, wrap both `PhoneEntryPage` AND `OtpVerifyPage` in the exact same `BorrowerAuthLayout`."*

### Summary Rule of Thumb:
- **If it's about WHERE things are drawn** (grids, navbars, max-widths, backgrounds) → `layouts/`
- **If it's about WHAT the user is doing** (typing an OTP, validating an email, submitting a form) → Feature Slice (`auth/` or `loan-application/`)
