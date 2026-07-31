# CreditGenAI Borrower Onboarding API Endpoints & Data Contracts

## Purpose

This document provides complete API specifications, JSON data schemas, HTTP request/response payloads, and parameter validation rules for backend integration of the **CreditGenAI v5 Borrower Onboarding & Loan Application Journey**. 

Every required input field captured across the multi-step frontend is systematically mapped to corresponding backend RESTful endpoints to facilitate automated KYC checks, credit scoring, underwriting filtering, and DSA distribution.

---

## API Summary & Flow Architecture

```text
POST /api/v1/auth/send-otp                  -> Step 0: Mobile OTP Delivery
POST /api/v1/auth/verify-otp                -> Step 0: OTP & Legal Consent Verification
POST /api/v1/onboarding/personal-details    -> Step 1: Personal & Identity Details Submission
POST /api/v1/onboarding/employment-loan     -> Step 2: Employment, Income & Loan Sizing Parameters
POST /api/v1/onboarding/upload-document     -> Step 3: Instant Document & Split Aadhaar Upload (Optional / Deferrable)
POST /api/v1/onboarding/defer-documents     -> Step 3: Record "Upload Later" Choice (Optional Pathway)
POST /api/v1/onboarding/submit-application  -> Step 4/5: Final Application Confirmation & Reference ID Generation
```

---

# 1. Authentication & Legal Consent APIs

## 1.1 Initiate Mobile OTP Delivery

Triggers a 6-digit one-time password (OTP) directly to the applicant's verified 10-digit mobile device.

- **Method:** `POST`
- **Endpoint:** `/api/v1/auth/send-otp`
- **Headers:** `Content-Type: application/json`

### Request Payload (JSON)
```json
{
  "mobile_number": "9876543210"
}
```

### Parameter Validation Rules
| Field | Required | Type | Validation & Formatting Constraint |
|---|---|---|---|
| `mobile_number` | Yes | String | Exactly 10 numeric digits (`/^\d{10}$/`). Strips non-digits. |

### Response Payloads
- **200 OK (Success):**
  ```json
  {
    "success": true,
    "message": "OTP successfully transmitted to verified mobile number.",
    "transaction_id": "txn_884920194",
    "expires_in_seconds": 300
  }
  ```
- **400 Bad Request (Invalid Number):**
  ```json
  {
    "success": false,
    "error_code": "ERR_INVALID_MOBILE",
    "message": "Invalid mobile number format. Must contain exactly 10 digits."
  }
  ```

---

## 1.2 Verify OTP & Register Legal Consent

Validates the 6-digit OTP code and records mandatory legal agreement for credit bureau checks, KYC matching, and terms of service.

- **Method:** `POST`
- **Endpoint:** `/api/v1/auth/verify-otp`
- **Headers:** `Content-Type: application/json`

### Request Payload (JSON)
```json
{
  "transaction_id": "txn_884920194",
  "mobile_number": "9876543210",
  "otp_code": "482910",
  "consent_accepted": true,
  "consent_timestamp": "2026-07-25T03:32:00Z"
}
```

### Parameter Validation Rules
| Field | Required | Type | Validation & Formatting Constraint |
|---|---|---|---|
| `transaction_id` | Yes | String | Unique reference identifier generated during send-otp execution. |
| `mobile_number` | Yes | String | Exact 10-digit numerical contact number. |
| `otp_code` | Yes | String | Exactly 6 characters corresponding to the inputs from `.otp-box`. |
| `consent_accepted` | Yes | Boolean | Must be strictly set to `true` (mirrors `#otpConsentCheck`). |
| `consent_timestamp` | Yes | String (ISO 8601) | Timestamp indicating precise instant legal terms were acknowledged. |

### Response Payloads
- **200 OK (Success):**
  ```json
  {
    "success": true,
    "message": "Mobile verification completed and legal consent recorded.",
    "borrower_id": "usr_993820101",
    "session_token": "eyJhbGciOiJIUzI1NiJ9.eyJ1c3JfaWQiOiJ1c3JfOT..."
  }
  ```
- **401 Unauthorized (Invalid OTP or Unchecked Consent):**
  ```json
  {
    "success": false,
    "error_code": "ERR_CONSENT_MISSING",
    "message": "Legal consent for Bureau check must be accepted to proceed."
  }
  ```

---

# 2. Step 1: Personal Details & Identity Submission API

## 2.1 Submit Personal & KYC Details

Registers verified identification names, email, gender, date of birth (verifying the required 21–60/65 age policy limit), PAN card syntax, and geographic PIN code residence details. All fields in this endpoint are strictly required.

- **Method:** `POST`
- **Endpoint:** `/api/v1/onboarding/personal-details`
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer <session_token>`

### Request Payload (JSON)
```json
{
  "borrower_id": "usr_993820101",
  "first_name": "RAJESH",
  "middle_name": "KUMAR",
  "last_name": "SHARMA",
  "email": "rajesh.sharma@example.com",
  "gender": "Male",
  "date_of_birth": "15 / 08 / 1988",
  "pan_number": "ABCDE1234F",
  "pin_code": "560001",
  "city": "Bengaluru",
  "state": "Karnataka"
}
```

### Parameter Validation Rules
| Field | Required | Type | Validation & Formatting Constraint |
|---|---|---|---|
| `borrower_id` | Yes | String | Valid user reference identifier from OTP verification step. |
| `first_name` | Yes | String | Min 2 chars; letters, spaces, hyphens, apostrophes only (`/^[A-Za-z \-']+$/`). |
| `middle_name` | Yes | String | Mandatory middle legal name; matching regex `/^[A-Za-z \-']+$/`. |
| `last_name` | Yes | String | Min 1 char; surname matching regex `/^[A-Za-z \-']+$/`. |
| `email` | Yes | String | Standard electronic mail format (`@` and domain checking). |
| `gender` | Yes | String | Enum: `"Male" | "Female" | "Other"`. |
| `date_of_birth` | Yes | String | Format: `DD / MM / YYYY`. Applicant age must evaluate between **21 and 60/65 years old**. |
| `pan_number` | Yes | String | Uppercase 10 alphanumeric characters matching `/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/` (`5 letters + 4 digits + 1 letter`). |
| `pin_code` | Yes | String | Exactly 6 numerical characters (`/^\d{6}$/`). |
| `city` | Yes | String | Read-only city string populated via India Postal PIN Code API. |
| `state` | Yes | String | Read-only regional state populated via India Postal PIN Code API. |

### Response Payloads
- **200 OK (Success):**
  ```json
  {
    "success": true,
    "message": "Personal details recorded successfully. PAN format verified.",
    "step_completed": 1,
    "next_step": "employment_and_loan_details"
  }
  ```
- **422 Unprocessable Entity (Age Out of Range / Invalid PAN):**
  ```json
  {
    "success": false,
    "error_code": "ERR_AGE_CRITERIA_FAILED",
    "message": "Applicant age must be between 21 and 65 years to qualify for loan products."
  }
  ```

---

# 3. Step 2: Employment Profile & Loan Financials API

## 3.1 Submit Employment Profile & Financial Metrics

Submits occupational parameters, dynamic employer attributes, income capacity, existing liabilities, requested capital amount, purpose category, and estimated monthly EMI figures. Every field applicable to the selected employment profile is required.

- **Method:** `POST`
- **Endpoint:** `/api/v1/onboarding/employment-loan-details`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <session_token>`

### Request Payload — Scenario A: Salaried Employee (Government Sector)
```json
{
  "borrower_id": "usr_993820101",
  "employment_type": "Salaried",
  "employee_sector": "Government",
  "organization_name": "State Bank of India (SBI)",
  "company_name": null,
  "company_experience": null,
  "self_employed_status": null,
  "total_experience": null,
  "monthly_income": 85000,
  "existing_emi": 15000,
  "requested_loan_amount": 500000,
  "loan_purpose": "Personal / Home Improvement",
  "other_purpose_notes": null,
  "loan_tenure_months": 36,
  "calculated_estimated_emi": 16442
}
```

### Request Payload — Scenario B: Self-Employed with "Other" Loan Purpose
```json
{
  "borrower_id": "usr_993820101",
  "employment_type": "Self-Employed",
  "employee_sector": null,
  "organization_name": null,
  "company_name": null,
  "company_experience": null,
  "self_employed_status": "Sole Proprietor / Business Owner",
  "total_experience": "5-10 Years",
  "monthly_income": 120000,
  "existing_emi": 0,
  "requested_loan_amount": 1200000,
  "loan_purpose": "Other",
  "other_purpose_notes": "Capital expenditure for purchasing commercial workshop equipment.",
  "loan_tenure_months": 60,
  "calculated_estimated_emi": 26693
}
```

### Parameter Validation & Dynamic Rules
| Field | Required | Type | Validation & Dynamic Constraints |
|---|---|---|---|
| `borrower_id` | Yes | String | Authenticated user reference identifier. |
| `employment_type` | Yes | String | Enum: `"Salaried" | "Self-Employed"`. Configures validation on dependent fields. |
| `employee_sector` | Conditional (Yes if Salaried) | String | Enum: `"Private Sector" | "Government Sector"`. |
| `organization_name` | Conditional (Yes if Government) | String | Public department or institution captured from autocomplete dropdown / write-in. |
| `company_name` | Conditional (Yes if Private) | String | Name of corporate employer in Private Sector. |
| `company_experience` | Conditional (Yes if Private) | String | Current corporate tenure (e.g., `"1 to 2 years"`, `"3 to 5 years"`). |
| `self_employed_status` | Conditional (Yes if Self-Employed)| String | Enum: `"Sole Proprietor / Business Owner" | "Partnership Firm" | "Pvt Ltd Director" | "Freelancer / Consultant"`. |
| `total_experience` | Conditional (Yes if Self-Employed)| String | Overall business operating tenure (`"Less than 1 Year"` up to `"10+ Years"`). |
| `monthly_income` | Yes | Integer | Minimum value of `0`. Represents monthly net take-home salary or average business revenue. |
| `existing_emi` | Yes | Integer | Minimum value of `0`. Measures existing debt obligations for Debt-To-Income calculations. |
| `requested_loan_amount` | Yes | Integer | Synchronized between numeric box and slider. Capital requested for borrowing. |
| `loan_purpose` | Yes | String | Enum matching dropdown list (e.g., `"Debt Consolidation"`, `"Medical Emergency"`, `"Other"`). |
| `other_purpose_notes` | Conditional (Yes if Purpose is 'Other')| String | Explicit narrative write-in specifying exact utilization of funds. |
| `loan_tenure_months` | Yes | Integer | Enum values in months: `12 | 24 | 36 | 48 | 60 | 72 | 84`. |
| `calculated_estimated_emi`| Yes | Integer | Expected monthly repayment figure computed via front-end amortization engine. |

### Response Payloads
- **200 OK (Success):**
  ```json
  {
    "success": true,
    "message": "Financial metrics and employment profile logged successfully.",
    "dti_ratio": 0.37,
    "underwriting_tier": "Tier_1_Pre_Qualified",
    "step_completed": 2,
    "next_step": "document_upload_gateway"
  }
  ```

---

# 4. Step 3: Document Upload APIs (Optional / Deferrable)

While all form data inputs in Steps 1 and 2 are strictly mandatory, document upload attachments are optional during initial intake because borrowers are provided with the flexiblity to choose the **"Upload Later"** pathway.

---

## 4.1 Upload Document File (Instant Mode)

Receives file binaries for KYC identity validation and income proof. Accommodates single file drops and independent split uploads for Aadhaar Front Side and Aadhaar Back Side.

- **Method:** `POST`
- **Endpoint:** `/api/v1/onboarding/upload-document`
- **Headers:**
  - `Content-Type: multipart/form-data`
  - `Authorization: Bearer <session_token>`

### Request Parameters (Multipart Form-Data)
| Parameter Name | Required | Type | Valid Values & File Constraints |
|---|---|---|---|
| `borrower_id` | Yes | String | Authenticated user reference identifier. |
| `document_type` | Yes | String | Enum: `"pan" | "aadhaar_front" | "aadhaar_back" | "salary_slips" | "bank_statement"`. |
| `file` | Yes (for this call) | Binary | File attachment. Allowed MIME types: `.pdf, .jpg, .jpeg, .png`. Maximum size: **10 MB** (`10 * 1024 * 1024` bytes). |

### Response Payloads
- **200 OK (Upload Success):**
  ```json
  {
    "success": true,
    "document_id": "doc_44810294",
    "document_type": "aadhaar_front",
    "file_name": "Aadhaar_Front_Copy.jpg",
    "file_size_bytes": 245102,
    "upload_status": "Uploaded",
    "ocr_verification_status": "Pending_Processing"
  }
  ```
- **413 Payload Too Large / 415 Unsupported Media Type:**
  ```json
  {
    "success": false,
    "error_code": "ERR_FILE_TOO_LARGE",
    "message": "File is too large. Max 10MB allowed per document."
  }
  ```

---

## 4.2 Record Deferred Upload Choice ("Upload Later")

Logs the borrower's decision to bypass instant file uploading and submit required KYC/financial documentation at a future date via their customer portal.

- **Method:** `POST`
- **Endpoint:** `/api/v1/onboarding/defer-documents`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <session_token>`

### Request Payload (JSON)
```json
{
  "borrower_id": "usr_993820101",
  "is_uploaded_later": true,
  "pending_documents_list": [
    "PAN Card",
    "Aadhaar Card (Front & Back)",
    "Latest 3 Months Salary Slips",
    "Last 6 Months Salary Bank Statement"
  ]
}
```

### Response Payloads
- **200 OK (Success):**
  ```json
  {
    "success": true,
    "message": "Document submission deferred. All items flagged as 'To be uploaded later' in review engine."
  }
  ```

---

# 5. Step 4 & 5: Final Review & Application Submission API

## 5.1 Submit Verified Application & Generate Reference ID

Aggregates personal details, employment metrics, loan financials, and document upload statuses; verifies completion of all required mandatory fields; records the finalized lead into the database; and issues an application tracking reference ID for DSA routing and status monitoring.

- **Method:** `POST`
- **Endpoint:** `/api/v1/onboarding/submit-application`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <session_token>`

### Request Payload (JSON)
```json
{
  "borrower_id": "usr_993820101",
  "final_review_accepted": true,
  "client_timestamp": "2026-07-25T03:35:00Z"
}
```

### Parameter Validation Rules
| Field | Required | Type | Validation & Formatting Constraint |
|---|---|---|---|
| `borrower_id` | Yes | String | Authenticated user reference identifier. |
| `final_review_accepted` | Yes | Boolean | Must be strictly `true` confirming verification on Step 4 review screen. |
| `client_timestamp` | Yes | String (ISO 8601)| Exact transmission timestamp of form submission. |

### Response Payloads
- **201 Created (Success & Application Logged):**
  ```json
  {
    "success": true,
    "message": "Loan application successfully logged and routed to underwriting engine.",
    "application_reference_id": "CR-APP-2026-88491",
    "borrower_status": "Application Submitted",
    "underwriting_status": "Eligibility Check in Progress",
    "expected_sla_hours": 24,
    "action_required": "None - Advisor will contact shortly"
  }
  ```
- **400 Bad Request (Incomplete Required Profile Fields):**
  ```json
  {
    "success": false,
    "error_code": "ERR_INCOMPLETE_PROFILE",
    "message": "Cannot submit application. Required parameter 'monthly_income' is missing or malformed."
  }
  ```
