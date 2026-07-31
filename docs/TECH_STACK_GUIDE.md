# CreditGenAI Frontend — Technology Stack Guide

This document breaks down the global technology stack used in the CreditGenAI frontend repository, explaining what each tool does and exactly where it belongs in our folder architecture. This guide is designed to help new team members and interns quickly understand how the pieces fit together.

---

## 1. Data Validation & Forms

### **Zod (`zod`)**
- **What it does:** Used for defining strict validation rules (like ensuring a phone number is exactly 10 digits) and inferring safe TypeScript types.
- **Where to find it:** Inside the `schemas/` folder of any feature module.
  - *Example:* `src/modules/borrower/auth/schemas/phone.schema.ts`

### **React Hook Form (`react-hook-form`)**
- **What it does:** Manages form state, tracks when the user is typing, handles form submission, and seamlessly wires up with Zod to display validation errors efficiently without unnecessary re-renders.
- **Where to find it:** Exclusively inside UI components in the `components/` folder.
  - *Example:* `src/modules/borrower/auth/components/phone-form/PhoneForm.tsx`

---

## 2. Network & API Layer

### **Axios (`axios`)**
- **What it does:** The core HTTP client used to send REST requests to the backend server.
- **Where to find it:** Configured globally once in `src/services/api-client.ts`. It is then imported and called by specific feature files in the `services/` folder.
  - *Example:* `src/modules/borrower/auth/services/otp-auth.service.ts`

### **TanStack Query (`@tanstack/react-query`)**
- **What it does:** Manages the loading, error, and success states of all API calls. It handles caching and prevents us from writing messy `useEffect` and `useState` boilerplate code.
- **Where to find it:** Wrapped inside custom hooks in the `hooks/` folder. These hooks are then consumed directly by the React Pages.
  - *Example:* `src/modules/borrower/auth/hooks/useSendOtp.ts`

---

## 3. UI, Styling, & Icons

### **Material-UI (`@mui/material`)**
- **What it does:** The core UI component library providing pre-built, accessible elements like inputs, dropdowns, and buttons.
- **Where to find it:** Imported directly inside `components/` and `pages/`.

### **Lucide React (`lucide-react`)**
- **What it does:** Our official vector icon library (e.g., Lock, BadgeCheck, ShieldCheck). We do not mix this with other icon libraries.
- **Where to find it:** Imported directly inside `components/` or `layouts/`.

### **SCSS Modules (`.module.scss`)**
- **What it does:** Allows us to write custom CSS that is scoped *only* to a specific component, eliminating the risk of styling conflicts across the application.
- **Where to find it:** Sitting directly next to its corresponding React component. Global design tokens (like brand colors) live in `src/styles/globals.scss`.
  - *Example:* `PhoneForm.module.scss` sits exactly next to `PhoneForm.tsx`.

---

## 4. Routing & Structure

### **React Router DOM (`react-router-dom`)**
- **What it does:** Handles client-side navigation between pages (like transitioning from the Phone Entry page to the OTP Verification page) without reloading the browser window.
- **Where to find it:** Configured globally in the `src/routes/` directory.
  - *Examples:* `AppRoutes.tsx` (top level) and `BorrowerRoutes.tsx` (module level).

---

## 5. Testing

### **Vitest & React Testing Library**
- **What it does:** Used to run automated checks ensuring our forms validate properly, buttons trigger correct states, and the UI renders without crashing.
- **Where to find it:** Sibling files ending in `.test.tsx` or `.test.ts`, living right next to the code they are responsible for testing.
  - *Example:* `PhoneForm.test.tsx`

---

## 🏗️ How it all connects in a single flow:

To understand the architecture, follow the data flow of a simple form submission:

1. A user types their data into a UI form (**React Hook Form** + **Material-UI**).
2. The form validates the input automatically against a predefined schema (**Zod**).
3. Upon a valid submission, the form triggers a custom React hook (**TanStack Query**).
4. The hook calls a module-specific service function, which uses the global API client (**Axios**) to securely talk to the backend.
