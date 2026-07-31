import type { PersonalInfoFormData } from '../schemas/personalInfo.schema';

export interface LoanApplicationPayload {
  personalInfo: PersonalInfoFormData;
  // employmentInfo will be added here later
  // loanDetails will be added here later
}
