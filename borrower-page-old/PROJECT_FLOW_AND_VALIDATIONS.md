# CreditGenAI Borrower Application Flow and Document Validation Checklist

## Purpose

This document explains the step-by-step application flow, field validations, business rules, document collection checklist, and error messages for the CreditGenAI v5 Onboarding Journey before submitting the verified lead to the underwriting engine and DSA partners.

---

## Complete Borrower Flow

```text
Pre-Onboarding Authentication
   ↓
OTP & Legal Consent Verification
   ↓
Step 1: Personal Details (Name, PAN, Custom DOB Picker, PIN Code API)
   ↓
Step 2: Employment Profile (Salaried vs Self-Employed Layout Toggles)
   ↓
Loan Sizing & EMI Estimation (Slider, Live Number-to-Words & Calculator)
   ↓
Step 3: Document Upload Gateway (Upload Now vs Upload Later Choice)
   ↓
Split Document Processing (Aadhaar Front & Back, PAN, Salary Slips, Bank Statements)
   ↓
Step 4: Application Review & Pending Documents Checklist
   ↓
Step 5: Application Confirmation & Tracking Timeline
```

---

# 1. Pre-Onboarding Authentication

## Purpose

To verify that the applicant possesses an active mobile number and grants explicit legal consent before accessing the core loan application.

## Details to Collect

| Field | Required | Purpose |
|---|---|---|
| Mobile Number (`#authMobileInput`) | Yes | Primary communication and identity verification |
| OTP Verification (`.otp-box`) | Yes | Proof of mobile number possession |
| OTP Consent Checkbox (`#otpConsentCheck`) | Yes | Legal agreement for bureau checks and terms of service |

## Rules

- Mobile number input is strictly restricted to numerical characters and limited to exactly 10 digits. Must start with a digit between 6 and 9 (Regex: `/^[6-9]\d{9}$/`).
- 6 OTP boxes auto-focus sequentially upon individual character insertion.
- Application progress to Step 1 is restricted until the OTP is completely entered and the consent checkbox is explicitly selected.
- Clicking legal policy terms opens interactive details modals; accepting terms auto-selects the consent checkbox.

## Error Messages

| Situation | Message / Visual State |
|---|---|
| Incomplete Mobile Number | Button execution restricted; input highlighted |
| Incomplete OTP | Submission blocked until all 6 digit slots are populated |
| Consent Missing | Borrower cannot proceed without accepting required legal terms |

---

# 2. Step 1: Personal Details

## Purpose

To collect validated identification and geo-location details that accurately match official KYC records (PAN, Aadhaar, and Bureau profiles). Every input field in this stage is strictly required.

## Details to Collect

| Field | Required | Purpose |
|---|---|---|
| First Name (`#firstName`) | Yes | Given legal name matching PAN/Aadhaar |
| Middle Name (`#middleName`) | Yes | Middle legal name |
| Last Name (`#lastName`) | Yes | Family name / surname |
| Mobile Number (`#mobile`) | Yes | Verified phone contact (read-only pre-fill) |
| Email Address (`#email`) | Yes | Digital notifications and loan contract delivery |
| Gender (`name="gender"`) | Yes | Demographic profile data |
| Date of Birth (`#dobInput`) | Yes | Age validation and bureau KYC matching (Loan products often require applicant age between 21–60/65 years) |
| PAN Number (`#panNumber`) | Yes | Credit score retrieval and tax identification |
| PIN Code (`#pinCode`) | Yes | Geographic availability check and residential autofill |
| City (`#city`) | Yes | Serviceable city location (read-only autofill) |
| State (`#state`) | Yes | State regional eligibility (read-only autofill) |

## PAN Validation

PAN format should be:

```text
ABCDE1234F
```

Pattern:

```text
5 letters + 4 digits + 1 letter
```

## Validations & Rules

| Field | Validation |
|---|---|
| First Name | Minimum 2 characters; letters, spaces, hyphens, and apostrophes only (`/^[A-Za-z \-']+$/`) |
| Middle Name | Maximum 50 characters; letters, spaces, hyphens, and apostrophes only (`/^[A-Za-z \-']+$/`) |
| Last Name | Minimum 1 character; letters, spaces, hyphens, and apostrophes only (`/^[A-Za-z \-']+$/`) |
| Email Address | HTML5 standard valid electronic mail format |
| Date of Birth | Custom interactive mobile-friendly calendar popup; output formatted as `DD / MM / YYYY`. **Note:** Loan products often require applicant age between 21–60/65 years old to meet underwriting credit criteria. |
| PAN Number | Exactly 10 characters; automatically converted to uppercase matching regex `/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/` (`5 letters + 4 digits + 1 letter`) |
| PIN Code | Exactly 6 numeric digits; automatic stripping of non-digits (`/[^0-9]/g`) |
| City & State | Automatically populated by India Postal PIN Code API upon entering 6 digits; read-only |
| Form Progression | "Continue" button validates all required fields; missing fields are highlighted in red with inline error messages; viewport auto-scrolls and focuses on the first invalid field. Progression is blocked until resolved. |

## Error Messages

| Situation | Message |
|---|---|
| Empty First Name | Please enter your first name. |
| First Name Too Short | Please enter a valid first name. |
| Invalid First Name Characters | First name must contain only valid characters. |
| Invalid Middle Name Characters | Middle name must contain only valid characters. |
| Empty Last Name | Please enter your last name. |
| Last Name Too Short | Please enter a valid last name. |
| Invalid Last Name Characters | Last name must contain only valid characters. |
| Invalid PAN | Please enter a valid PAN number (Format: ABCDE1234F). |
| PIN Code API Loading | Fetching City & State... |
| PIN Code Found (Success) | ✓ Address details found |
| Invalid PIN Code / NotFound | Invalid PIN Code. Please enter a valid 6-digit Indian PIN Code. |

---

# 3. Step 2: Employment Details

## Purpose

To capture occupational information and analyze employment stability to tailor the underwriting and document verification process. All field inputs displayed for the selected employment category are required.

## Details to Collect

| Field | Required | Purpose |
|---|---|---|
| Employment Type (`name="empType"`) | Yes | Configures required income proofs and layout |
| Employee Sector (`#employeeSector`) | Yes | Distinguishes Private Corporate vs Government risk |
| Organization / Employer (`#orgEmployerInput`) | Yes | Verifies public sector employment designation |
| Company Name (`#companyName`) | Yes | Records corporate employer name in Private Sector |
| Company Experience (`#companyExperience`) | Yes (Private only) | Assesses job stability and current employer tenure (Hidden for Government sector) |
| Self-Employed Status (`#employmentStatus`) | Yes | Identifies business format (Sole Proprietor, Director, etc.) |
| Total Experience (`#totalExperience`) | Yes | Evaluates business lifespan and industry tenure |

## Employment Type Options

- Salaried (`#empSalaried`)
- Self-Employed (`#empSelfEmployed`)

## Employee Sector Options (Salaried)

- Private Sector
- Government Sector

## Self-Employed Status Options

- Sole Proprietor / Business Owner
- Partnership Firm
- Pvt Ltd Director
- Freelancer / Consultant

## Rules

- Toggling Employment Type dynamically modifies visible field configurations:
  - **Salaried Mode**: Reveals Sector Group, changes income label to *"Take-Home Salary"*, and hides Self-Employed inputs.
  - **Self-Employed Mode**: Reveals Business Status and Total Experience dropdowns, changes income label to *"Average Monthly Income"*, and hides salaried employer dropdowns.
- Toggling Sector to **Government** marks Organization / Employer (`#orgEmployerInput`) as mandatory (`required`), and hides private corporate textboxes and Company Experience.
- **Organization Autocomplete**: Offers real-time predictive matching against a curated database of 42+ recognized enterprises and professions, featuring an *"Other (Enter Manually)"* bypass option.
- **Form Progression**: "Continue" button strictly blocks progression if required fields for the active layout are empty. Triggers red highlights, inline errors, and auto-focuses the first invalid field.

---

# 4. Step 2: Loan Financials & Live EMI Calculator

## Purpose

To record required financial parameters, dynamically convert numeric currencies into clear English words, and provide real-time EMI estimates for transparent borrowing.

## Details to Collect

| Field | Required | Purpose |
|---|---|---|
| Monthly Income / Take-Home Salary (`#monthlyIncome`) | Yes | Core metric for debt-to-income (DTI) assessment |
| Existing Monthly EMI (`#existingEmi`) | Yes | Measures existing financial obligations and disposable income |
| Required Loan Amount (`#loanAmount`, `#loanAmountSlider`) | Yes | Sets capital requested for borrowing |
| Loan Purpose (`#loanPurpose`) | Yes | Categorizes borrowing goal |
| Other Purpose Details (`#otherLoanPurposeInput`) | Yes | Detailed description if 'Other' purpose is chosen |
| Loan Tenure (`#loanTenure`) | Yes | Repayment duration (12 to 84 Months) |

## Loan Purpose Options

- Personal / Home Improvement
- Debt Consolidation
- Wedding Expenses
- Medical Emergency
- Business Expansion
- Travel / Vacation
- Other

## Loan Tenure Options

- 12 Months (1 Year)
- 24 Months (2 Years)
- 36 Months (3 Years)
- 48 Months (4 Years)
- 60 Months (5 Years)
- 72 Months (6 Years)
- 84 Months (7 Years)

## Validations & Rules

| Field | Validation & System Action |
|---|---|
| Monthly Income | Numeric integer; real-time formatting with Indian commas; renders live text underneath (e.g., *"Rupees Eighty Five Thousand Only"*) |
| Existing EMI | Numeric integer; strips non-digits; defaults to 0 if blank |
| Loan Amount | Two-way synchronization between text input and range slider; live wording conversion (e.g., *"Rupees Five Lakh Only"*) |
| Loan Purpose Toggle | Selecting `"Other"` automatically expands `#other-loan-purpose-group` for explicit write-in notes |
| Live EMI Calculation (`#calcEmiAmount`) | Automatically recalculates monthly payment whenever amount or tenure changes using standard compound interest amortization math |

---

# 5. Step 3: Document Upload Gateway & Choice Engine

## Purpose

To offer a flexible onboarding experience by allowing applicants to upload documents instantly or defer documentation to a later stage without halting initial application submission. Because documents can be deferred, they are the only optional collection elements during initial intake.

## Upload Pathways

| Pathway Option | Required State | System Action & Routing |
|---|---|---|
| Upload Now (`#cardUploadNow`) | Instant Mode | Reveals interactive document file cards; sets `isUploadedLater = false` |
| Upload Later (`#cardUploadLater`) | Deferred Mode | Sets `isUploadedLater = true`; skips upload cards; marks documents as *"To be uploaded later"* on review screen |

---

# 6. Document Collection Details & Split Logic

## Purpose

Documents verify identity, address residency, and financial cash flow. While all previous data fields are mandatory, document files themselves are optional during initial lead generation as borrowers may opt to upload them later. Special interactive split-upload logic ensures accurate dual-sided collection for identification cards.

---

## Documents to Collect

| Document Title | Required | Storage Key | Purpose & Scope |
|---|---|---|---|
| PAN Card (`#card-pan`) | Optional (Can be uploaded later) | `pan` | Official tax identification and credit rating verification |
| Aadhaar Card (Front & Back) (`#card-aadhaar`) | Optional (Can be uploaded later) | `aadhaar` | Permanent residential address proof and legal government ID |
| Latest 3 Months Salary Slips (`#card-salary`) | Optional (Can be uploaded later) | `salary` | Validation of recent employment continuity and income amounts (Accepts 1 to 3 files) |
| Last 6 Months Salary Bank Statement (`#card-bank`) | Optional (Can be uploaded later) | `bank` | Cash flow evaluation, salary crediting check, and obligation scanning |

---

## Document Upload Rules

| Rule | Requirement |
|---|---|
| Allowed File Types | PDF, JPG, JPEG, PNG (`application/pdf`, `image/jpeg`, `image/png`) |
| Maximum File Size | 10 MB per individual document file |
| Interaction Mechanics | Support for Click-to-Browse and visual Drag-and-Drop zones (`.dragover` styling) |
| Progress Feedback | Real-time animated progress bars climbing in 20% steps during asynchronous uploading |
| State Management | Automatic syncing of uploaded file metadata to LocalStorage (`docState`) |
| Aadhaar Split-Upload Logic | Clicking Aadhaar drop zone calls `showAadhaarSplitUpload()`, revealing independent **Front Side** and **Back Side** drop sections |
| Partial Completion Tracking | If only Aadhaar Front or only Aadhaar Back is provided, overarching badge switches to Amber **"Partial"** status |
| Full Completion Tracking | When both Aadhaar sides or individual single cards finish uploading, badge switches to Green **"Uploaded"** status |
| Salary Slips Validation | Supports appending 1 to 3 files. If user is "Salaried", they must upload at least 1 slip to proceed via instant upload. Dynamic badge updates (e.g., `Uploaded (1/3)`). |

## Document Error Messages

| Situation | Message / Status Text |
|---|---|
| Wrong File Type | Invalid format. Only PDF, JPG, PNG allowed. |
| File Too Large (> 10MB) | File is too large. Max 10MB. |
| Aadhaar Partially Uploaded | Badge displays Amber **"Partial"**; description shows *"Front Side Only"* or *"Back Side Only"* |
| Fully Uploaded Status | Badge displays Green **"Uploaded"**; checklist step changes to `.completed` checkmark |

---

# 7. Step 4: Application Review & Confirmation

## Purpose

Before submitting the final loan profile, the review screen aggregates all entered details and checks that all mandatory fields and chosen documents are accounted for.

## Review Summary Mappings

| Review Section | Aggregated Fields Displayed |
|---|---|
| Personal Details | Full Legal Name, Verified Email, Gender, and Formatted Date of Birth (`DD/MM/YYYY`) |
| Employment Profile | Employment Type (Salaried/Self-Employed), Employee Sector, and Organization / Company Name |
| Financial Profile | Monthly Income (with numeric and word representation), and Existing Monthly EMI obligations |
| Loan Requirements | Requested Loan Amount, Loan Purpose, Selected Repayment Tenure, and Estimated EMI |
| Document Statuses | Dedicated verification rows for PAN, Aadhaar (Front & Back), Salary Slips, and Bank Statement |

## Pending Documents Warning Box (`#rev-doc-pending`)

| Assessment Condition | Display Message / Status Text | Visual Styling |
|---|---|---|
| All Documents Fully Uploaded | None (All Documents Uploaded) | Green Success (`#16A34A`) |
| Deferred via Upload Later Route | `{Missing_Doc_List} (To be uploaded later)` | Amber Warning (`#D97706`) |
| Incomplete via Instant Upload | `{Missing_Doc_List}` | Red Alert (`#DC2626`) |

---

# 8. Review Checklist

## Purpose

Before generating an application tracking ID and transmitting details to underwriting or DSA partners, the system confirms that all core checklist requirements are satisfied.

## Review Checklist

| Checklist Item | Required | Verification Method in System |
|---|---|---|
| Basic identity details completed | Yes | Synchronous name regex and input emptiness validation |
| Mobile OTP verified | Yes | Pre-onboarding OTP verification constraint |
| Legal and Bureau check consent accepted | Yes | Explicit checkbox confirmation (`#otpConsentCheck` / `#legalModalConsentCheck`) |
| PAN + DOB submitted | Yes | Custom DOB picker selection (confirming age 21–60/65) and 10-character PAN syntax check |
| City and State serviceability checked | Yes | India Postal PIN Code API automatic city/state lookup |
| Employment profile configured | Yes | Selection of Salaried / Self-Employed with matching required employer inputs |
| Income and EMI financial parameters valid | Yes | Positive integer validation and automated number-to-words transformation |
| Required documents uploaded | Yes or marked pending | LocalStorage `docState` assessment or explicit `isUploadedLater` pathway flag |
| Aadhaar Front & Back consistency verified | Yes | Split upload validation ensuring both sides are supplied before marking fully complete |
| Final review confirmation accepted | Yes | Explicit submission of summary verification form (`#step-4-form`) |
