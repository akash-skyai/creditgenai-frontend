import re

# 1. Update index.html
html_path = "c:/Users/premk/Downloads/v5 final borrower form/v5/index.html"

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

# Insert self-employed-fields-group after sector/company/exp groups in Step 2 Employment Details
old_salaried_block = """                                    <div class="form-group" id="total-exp-group">
                                        <label for="totalExperience">Total Work Experience</label>
                                        <select id="totalExperience" class="form-control">
                                            <option value="" selected>Select Experience</option>
                                            <option value="Less than 1 Year">Less than 1 Year</option>
                                            <option value="1-2 Years">1-2 Years</option>
                                            <option value="2-5 Years">2-5 Years</option>
                                            <option value="5-10 Years">5-10 Years</option>
                                            <option value="10+ Years">10+ Years</option>
                                        </select>
                                        <span id="totalExperienceError" class="error-text hidden"></span>
                                    </div>"""

new_salaried_and_se_block = old_salaried_block + """

                                    <!-- Self-Employed Specific Fields Container -->
                                    <div class="form-group-container hidden full-width" id="self-employed-fields-group" style="grid-column: 1 / -1;">
                                        <div class="form-grid-2">
                                            <div class="form-group">
                                                <label for="businessName">Business Name<span class="required-asterisk">*</span></label>
                                                <input type="text" id="businessName" class="form-control"
                                                    placeholder="Enter your registered business name">
                                                <span id="businessNameError" class="error-text hidden"></span>
                                            </div>

                                            <div class="form-group">
                                                <label for="businessType">Business Type<span class="required-asterisk">*</span></label>
                                                <select id="businessType" class="form-control">
                                                    <option value="" selected>Select Business Type</option>
                                                    <option value="Proprietorship">Proprietorship</option>
                                                    <option value="Partnership">Partnership</option>
                                                    <option value="LLP (Limited Liability Partnership)">LLP (Limited Liability Partnership)</option>
                                                    <option value="Private Limited Company">Private Limited Company</option>
                                                    <option value="One Person Company (OPC)">One Person Company (OPC)</option>
                                                    <option value="Freelancer">Freelancer</option>
                                                    <option value="Professional">Professional</option>
                                                    <option value="Others">Others</option>
                                                </select>
                                                <span id="businessTypeError" class="error-text hidden"></span>
                                            </div>

                                            <div class="form-group hidden full-width" id="otherBusinessTypeGroup" style="grid-column: 1 / -1;">
                                                <label for="otherBusinessTypeInput">Please Specify<span class="required-asterisk">*</span></label>
                                                <input type="text" id="otherBusinessTypeInput" class="form-control"
                                                    placeholder="Enter business type">
                                                <span id="otherBusinessTypeInputError" class="error-text hidden"></span>
                                            </div>

                                            <div class="form-group">
                                                <label for="natureOfBusiness">Nature of Business<span class="required-asterisk">*</span></label>
                                                <select id="natureOfBusiness" class="form-control">
                                                    <option value="" selected>Select Nature of Business</option>
                                                    <option value="Retail">Retail</option>
                                                    <option value="Wholesale">Wholesale</option>
                                                    <option value="Manufacturing">Manufacturing</option>
                                                    <option value="IT & Software Services">IT & Software Services</option>
                                                    <option value="Consulting">Consulting</option>
                                                    <option value="Healthcare / Medical">Healthcare / Medical</option>
                                                    <option value="Education">Education</option>
                                                    <option value="Construction">Construction</option>
                                                    <option value="Real Estate">Real Estate</option>
                                                    <option value="Transportation & Logistics">Transportation & Logistics</option>
                                                    <option value="Hospitality">Hospitality</option>
                                                    <option value="Food & Beverage">Food & Beverage</option>
                                                    <option value="Agriculture">Agriculture</option>
                                                    <option value="E-commerce">E-commerce</option>
                                                    <option value="Freelancer">Freelancer</option>
                                                    <option value="Professional Services">Professional Services</option>
                                                    <option value="Others">Others</option>
                                                </select>
                                                <span id="natureOfBusinessError" class="error-text hidden"></span>
                                            </div>

                                            <div class="form-group hidden full-width" id="otherNatureOfBusinessGroup" style="grid-column: 1 / -1;">
                                                <label for="otherNatureOfBusinessInput">Please Specify<span class="required-asterisk">*</span></label>
                                                <input type="text" id="otherNatureOfBusinessInput" class="form-control"
                                                    placeholder="Enter nature of business">
                                                <span id="otherNatureOfBusinessInputError" class="error-text hidden"></span>
                                            </div>

                                            <div class="form-group">
                                                <label for="businessVintage">Business Vintage<span class="required-asterisk">*</span></label>
                                                <select id="businessVintage" class="form-control">
                                                    <option value="" selected>Select Business Vintage</option>
                                                    <option value="Less than 1 Year">Less than 1 Year</option>
                                                    <option value="1 to 2 Years">1 to 2 Years</option>
                                                    <option value="2 to 3 Years">2 to 3 Years</option>
                                                    <option value="3 to 5 Years">3 to 5 Years</option>
                                                    <option value="5 to 10 Years">5 to 10 Years</option>
                                                    <option value="More than 10 Years">More than 10 Years</option>
                                                </select>
                                                <span id="businessVintageError" class="error-text hidden"></span>
                                            </div>

                                            <div class="form-group">
                                                <label for="monthlyBusinessIncome">Monthly Business Income<span class="required-asterisk">*</span></label>
                                                <div class="input-wrapper has-prefix">
                                                    <span class="input-prefix">₹</span>
                                                    <input type="tel" inputmode="numeric" id="monthlyBusinessIncome"
                                                        class="form-control" placeholder="Enter monthly business income">
                                                </div>
                                                <span id="monthlyBusinessIncomeError" class="error-text hidden" style="display:block; margin-top:4px;"></span>
                                                <span id="monthlyBusinessIncomeWords" class="amount-in-words hidden"></span>
                                            </div>

                                            <div class="form-group">
                                                <label for="gstNumber">GST Number (Optional)</label>
                                                <input type="text" id="gstNumber" class="form-control"
                                                    placeholder="Enter 15-digit GSTIN (if applicable)" maxlength="15"
                                                    style="text-transform: uppercase;">
                                                <span id="gstNumberError" class="error-text hidden"></span>
                                            </div>

                                            <div class="form-group full-width" style="grid-column: 1 / -1;">
                                                <label for="officeAddress">Office Address<span class="required-asterisk">*</span></label>
                                                <textarea id="officeAddress" class="form-control" rows="3"
                                                    placeholder="Enter full office/business address" style="border-radius: 12px; padding: 12px 16px; font-family: inherit; font-size: 14px; width: 100%; border: 1px solid var(--border-light);"></textarea>
                                                <span id="officeAddressError" class="error-text hidden"></span>
                                            </div>
                                        </div>
                                    </div>"""

html = html.replace(old_salaried_block, new_salaried_and_se_block)

# Insert Annual Turnover field under Loan Details
old_loan_amount_block = """                                    <div class="form-group">
                                        <label for="loanAmount">Required Loan Amount</label>
                                        <div class="input-wrapper has-prefix">
                                            <span class="input-prefix">₹</span>
                                            <input type="tel" inputmode="numeric" id="loanAmount" class="form-control"
                                                placeholder="Enter loan amount">
                                        </div>
                                        <span id="loanAmountError" class="error-text hidden" style="display:block; margin-top:4px;"></span>
                                        <span id="loanAmountWords" class="amount-in-words hidden"></span>
                                    </div>"""

new_loan_amount_and_turnover_block = old_loan_amount_block + """

                                    <div class="form-group hidden" id="annualTurnoverGroup">
                                        <label for="annualTurnover">Annual Turnover<span class="required-asterisk">*</span></label>
                                        <div class="input-wrapper has-prefix">
                                            <span class="input-prefix">₹</span>
                                            <input type="tel" inputmode="numeric" id="annualTurnover" class="form-control"
                                                placeholder="Enter annual turnover">
                                        </div>
                                        <span id="annualTurnoverError" class="error-text hidden" style="display:block; margin-top:4px;"></span>
                                        <span id="annualTurnoverWords" class="amount-in-words hidden"></span>
                                    </div>"""

html = html.replace(old_loan_amount_block, new_loan_amount_and_turnover_block)

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html)

print("Updated index.html with Self-Employed fields.")
