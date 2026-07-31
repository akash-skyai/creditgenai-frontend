import sys

html_path = "c:/Users/premk/Downloads/v5 final borrower form/v5/index.html"

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

replacements = [
    ('<label>Gender</label>', '<label>Gender<span class="required-asterisk">*</span></label>'),
    ('<label for="pinCode">PIN Code</label>', '<label for="pinCode">PIN Code<span class="required-asterisk">*</span></label>'),
    ('<label for="city">City</label>', '<label for="city">City<span class="required-asterisk">*</span></label>'),
    ('<label for="state">State</label>', '<label for="state">State<span class="required-asterisk">*</span></label>'),
    ('<label>Employment Type</label>', '<label>Employment Type<span class="required-asterisk">*</span></label>'),
    ('<label for="employeeSector">Employee Sector</label>', '<label for="employeeSector">Employee Sector<span class="required-asterisk">*</span></label>'),
    ('<label for="companyName">Company/Organization Name</label>', '<label for="companyName">Company/Organization Name<span class="required-asterisk">*</span></label>'),
    ('<label for="orgEmployerInput">Organization / Employer</label>', '<label for="orgEmployerInput">Organization / Employer<span class="required-asterisk">*</span></label>'),
    ('<label for="companyExperience">Current Company Experience</label>', '<label for="companyExperience">Current Company Experience<span class="required-asterisk">*</span></label>'),
    ('<label for="employmentStatus">Employment Status</label>', '<label for="employmentStatus">Employment Status<span class="required-asterisk">*</span></label>'),
    ('<label for="totalExperience">Total Work Experience</label>', '<label for="totalExperience">Total Work Experience<span class="required-asterisk">*</span></label>'),
    ('<label for="monthlyIncome">Net Monthly Income</label>', '<label for="monthlyIncome">Net Monthly Income<span class="required-asterisk">*</span></label>'),
    ('<label for="loanAmount">Required Loan Amount</label>', '<label for="loanAmount">Required Loan Amount<span class="required-asterisk">*</span></label>'),
    ('<label for="loanPurpose">Loan Purpose</label>', '<label for="loanPurpose">Loan Purpose<span class="required-asterisk">*</span></label>'),
    ('<label for="loanTenure">Tenure (Months)</label>', '<label for="loanTenure">Tenure (Months)<span class="required-asterisk">*</span></label>'),
    ('<label for="existingEmi">Existing Monthly EMI</label>', '<label for="existingEmi">Existing Monthly EMI<span class="required-asterisk">*</span></label>')
]

for old, new in replacements:
    html = html.replace(old, new)

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html)
print("Done")
