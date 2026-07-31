/* ==========================================================================
   CreditGenAI - Onboarding Form Interactive Logic & Stepper Workflow
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 1;

  // DOM Elements
  const stepContent1 = document.getElementById('step-1-content');
  const stepContent2 = document.getElementById('step-2-content');
  const stepContent3 = document.getElementById('step-3-content');
  const stepContent4 = document.getElementById('step-4-content');
  const stepContent5 = document.getElementById('step-5-content');

  const stepperItems = document.querySelectorAll('.stepper-step');
  const stepperProgress = document.getElementById('stepper-progress');

  // Input & Dynamic Control Elements
  const pinInput = document.getElementById('pinCode');
  const cityInput = document.getElementById('city');
  const stateInput = document.getElementById('state');
  const panInput = document.getElementById('panNumber');

  const salariedRadio = document.getElementById('empSalaried');
  const selfEmployedRadio = document.getElementById('empSelfEmployed');
  const sectorGroup = document.getElementById('sector-group');
  const sectorSelect = document.getElementById('employeeSector');

  const companyGroup = document.getElementById('company-group');
  const companyExpGroup = document.getElementById('company-exp-group');
  const govtDeptGroup = document.getElementById('govt-dept-group');
  const selfEmpStatusGroup = document.getElementById('self-emp-status-group');
  const totalExpGroup = document.getElementById('total-exp-group');

  const loanAmountInput = document.getElementById('loanAmount');
  const loanAmountSlider = document.getElementById('loanAmountSlider');
  const loanPurposeSelect = document.getElementById('loanPurpose');
  const otherLoanPurposeGroup = document.getElementById('other-loan-purpose-group');
  const otherLoanPurposeInput = document.getElementById('otherLoanPurposeInput');
  const loanTenureSelect = document.getElementById('loanTenure');
  const monthlyIncomeInput = document.getElementById('monthlyIncome');
  const monthlyIncomeLabel = document.querySelector('label[for="monthlyIncome"]');
  const existingEmiInput = document.getElementById('existingEmi');
  const calcEmiAmount = document.getElementById('calcEmiAmount');

  // PIN Code Database Simulation
  const pinDatabase = {
    '110001': { city: 'New Delhi', state: 'Delhi' },
    '400001': { city: 'Mumbai', state: 'Maharashtra' },
    '560001': { city: 'Bengaluru', state: 'Karnataka' },
    '600001': { city: 'Chennai', state: 'Tamil Nadu' },
    '700001': { city: 'Kolkata', state: 'West Bengal' },
    '500001': { city: 'Hyderabad', state: 'Telangana' },
    '380001': { city: 'Ahmedabad', state: 'Gujarat' },
    '411001': { city: 'Pune', state: 'Maharashtra' },
    '302001': { city: 'Jaipur', state: 'Rajasthan' },
    '201301': { city: 'Noida', state: 'Uttar Pradesh' },
    '122001': { city: 'Gurugram', state: 'Haryana' }
  };

  // Intelligent PIN Code Auto-Fill Controller
  const pinStatusText = document.getElementById('pinStatusText');
  const pinSpinner = document.getElementById('pinSpinner');
  const citySuccessIcon = document.getElementById('citySuccessIcon');
  const stateSuccessIcon = document.getElementById('stateSuccessIcon');

  const pincodeCache = {
    '560001': { city: 'Bengaluru', state: 'Karnataka' },
    '110001': { city: 'New Delhi', state: 'Delhi' },
    '400001': { city: 'Mumbai', state: 'Maharashtra' },
    '600001': { city: 'Chennai', state: 'Tamil Nadu' },
    '700001': { city: 'Kolkata', state: 'West Bengal' },
    '500001': { city: 'Hyderabad', state: 'Telangana' },
    '380001': { city: 'Ahmedabad', state: 'Gujarat' },
    '411001': { city: 'Pune', state: 'Maharashtra' },
    '302001': { city: 'Jaipur', state: 'Rajasthan' },
    '201301': { city: 'Noida', state: 'Uttar Pradesh' },
    '122001': { city: 'Gurugram', state: 'Haryana' },
    '500081': { city: 'Hyderabad', state: 'Telangana' }
  };

  let pinDebounceTimer = null;

  if (pinInput) {
    pinInput.addEventListener('input', (e) => {
      // Restrict to numeric digits only
      const rawVal = e.target.value.replace(/[^0-9]/g, '');
      pinInput.value = rawVal;

      // Clear previous states
      pinInput.classList.remove('is-invalid');
      if (pinStatusText) pinStatusText.className = 'pin-status-text';
      if (pinStatusText) pinStatusText.textContent = '';
      if (pinSpinner) pinSpinner.classList.add('hidden');
      if (citySuccessIcon) citySuccessIcon.classList.add('hidden');
      if (stateSuccessIcon) stateSuccessIcon.classList.add('hidden');

      if (rawVal.length < 6) {
        if (cityInput) cityInput.value = '';
        if (stateInput) stateInput.value = '';
        return;
      }

      if (rawVal.length === 6) {
        fetchPinCodeDetails(rawVal);
      }
    });
  }

  function fetchPinCodeDetails(pin) {
    // Check Cache
    if (pincodeCache[pin]) {
      applyPinSuccess(pincodeCache[pin].city, pincodeCache[pin].state);
      return;
    }

    // Show Loading Spinner & Status Text
    if (pinSpinner) pinSpinner.classList.remove('hidden');
    if (pinStatusText) {
      pinStatusText.className = 'pin-status-text loading';
      pinStatusText.textContent = 'Fetching City & State...';
    }

    if (pinDebounceTimer) clearTimeout(pinDebounceTimer);

    pinDebounceTimer = setTimeout(() => {
      // Fetch from India Postal PIN Code API
      fetch(`https://api.postalpincode.in/pincode/${pin}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
            const po = data[0].PostOffice[0];
            const city = po.District || po.Block || po.Name;
            const state = po.State;
            pincodeCache[pin] = { city, state };
            applyPinSuccess(city, state);
          } else {
            // Fallback rule check
            fallbackPinCheck(pin);
          }
        })
        .catch(() => {
          fallbackPinCheck(pin);
        });
    }, 250);
  }

  function fallbackPinCheck(pin) {
    const firstChar = pin.charAt(0);
    let fallbackCity = '';
    let fallbackState = '';

    if (firstChar === '1') { fallbackCity = 'New Delhi'; fallbackState = 'Delhi'; }
    else if (firstChar === '4') { fallbackCity = 'Mumbai'; fallbackState = 'Maharashtra'; }
    else if (firstChar === '5') { fallbackCity = 'Bengaluru'; fallbackState = 'Karnataka'; }
    else if (firstChar === '6') { fallbackCity = 'Chennai'; fallbackState = 'Tamil Nadu'; }
    else if (firstChar === '7') { fallbackCity = 'Kolkata'; fallbackState = 'West Bengal'; }
    else if (firstChar === '2') { fallbackCity = 'Lucknow'; fallbackState = 'Uttar Pradesh'; }
    else if (firstChar === '3') { fallbackCity = 'Ahmedabad'; fallbackState = 'Gujarat'; }
    else if (firstChar === '8') { fallbackCity = 'Patna'; fallbackState = 'Bihar'; }

    if (fallbackCity && fallbackState) {
      pincodeCache[pin] = { city: fallbackCity, state: fallbackState };
      applyPinSuccess(fallbackCity, fallbackState);
    } else {
      applyPinError();
    }
  }

  function applyPinSuccess(city, state) {
    if (pinSpinner) pinSpinner.classList.add('hidden');
    if (pinInput) pinInput.classList.remove('is-invalid');

    if (cityInput) {
      cityInput.value = city;
      cityInput.classList.add('highlight-fill');
      setTimeout(() => cityInput.classList.remove('highlight-fill'), 500);
    }

    if (stateInput) {
      stateInput.value = state;
      stateInput.classList.add('highlight-fill');
      setTimeout(() => stateInput.classList.remove('highlight-fill'), 500);
    }

    if (citySuccessIcon) citySuccessIcon.classList.remove('hidden');
    if (stateSuccessIcon) stateSuccessIcon.classList.remove('hidden');

    if (pinStatusText) {
      pinStatusText.className = 'pin-status-text success';
      pinStatusText.textContent = '✓ Address details found';
    }
  }

  function applyPinError() {
    if (pinSpinner) pinSpinner.classList.add('hidden');
    if (pinInput) pinInput.classList.add('is-invalid');

    if (cityInput) cityInput.value = '';
    if (stateInput) stateInput.value = '';
    if (citySuccessIcon) citySuccessIcon.classList.add('hidden');
    if (stateSuccessIcon) stateSuccessIcon.classList.add('hidden');

    if (pinStatusText) {
      pinStatusText.className = 'pin-status-text error';
      pinStatusText.textContent = 'Invalid PIN Code. Please enter a valid 6-digit Indian PIN Code.';
    }
  }

  // PAN Auto-Uppercase
  if (panInput) {
    panInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase();
    });
  }

  // Live format currency numbers nicely as user types
  function convertNumberToWords(num) {
    if (num === 0) return 'Zero';
    if (num > 999999999) return ''; // Limit to 99 Crores

    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';

    let str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';

    return 'Rupees ' + str.trim() + ' Only';
  }

  // Live format currency numbers nicely as user types
  const formatMoneyInput = (inputEl, wordsSpanId) => {
    if (!inputEl) return;
    const wordsSpan = wordsSpanId ? document.getElementById(wordsSpanId) : null;

    inputEl.addEventListener('input', (e) => {
      let cursorPosition = inputEl.selectionStart;
      let valBeforeCursor = inputEl.value.substring(0, cursorPosition);
      let digitsBeforeCursor = valBeforeCursor.replace(/[^0-9]/g, '').length;

      const numStr = inputEl.value.replace(/[^0-9]/g, '');
      if (numStr) {
        const num = parseInt(numStr, 10);
        let formattedStr = num.toLocaleString('en-IN');

        if (e.target.type === 'number') {
          e.target.value = num;
        } else {
          e.target.value = formattedStr;
        }

        let newCursorPos = 0;
        let digitsFound = 0;
        for (let i = 0; i < formattedStr.length; i++) {
          if (/[0-9]/.test(formattedStr[i])) {
            digitsFound++;
          }
          if (digitsFound === digitsBeforeCursor) {
            newCursorPos = i + 1;
            break;
          }
        }

        if (e.target.type !== 'number') {
          try {
            inputEl.setSelectionRange(newCursorPos, newCursorPos);
          } catch (err) { }
        }

        if (wordsSpan && num > 0 && num <= 999999999) {
          wordsSpan.textContent = convertNumberToWords(num);
          wordsSpan.classList.remove('hidden');
        } else if (wordsSpan) {
          wordsSpan.classList.add('hidden');
        }
      } else {
        inputEl.value = '';
        if (wordsSpan) wordsSpan.classList.add('hidden');
      }
    });
  };

  formatMoneyInput(loanAmountInput, 'loanAmountWords');
  formatMoneyInput(monthlyIncomeInput, 'monthlyIncomeWords');

  const monthlyBusinessIncomeInput = document.getElementById('monthlyBusinessIncome');
  const annualTurnoverInput = document.getElementById('annualTurnover');
  const gstNumberInput = document.getElementById('gstNumber');
  const businessTypeSelect = document.getElementById('businessType');
  const otherBusinessTypeGroup = document.getElementById('otherBusinessTypeGroup');
  const otherBusinessTypeInput = document.getElementById('otherBusinessTypeInput');
  const natureOfBusinessSelect = document.getElementById('natureOfBusiness');
  const otherNatureOfBusinessGroup = document.getElementById('otherNatureOfBusinessGroup');
  const otherNatureOfBusinessInput = document.getElementById('otherNatureOfBusinessInput');

  formatMoneyInput(monthlyBusinessIncomeInput, 'monthlyBusinessIncomeWords');
  formatMoneyInput(annualTurnoverInput, 'annualTurnoverWords');

  if (gstNumberInput) {
    gstNumberInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.toUpperCase();
    });
  }

  if (businessTypeSelect) {
    businessTypeSelect.addEventListener('change', (e) => {
      if (e.target.value === 'Others') {
        if (otherBusinessTypeGroup) otherBusinessTypeGroup.classList.remove('hidden');
        if (otherBusinessTypeInput) otherBusinessTypeInput.focus();
      } else {
        if (otherBusinessTypeGroup) otherBusinessTypeGroup.classList.add('hidden');
        if (otherBusinessTypeInput) otherBusinessTypeInput.value = '';
      }
    });
  }

  if (natureOfBusinessSelect) {
    natureOfBusinessSelect.addEventListener('change', (e) => {
      if (e.target.value === 'Others') {
        if (otherNatureOfBusinessGroup) otherNatureOfBusinessGroup.classList.remove('hidden');
        if (otherNatureOfBusinessInput) otherNatureOfBusinessInput.focus();
      } else {
        if (otherNatureOfBusinessGroup) otherNatureOfBusinessGroup.classList.add('hidden');
        if (otherNatureOfBusinessInput) otherNatureOfBusinessInput.value = '';
      }
    });
  }
  formatMoneyInput(existingEmiInput);

  // Employment Type Toggle
  if (salariedRadio && selfEmployedRadio) {
    salariedRadio.addEventListener('change', toggleEmploymentFields);
    selfEmployedRadio.addEventListener('change', toggleEmploymentFields);
  }

  function toggleEmploymentFields() {
    const salariedRadio = document.getElementById('empSalaried');
    const sectorGroup = document.getElementById('sector-group');
    const companyGroup = document.getElementById('company-group');
    const companyExpGroup = document.getElementById('company-exp-group');
    const govtDeptGroup = document.getElementById('govt-dept-group');
    const selfEmpStatusGroup = document.getElementById('self-emp-status-group');
    const totalExpGroup = document.getElementById('total-exp-group');
    const monthlyIncomeInput = document.getElementById('monthlyIncome');
    const monthlyIncomeGroup = monthlyIncomeInput ? monthlyIncomeInput.closest('.form-group') : null;
    const selfEmployedFieldsGroup = document.getElementById('self-employed-fields-group');
    const annualTurnoverGroup = document.getElementById('annualTurnoverGroup');

    if (salariedRadio && salariedRadio.checked) {
      if (selfEmployedFieldsGroup) selfEmployedFieldsGroup.classList.add('hidden');
      if (annualTurnoverGroup) annualTurnoverGroup.classList.add('hidden');
      if (selfEmpStatusGroup) selfEmpStatusGroup.classList.add('hidden');

      if (sectorGroup) sectorGroup.classList.remove('hidden');
      if (totalExpGroup) totalExpGroup.classList.remove('hidden');
      if (monthlyIncomeGroup) monthlyIncomeGroup.classList.remove('hidden');

      toggleSectorFields();
    } else {
      if (sectorGroup) sectorGroup.classList.add('hidden');
      if (companyGroup) companyGroup.classList.add('hidden');
      if (companyExpGroup) companyExpGroup.classList.add('hidden');
      if (govtDeptGroup) govtDeptGroup.classList.add('hidden');
      if (selfEmpStatusGroup) selfEmpStatusGroup.classList.add('hidden');
      if (totalExpGroup) totalExpGroup.classList.add('hidden');
      if (monthlyIncomeGroup) monthlyIncomeGroup.classList.add('hidden');

      if (selfEmployedFieldsGroup) selfEmployedFieldsGroup.classList.remove('hidden');
      if (annualTurnoverGroup) annualTurnoverGroup.classList.remove('hidden');
    }

    if (window.updateUploadDocumentList) {
      window.updateUploadDocumentList();
    }
  }

  // Sector Toggle (Private vs Government)
  if (sectorSelect) {
    sectorSelect.addEventListener('change', toggleSectorFields);
  }

  function toggleSectorFields() {
    if (!salariedRadio || !salariedRadio.checked) return;

    if (sectorSelect && sectorSelect.value === 'Government') {
      if (companyGroup) companyGroup.classList.add('hidden');
      if (companyExpGroup) companyExpGroup.classList.add('hidden');
      if (govtDeptGroup) {
        govtDeptGroup.classList.remove('hidden');
        const orgInput = document.getElementById('orgEmployerInput');
        if (orgInput) orgInput.removeAttribute('required');
      }
    } else {
      if (companyGroup) companyGroup.classList.remove('hidden');
      if (companyExpGroup) companyExpGroup.classList.remove('hidden');
      if (govtDeptGroup) {
        govtDeptGroup.classList.add('hidden');
        const orgInput = document.getElementById('orgEmployerInput');
        if (orgInput) orgInput.removeAttribute('required');
      }
    }
  }

  // Organization / Employer Autocomplete
  const orgEmployerInput = document.getElementById('orgEmployerInput');
  const orgEmployerDropdown = document.getElementById('orgEmployerDropdown');

  const orgSuggestions = [
    "Teacher", "Doctor", "Engineer", "Police Officer", "Defence Personnel", "Railway Employee",
    "Banking Employee", "Administrative Officer", "Scientist", "Nurse", "Professor / Lecturer",
    "Pharmacist", "Clerk", "Accountant", "Technician", "Driver", "Office Assistant",
    "Indian Railways", "AIIMS Delhi", "Kendriya Vidyalaya Sangathan (KVS)", "Navodaya Vidyalaya Samiti (NVS)",
    "State Bank of India (SBI)", "Punjab National Bank (PNB)", "Bank of Baroda", "LIC of India",
    "Indian Oil Corporation Limited (IOCL)", "Bharat Petroleum Corporation Limited (BPCL)",
    "Hindustan Petroleum Corporation Limited (HPCL)", "Oil and Natural Gas Corporation (ONGC)",
    "NTPC Limited", "BHEL", "SAIL", "DRDO", "ISRO", "India Post", "Income Tax Department",
    "GST Department", "Municipal Corporation", "Government General Hospital", "Primary Health Centre (PHC)",
    "Government School", "Government College", "Government University"
  ];

  if (orgEmployerInput && orgEmployerDropdown) {
    let currentFocus = -1;

    orgEmployerInput.addEventListener('input', function () {
      const val = this.value;

      if (this.dataset.mode === 'manual') {
        if (!val) {
          // User cleared the input, revert to autocomplete mode
          this.dataset.mode = 'auto';
          this.placeholder = 'Search or enter your organization';
          this.removeAttribute('maxlength');
          const orgLabel = document.querySelector('label[for="orgEmployerInput"]');
          if (orgLabel) orgLabel.textContent = 'Organization / Employer';
        } else {
          // Keep in manual mode, do not show suggestions
          orgEmployerDropdown.classList.add('hidden');
          return;
        }
      }

      orgEmployerDropdown.innerHTML = '';
      currentFocus = -1;

      if (!val) {
        orgEmployerDropdown.classList.add('hidden');
        return;
      }

      orgEmployerDropdown.classList.remove('hidden');

      let matches = 0;
      orgSuggestions.forEach(suggestion => {
        const lowerVal = val.toLowerCase();
        const lowerSugg = suggestion.toLowerCase();
        const index = lowerSugg.indexOf(lowerVal);

        if (index > -1 && matches < 6) {
          const item = document.createElement('div');
          item.className = 'autocomplete-option';

          item.innerHTML = suggestion.substring(0, index) +
            "<strong>" + suggestion.substring(index, index + val.length) + "</strong>" +
            suggestion.substring(index + val.length);

          item.addEventListener('click', function (e) {
            orgEmployerInput.value = suggestion;
            orgEmployerDropdown.classList.add('hidden');
          });
          orgEmployerDropdown.appendChild(item);
          matches++;
        }
      });

      // Always add "Other (Enter Manually)"
      const otherItem = document.createElement('div');
      otherItem.className = 'autocomplete-option autocomplete-option-other';
      otherItem.textContent = 'Other (Enter Manually)';
      otherItem.addEventListener('click', function (e) {
        orgEmployerDropdown.classList.add('hidden');
        orgEmployerInput.dataset.mode = 'manual';
        orgEmployerInput.value = '';
        orgEmployerInput.placeholder = 'Enter your organization';
        orgEmployerInput.setAttribute('maxlength', '100');
        const orgLabel = document.querySelector('label[for="orgEmployerInput"]');
        if (orgLabel) orgLabel.textContent = 'Please specify your organization';
        orgEmployerInput.focus();
      });
      orgEmployerDropdown.appendChild(otherItem);
    });

    orgEmployerInput.addEventListener('keydown', function (e) {
      if (this.dataset.mode === 'manual') return;

      const items = orgEmployerDropdown.querySelectorAll('.autocomplete-option');
      if (items.length === 0 || orgEmployerDropdown.classList.contains('hidden')) return;

      if (e.key === 'ArrowDown') {
        currentFocus++;
        addActive(items);
      } else if (e.key === 'ArrowUp') {
        currentFocus--;
        addActive(items);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentFocus > -1) {
          if (items[currentFocus]) items[currentFocus].click();
        } else if (items.length > 0) {
          items[0].click(); // select first if none focused
        }
      }
    });

    function addActive(items) {
      if (!items) return;
      removeActive(items);
      if (currentFocus >= items.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (items.length - 1);
      items[currentFocus].style.background = '#F3F4F6';
      items[currentFocus].scrollIntoView({ block: 'nearest' });
    }

    function removeActive(items) {
      for (let i = 0; i < items.length; i++) {
        items[i].style.background = '';
      }
    }

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (e.target !== orgEmployerInput && e.target !== orgEmployerDropdown) {
        orgEmployerDropdown.classList.add('hidden');
      }
    });
  }

  // Loan Amount Sync Slider & Input
  if (loanAmountInput && loanAmountSlider) {
    loanAmountInput.addEventListener('input', (e) => {
      const cleanStr = e.target.value.replace(/[^0-9]/g, '');
      const val = parseInt(cleanStr, 10) || 0;
      loanAmountSlider.value = val;
      calculateEMI();
    });

    loanAmountSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10) || 0;
      loanAmountInput.value = val.toLocaleString('en-IN');
      loanAmountInput.dispatchEvent(new Event('input'));
    });
  }

  if (loanTenureSelect) {
    loanTenureSelect.addEventListener('change', calculateEMI);
  }

  if (loanPurposeSelect) {
    loanPurposeSelect.addEventListener('change', (e) => {
      if (e.target.value === 'Other') {
        if (otherLoanPurposeGroup) otherLoanPurposeGroup.classList.remove('hidden');
        if (otherLoanPurposeInput) otherLoanPurposeInput.focus();
      } else {
        if (otherLoanPurposeGroup) otherLoanPurposeGroup.classList.add('hidden');
        if (otherLoanPurposeInput) otherLoanPurposeInput.value = '';
      }
    });
  }

  // EMI Calculator Function
  function calculateEMI() {
    const cleanLoanStr = loanAmountInput.value.replace(/[^0-9]/g, '');
    const P = parseFloat(cleanLoanStr) || 500000;
    const months = parseInt(loanTenureSelect.value, 10) || 36;
    const annualRate = 10.25; // 10.25% standard estimated rate
    const r = (annualRate / 12) / 100;

    const emi = (P * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    if (calcEmiAmount && !isNaN(emi)) {
      calcEmiAmount.textContent = '₹' + Math.round(emi).toLocaleString('en-IN') + '/mo';
    }
  }

  // Stepper Navigation
  window.goToStep = function (step) {
    if (step < 1 || step > 5) return;
    currentStep = step;

    // Toggle Content Views
    if (stepContent1) stepContent1.classList.toggle('active', currentStep === 1);
    if (stepContent2) stepContent2.classList.toggle('active', currentStep === 2);
    if (stepContent3) stepContent3.classList.toggle('active', currentStep === 3);
    if (stepContent4) stepContent4.classList.toggle('active', currentStep === 4);
    if (stepContent5) stepContent5.classList.toggle('active', currentStep === 5);

    // Update Stepper UI Header
    stepperItems.forEach((item, index) => {
      const stepNum = index + 1;
      const circleEl = item.querySelector('.step-circle');
      if (stepNum < currentStep) {
        item.className = 'stepper-step completed';
        if (circleEl) circleEl.innerHTML = '✓';
      } else if (stepNum === currentStep) {
        item.className = 'stepper-step active';
        if (circleEl) circleEl.innerHTML = stepNum;
      } else {
        item.className = 'stepper-step';
        if (circleEl) circleEl.innerHTML = stepNum;
      }
    });

    // Update Stepper Line Progress
    if (stepperProgress) {
      if (currentStep === 1) stepperProgress.style.width = '0%';
      else if (currentStep === 2) stepperProgress.style.width = '33.33%';
      else if (currentStep === 3) stepperProgress.style.width = '66.66%';
      else if (currentStep >= 4) stepperProgress.style.width = '100%';
    }

    // Populate Review Page on Step 4 (Review & Submit)
    if (currentStep === 3) {
      if (window.updateUploadDocumentList) window.updateUploadDocumentList();
      if (window.checkStep3ContinueState) window.checkStep3ContinueState();

      const uploadChoiceView = document.getElementById('uploadChoiceView');
      const uploadFilesSection = document.getElementById('uploadFilesSection');
      if (uploadChoiceView && uploadFilesSection) {
        uploadChoiceView.classList.remove('hidden');
        uploadFilesSection.classList.add('hidden');
        uploadFilesSection.classList.remove('active-user-upload');
      }

      // Real-time synchronization of all form inputs to Review & Submit summary
      const allFormInputs = document.querySelectorAll('#step-1-form input, #step-1-form select, #step-2-form input, #step-2-form select, #step-3-content input, #step-3-content select');
      allFormInputs.forEach(inputEl => {
        ['input', 'change', 'blur'].forEach(evtType => {
          inputEl.addEventListener(evtType, () => {
            if (typeof populateReviewSummary === 'function') {
              populateReviewSummary();
            }
          });
        });
      });
    }
    if (currentStep === 4) {
      localStorage.setItem('hasReachedStep4', 'true');
      populateReviewSummary();
    }

    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Name Validation Logic
  function validateNameField(input, isRequired, minLen, errorSpanId, fieldName) {
    if (!input) return true;
    const errorSpan = document.getElementById(errorSpanId);
    const val = input.value.trim();

    if (isRequired && val.length === 0) {
      if (errorSpan) {
        errorSpan.textContent = `Please enter your ${fieldName.toLowerCase()}.`;
        errorSpan.classList.remove('hidden');
      }
      input.classList.add('is-invalid');
      return false;
    }

    if (!isRequired && val.length === 0) {
      if (errorSpan) errorSpan.classList.add('hidden');
      input.classList.remove('is-invalid');
      return true;
    }

    if (val.length > 0 && val.length < minLen) {
      if (errorSpan) {
        errorSpan.textContent = `Please enter a valid ${fieldName.toLowerCase()}.`;
        errorSpan.classList.remove('hidden');
      }
      input.classList.add('is-invalid');
      return false;
    }

    const regex = /^[A-Za-z \-']+$/;
    if (val.length > 0 && !regex.test(val)) {
      if (errorSpan) {
        errorSpan.textContent = `${fieldName} must contain only valid characters.`;
        errorSpan.classList.remove('hidden');
      }
      input.classList.add('is-invalid');
      return false;
    }

    if (errorSpan) errorSpan.classList.add('hidden');
    input.classList.remove('is-invalid');
    return true;
  }

  function setupNameField(inputId, isRequired, minLen, errorSpanId, fieldName) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('input', function () {
      let oldVal = this.value;
      let newVal = oldVal.replace(/\s{2,}/g, ' ');
      newVal = newVal.replace(/(^|[\s\-])([a-z])/g, match => match.toUpperCase());

      if (oldVal !== newVal) {
        this.value = newVal;
      }

      validateNameField(this, isRequired, minLen, errorSpanId, fieldName);
    });

    input.addEventListener('blur', function () {
      this.value = this.value.trim();
      validateNameField(this, isRequired, minLen, errorSpanId, fieldName);
    });
  }

  setupNameField('firstName', false, 2, 'firstNameError', 'First name');
  setupNameField('middleName', false, 1, 'middleNameError', 'Middle name');
  setupNameField('lastName', false, 1, 'lastNameError', 'Last name');

  // CIBIL Score Verification Logic
  let isCibilScoreFetched = false;
  let isCibilCheckCompleted = false;

  const cibilConsentCheckbox = document.getElementById('cibilConsentCheckbox');
  const btnCheckCibilScore = document.getElementById('btnCheckCibilScore');
  const btnSubmitApplication = document.getElementById('btnSubmitApplication');
  const cibilResultCard = document.getElementById('cibil-result-card');

  function checkSubmitGuard() {
    if (btnSubmitApplication) {
      btnSubmitApplication.disabled = !isCibilCheckCompleted;
    }
  }

  function enableSubmitAfterCibilAttempt() {
    isCibilCheckCompleted = true;
    checkSubmitGuard();
  }

  checkSubmitGuard();

  if (cibilConsentCheckbox) {
    cibilConsentCheckbox.addEventListener('change', () => {
      if (btnCheckCibilScore && !isCibilScoreFetched) {
        btnCheckCibilScore.disabled = !cibilConsentCheckbox.checked;
      }
    });
  }

  if (btnCheckCibilScore) {
    btnCheckCibilScore.addEventListener('click', () => {
      if (!cibilConsentCheckbox || !cibilConsentCheckbox.checked || isCibilScoreFetched) return;

      btnCheckCibilScore.disabled = true;
      btnCheckCibilScore.innerHTML = `<span>Checking CIBIL Score...</span>`;

      setTimeout(() => {
        try {
        const scoreValEl = document.getElementById('cibil-score-value');
        if (scoreValEl) scoreValEl.textContent = '782';

        if (cibilResultCard) {
          cibilResultCard.classList.remove('hidden');
          cibilResultCard.style.display = 'block';
        }

        btnCheckCibilScore.innerHTML = `<span>✓ CIBIL Score Verified</span>`;
        btnCheckCibilScore.classList.add('is-verified');
        btnCheckCibilScore.setAttribute('style', 'width: auto !important; min-width: unset !important; max-width: fit-content !important; height: 38px !important; padding: 10px 24px !important; margin: 0 auto !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; font-weight: 600 !important; font-size: 13.5px !important;');
        btnCheckCibilScore.disabled = true;

        isCibilScoreFetched = true;
        enableSubmitAfterCibilAttempt();
        if (window.showToast) {
          window.showToast('CIBIL Score verified successfully.');
        }
        } catch (err) {
          btnCheckCibilScore.innerHTML = `<span>Check CIBIL Score</span>`;
          btnCheckCibilScore.disabled = false;
          enableSubmitAfterCibilAttempt();
          if (window.showToast) {
            window.showToast('CIBIL verification unavailable. You can continue.');
          }
        }
      }, 800);
    });
  }

  if (window.updateUploadDocumentList) window.updateUploadDocumentList();

  // Real-time synchronization of all form inputs to Review & Submit summary
  const allFormInputs = document.querySelectorAll('#step-1-form input, #step-1-form select, #step-2-form input, #step-2-form select, #step-3-content input, #step-3-content select');
  allFormInputs.forEach(inputEl => {
    ['input', 'change', 'blur'].forEach(evtType => {
      inputEl.addEventListener(evtType, () => {
        if (typeof populateReviewSummary === 'function') {
          populateReviewSummary();
        }
      });
    });
  });


  // Custom Compact Downward Dropdown Handler for Nature of Business & Business Type

  const setupCompactDownwardDropdown = (selectId) => {
    const selectEl = document.getElementById(selectId);
    if (!selectEl) return;

    const parentGroup = selectEl.closest('.form-group');
    if (!parentGroup) return;

    parentGroup.style.position = 'relative';

    selectEl.addEventListener('mousedown', function (e) {
      e.preventDefault();
      this.focus();

      let existingMenu = parentGroup.querySelector('.custom-compact-dropdown');
      if (existingMenu) {
        existingMenu.remove();
        return;
      }

      document.querySelectorAll('.custom-compact-dropdown').forEach(el => el.remove());

      const dropdownMenu = document.createElement('div');
      dropdownMenu.className = 'custom-compact-dropdown';
      dropdownMenu.style.cssText = `
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;
        background: #FFFFFF;
        border: 1px solid #CBD5E1;
        border-radius: 12px;
        box-shadow: 0 10px 25px -4px rgba(15, 23, 42, 0.15);
        z-index: 1000;
        max-height: 180px;
        overflow-y: auto;
        padding: 4px 0;
      `;

      Array.from(selectEl.options).forEach(opt => {
        const item = document.createElement('div');
        item.style.cssText = `
          padding: 8px 14px;
          font-size: 13px;
          color: #1E293B;
          cursor: pointer;
          transition: background 0.15s;
          ${opt.selected ? 'background: #EFF6FF; font-weight: 600; color: #2563EB;' : ''}
        `;
        item.textContent = opt.textContent;

        item.addEventListener('mouseenter', () => {
          if (!opt.selected) item.style.background = '#F8FAFC';
        });
        item.addEventListener('mouseleave', () => {
          if (!opt.selected) item.style.background = 'transparent';
        });

        item.addEventListener('click', () => {
          selectEl.value = opt.value;
          selectEl.dispatchEvent(new Event('change', { bubbles: true }));
          selectEl.classList.remove('is-invalid');
          const errorSpan = document.getElementById(selectId + 'Error');
          if (errorSpan) errorSpan.classList.add('hidden');
          dropdownMenu.remove();
        });

        dropdownMenu.appendChild(item);
      });

      parentGroup.appendChild(dropdownMenu);
    });

    document.addEventListener('click', (e) => {
      if (!parentGroup.contains(e.target)) {
        const menu = parentGroup.querySelector('.custom-compact-dropdown');
        if (menu) menu.remove();
      }
    });
  };

  setupCompactDownwardDropdown('natureOfBusiness');
  setupCompactDownwardDropdown('businessType');
  setupCompactDownwardDropdown('businessVintage');

  // Auto-expand Office Address input dynamically as user types
  const officeAddressInput = document.getElementById('officeAddress');
  if (officeAddressInput) {
    const autoExpandAddress = () => {
      officeAddressInput.style.height = '40px';
      const scrollH = officeAddressInput.scrollHeight;
      if (scrollH > 40) {
        officeAddressInput.style.height = scrollH + 'px';
      }
    };
    officeAddressInput.addEventListener('input', autoExpandAddress);
    officeAddressInput.addEventListener('focus', autoExpandAddress);
  }



  // Global listener to clear validation errors when user types or selects a value
  function clearValidationError(e) {
    const target = e.target;
    if (target.classList && target.classList.contains('is-invalid')) {
      target.classList.remove('is-invalid');
    }

    let errorSpan = null;
    if (target.id) {
      errorSpan = document.getElementById(target.id + 'Error');
    }
    if (!errorSpan && target.name) {
      errorSpan = document.getElementById(target.name + 'Error');
    }

    if (errorSpan && !errorSpan.classList.contains('hidden')) {
      errorSpan.classList.add('hidden');
    }
  }

  document.addEventListener('input', clearValidationError, true);
  document.addEventListener('change', clearValidationError, true);

  // Generic validation helper
  function validateRequiredFields(fields) {
    let isValid = true;
    let firstInvalidField = null;

    fields.forEach(({ id, name, type = 'text', dependsOn = null }) => {
      // If the field has a dependency condition that evaluates to false, skip validation
      if (dependsOn && !dependsOn()) {
        const input = document.getElementById(id);
        const errorSpan = document.getElementById(id + 'Error');
        if (input) input.classList.remove('is-invalid');
        if (errorSpan) errorSpan.classList.add('hidden');
        return;
      }

      const input = document.getElementById(id);
      const errorSpan = document.getElementById(id + 'Error');
      if (!input) return;

      let hasError = false;
      let errorMsg = '';

      if (type === 'radio') {
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        if (!checked) {
          hasError = true;
          errorMsg = `Please select your ${name}.`;
        }
      } else {
        const val = input.value.trim();
        if (val === '') {
          hasError = false; // Fields are optional by default
        } else if (id === 'panNumber') {
          const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
          if (!panRegex.test(val)) {
            hasError = true;
            errorMsg = 'Please enter a valid PAN number (Format: ABCDE1234F).';
          }
        } else if (id === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val)) {
            hasError = true;
            errorMsg = 'Please enter a valid email address.';
          }
        } else if (id === 'pinCode') {
          if (!/^\d{6}$/.test(val)) {
            hasError = true;
            errorMsg = 'Please enter a valid 6-digit Indian PIN Code.';
          }
        }
      }

      if (hasError) {
        if (type !== 'radio') input.classList.add('is-invalid');
        if (errorSpan) {
          errorSpan.textContent = errorMsg;
          errorSpan.classList.remove('hidden');
        }
        isValid = false;
        if (!firstInvalidField) {
          firstInvalidField = type === 'radio' ? document.querySelector(`input[name="${name}"]`) : input;
        }
      } else {
        if (type !== 'radio') input.classList.remove('is-invalid');
        if (errorSpan) {
          errorSpan.classList.add('hidden');
        }
      }
    });

    return { isValid, firstInvalidField };
  }

  function validateDob() {
    const dobInput = document.getElementById('dobInput');
    const dobError = document.getElementById('dobInputError');
    const dobWrapper = dobInput ? dobInput.closest('.input-wrapper') : null;

    if (!dobInput || !dobInput.value || !dobInput.value.trim()) return true;

    const dobDate = new Date(dobInput.value);
    const today = new Date();

    if (isNaN(dobDate.getTime())) {
      if (dobInput) dobInput.classList.add('is-invalid');
      if (dobWrapper) dobWrapper.classList.add('is-invalid');
      if (dobError) {
        dobError.textContent = 'Please enter a valid date.';
        dobError.classList.remove('hidden');
      }
      return false;
    }

    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }

    if (dobDate > today || age < 18 || age > 75) {
      if (dobInput) dobInput.classList.add('is-invalid');
      if (dobWrapper) dobWrapper.classList.add('is-invalid');
      if (dobError) {
        dobError.textContent = 'Applicant must be between 18 and 75 years of age.';
        dobError.classList.remove('hidden');
      }
      return false;
    }

    if (dobInput) dobInput.classList.remove('is-invalid');
    if (dobWrapper) dobWrapper.classList.remove('is-invalid');
    if (dobError) dobError.classList.add('hidden');
    return true;
  }

  const dobInputForEvent = document.getElementById('dobInput');
  if (dobInputForEvent) {
    dobInputForEvent.addEventListener('change', validateDob);
    dobInputForEvent.addEventListener('change', () => {
      if (typeof populateReviewSummary === 'function') populateReviewSummary();
    });
  }

  // Step 1 Validation & Proceed -> Step 2
  const step1Form = document.getElementById('step-1-form');
  if (step1Form) {
    step1Form.addEventListener('submit', (e) => {
      e.preventDefault();

      const isFnValid = validateNameField(document.getElementById('firstName'), false, 2, 'firstNameError', 'First name');
      const isMnValid = validateNameField(document.getElementById('middleName'), false, 1, 'middleNameError', 'Middle name');
      const isLnValid = validateNameField(document.getElementById('lastName'), false, 1, 'lastNameError', 'Last name');
      const isDobValid = typeof validateDob === 'function' ? validateDob() : true;

      const step1Fields = [
        { id: 'email', name: 'Email Address' },
        { id: 'panNumber', name: 'PAN Number' },
        { id: 'pinCode', name: 'PIN Code' }
      ];

      const { isValid: isOthersValid, firstInvalidField } = validateRequiredFields(step1Fields);

      if (!isFnValid || !isMnValid || !isLnValid || !isOthersValid || !isDobValid) {
        // Focus first invalid field
        const invalidElement = document.querySelector('.is-invalid') || firstInvalidField;
        if (invalidElement) {
          invalidElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          invalidElement.focus();
        }
        return; // Stop form submission
      }

      goToStep(2);
    });
  }

  // Step 2 Validation & Proceed -> Step 3
  const step2Form = document.getElementById('step-2-form');
  if (step2Form) {
    step2Form.addEventListener('submit', (e) => {
      e.preventDefault();

      const isSalaried = document.getElementById('empSalaried')?.checked;
      const sector = document.getElementById('employeeSector')?.value;
      const purpose = document.getElementById('loanPurpose')?.value;
      const bType = document.getElementById('businessType')?.value;
      const nBiz = document.getElementById('natureOfBusiness')?.value;

      const step2Fields = [
        // Salaried fields
        { id: 'employeeSector', name: 'Employee Sector', dependsOn: () => isSalaried },
        { id: 'companyName', name: 'Company Name', dependsOn: () => isSalaried && sector === 'Private' },
        { id: 'orgEmployerInput', name: 'Organization', dependsOn: () => isSalaried && sector === 'Government' },
        { id: 'companyExperience', name: 'Company Experience', dependsOn: () => isSalaried && sector === 'Private' },
        { id: 'totalExperience', name: 'Total Work Experience', dependsOn: () => isSalaried },
        { id: 'monthlyIncome', name: 'Net Monthly Income', dependsOn: () => isSalaried },

        // Self-Employed fields
        { id: 'businessName', name: 'Business Name', dependsOn: () => !isSalaried },
        { id: 'businessType', name: 'Business Type', dependsOn: () => !isSalaried },
        { id: 'otherBusinessTypeInput', name: 'Specify Business Type', dependsOn: () => !isSalaried && bType === 'Others' },
        { id: 'natureOfBusiness', name: 'Nature of Business', dependsOn: () => !isSalaried },
        { id: 'otherNatureOfBusinessInput', name: 'Specify Nature of Business', dependsOn: () => !isSalaried && nBiz === 'Others' },
        { id: 'businessVintage', name: 'Business Vintage', dependsOn: () => !isSalaried },
        { id: 'monthlyBusinessIncome', name: 'Monthly Business Income', dependsOn: () => !isSalaried },
        { id: 'officeAddress', name: 'Office Address', dependsOn: () => !isSalaried },
        { id: 'annualTurnover', name: 'Annual Turnover', dependsOn: () => !isSalaried },

        // Income & Loan Details
        { id: 'loanAmount', name: 'Required Loan Amount' },
        { id: 'loanPurpose', name: 'Loan Purpose' },
        { id: 'otherLoanPurposeInput', name: 'Specify Loan Purpose', dependsOn: () => purpose === 'Other' },
        { id: 'loanTenure', name: 'Tenure (Months)' },
        { id: 'existingEmi', name: 'Existing Monthly EMI' }
      ];

      const { isValid, firstInvalidField } = validateRequiredFields(step2Fields);

      if (!isValid) {
        if (firstInvalidField) {
          firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstInvalidField.focus();
        }
        return;
      }

      goToStep(3);
    });
  }

  let isUploadedLater = false;
  const uploadChoiceView = document.getElementById('uploadChoiceView');
  const uploadFilesSection = document.getElementById('uploadFilesSection');
  const btnUploadNow = document.getElementById('btnUploadNow');
  const btnUploadLater = document.getElementById('btnUploadLater');
  const cardUploadNow = document.getElementById('cardUploadNow');
  const cardUploadLater = document.getElementById('cardUploadLater');

  const selectUploadCard = (isNow) => {
    if (cardUploadNow && cardUploadLater) {
      if (isNow) {
        cardUploadNow.classList.add('selected-card');
        cardUploadNow.classList.remove('unselected');
        cardUploadLater.classList.remove('selected-card');
        cardUploadLater.classList.add('unselected');
      } else {
        cardUploadLater.classList.add('selected-card');
        cardUploadLater.classList.remove('unselected');
        cardUploadNow.classList.remove('selected-card');
        cardUploadNow.classList.add('unselected');
      }
    }
  };

  if (btnUploadNow && uploadChoiceView && uploadFilesSection) {
    btnUploadNow.addEventListener('click', (e) => {
      e.preventDefault();
      selectUploadCard(true);
      isUploadedLater = false;
      if (window.updateUploadDocumentList) window.updateUploadDocumentList();

      // Real-time synchronization of all form inputs to Review & Submit summary
      const allFormInputs = document.querySelectorAll('#step-1-form input, #step-1-form select, #step-2-form input, #step-2-form select, #step-3-content input, #step-3-content select');
      allFormInputs.forEach(inputEl => {
        ['input', 'change', 'blur'].forEach(evtType => {
          inputEl.addEventListener(evtType, () => {
            if (typeof populateReviewSummary === 'function') {
              populateReviewSummary();
            }
          });
        });
      });

      setTimeout(() => {
        uploadChoiceView.classList.add('hidden');
        uploadFilesSection.classList.remove('hidden');
        uploadFilesSection.classList.add('active-user-upload');
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }, 150);
    });
  }

  if (btnUploadLater) {
    btnUploadLater.addEventListener('click', (e) => {
      e.preventDefault();
      selectUploadCard(false);
      isUploadedLater = true;
      localStorage.setItem('uploadLaterSelected', 'true');
      if (window.checkStep3ContinueState) window.checkStep3ContinueState();
      setTimeout(() => {
        goToStep(4);
      }, 150);
    });
  }

  const btnBackToChoice = document.getElementById('btnBackToChoice');
  if (btnBackToChoice && uploadChoiceView && uploadFilesSection) {
    btnBackToChoice.addEventListener('click', () => {
      uploadFilesSection.classList.add('hidden');
      uploadFilesSection.classList.remove('active-user-upload');
      uploadChoiceView.classList.remove('hidden');
    });
  }

  // Step 3 Upload Documents -> Step 4
  const step3Form = document.getElementById('step-3-form');
  if (step3Form) {
    step3Form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Step 3 documents are optional

      goToStep(4);
    });
  }

  // Step 4 Review & Final Submit -> Step 5
  const step4Form = document.getElementById('step-4-form');
  if (step4Form) {
    step4Form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Generate Reference Number
      const randomRef = 'CGI-2026-' + Math.floor(100000 + Math.random() * 900000);
      const refIdEl = document.getElementById('application-ref-id');
      if (refIdEl) refIdEl.textContent = randomRef;
      // Show Success View
      goToStep(5);
    });
  }

  // --- NEW DOCUMENT UPLOAD LOGIC ---

  // Update Upload Document List dynamically by Employment Type
  window.updateUploadDocumentList = function () {
    const isSalaried = document.getElementById('empSalaried')?.checked;

    const cardSalary = document.getElementById('card-salary');
    const cardItr = document.getElementById('card-itr');
    const cardBizproof = document.getElementById('card-bizproof');
    const cardBankTitle = document.querySelector('#card-bank .card-title');
    const cardBankDesc = document.getElementById('desc-bank');

    const vStepSalaryName = document.querySelector('#v-step-salary .v-step-name');
    const vStepBankName = document.querySelector('#v-step-bank .v-step-name');
    const vStepBizproof = document.getElementById('v-step-bizproof');

    if (isSalaried) {
      if (cardSalary) { cardSalary.classList.remove('hidden'); cardSalary.style.display = 'flex'; }
      if (cardItr) { cardItr.classList.add('hidden'); cardItr.style.display = 'none'; }
      if (cardBizproof) { cardBizproof.classList.add('hidden'); cardBizproof.style.display = 'none'; }

      if (cardBankTitle) cardBankTitle.textContent = 'Last 6 Months Salary Bank Statement';
      if (cardBankDesc) cardBankDesc.textContent = 'Upload a clear copy of your Last 6 Months Salary Bank Statement.';

      if (vStepSalaryName) vStepSalaryName.innerHTML = 'Latest 3 Months<br>Salary Slips';
      if (vStepBankName) vStepBankName.innerHTML = 'Last 6 Months<br>Salary Bank Statement';
      if (vStepBizproof) { vStepBizproof.classList.add('hidden'); vStepBizproof.style.display = 'none'; }
    } else {
      if (cardSalary) { cardSalary.classList.add('hidden'); cardSalary.style.display = 'none'; }
      if (cardItr) { cardItr.classList.remove('hidden'); cardItr.style.display = 'flex'; }
      if (cardBizproof) { cardBizproof.classList.remove('hidden'); cardBizproof.style.display = 'flex'; }

      if (cardBankTitle) cardBankTitle.textContent = 'Last 6 Months Business Bank Statement';
      if (cardBankDesc) cardBankDesc.textContent = 'Upload a clear copy of your Last 6 Months Business Bank Statement.';

      if (vStepSalaryName) vStepSalaryName.innerHTML = 'Income Tax Returns<br>(ITR) – Last 2 Years';
      if (vStepBankName) vStepBankName.innerHTML = 'Last 6 Months<br>Business Bank Statement';
      if (vStepBizproof) { vStepBizproof.classList.remove('hidden'); vStepBizproof.style.display = 'flex'; }
    }
  };

  const docTypes = ['pan', 'aadhaar', 'salary', 'bank', 'itr', 'bizproof'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  const docState = {};
  try {
    const savedDocState = JSON.parse(localStorage.getItem('docState') || '{}');
    if (savedDocState && typeof savedDocState === 'object') {
      Object.assign(docState, savedDocState);
    }
  } catch (err) {
    localStorage.removeItem('docState');
  }

  const btnSubmitDocs = document.getElementById('btnSubmitDocs');

  // Set to always enabled as documents are optional
  if (btnSubmitDocs) {
    btnSubmitDocs.disabled = false;
  }

  function hasAnyUploadedDocument() {
    return docTypes.some(type => {
      const doc = docState[type];
      if (!doc) return false;
      if (doc.status === 'Uploaded') return true;
      if (Array.isArray(doc.files) && doc.files.length > 0) return true;
      return Boolean(doc.front || doc.back);
    });
  }

  function checkAllDocsUploaded() {
    const allUploaded = docTypes.every(type => docState[type] && docState[type].status === 'Uploaded');

    const reviewStatus = document.getElementById('v-status-review');
    const reviewStep = document.getElementById('v-step-review');
    // We treat the review step as active always since fields are optional
    if (reviewStatus) reviewStatus.textContent = 'Ready to Submit';
    if (reviewStep) reviewStep.classList.add('active');
  }

  window.showAadhaarSplitUpload = function () {
    const inlineUpload = document.getElementById('aadhaar-inline-upload');
    if (inlineUpload) {
      inlineUpload.classList.remove('hidden');
      inlineUpload.style.display = 'flex';
    }
    const stateObj = docState['aadhaar'];
    const btnContinue = document.getElementById('btn-aadhaar-modal-continue');
    if (btnContinue) {
      btnContinue.disabled = !(stateObj && stateObj.front && stateObj.back);
    }
  };

  window.closeAadhaarModal = function () {
    const inlineUpload = document.getElementById('aadhaar-inline-upload');
    if (inlineUpload) {
      inlineUpload.classList.add('hidden');
      inlineUpload.style.display = 'none';
    }
    updateAadhaarUI(docState['aadhaar'] || null);
    checkAllDocsUploaded();
  };

  function updateAadhaarUI(stateObj) {
    const uploadZone = document.getElementById('upload-zone-aadhaar');
    const badge = document.getElementById('badge-aadhaar');
    const vStatus = document.getElementById('v-status-aadhaar');
    const vStep = document.getElementById('v-step-aadhaar');
    const docCard = document.getElementById('card-aadhaar');
    const chipBtn = document.getElementById('chip-btn-aadhaar');
    const chipUploaded = document.getElementById('chip-uploaded-aadhaar');
    const btnContinue = document.getElementById('btn-aadhaar-modal-continue');

    const descEl = document.getElementById('desc-aadhaar');
    const metaEl = document.getElementById('meta-aadhaar');
    const metaNameEl = document.getElementById('meta-name-aadhaar');
    const metaSizeEl = document.getElementById('meta-size-aadhaar');

    if (uploadZone) {
      uploadZone.classList.add('hidden');
      uploadZone.style.display = 'none';
    }

    if (!stateObj || (!stateObj.front && !stateObj.back)) {
      if (btnContinue) btnContinue.disabled = true;
      if (chipBtn) { chipBtn.classList.remove('hidden'); chipBtn.style.display = 'inline-flex'; }
      if (chipUploaded) { chipUploaded.classList.add('hidden'); chipUploaded.style.display = 'none'; }
      if (descEl) { descEl.classList.remove('hidden'); descEl.style.display = 'block'; }
      if (metaEl) { metaEl.classList.add('hidden'); metaEl.style.display = 'none'; }

      if (badge) {
        badge.textContent = 'Pending';
        badge.className = 'badge-orange';
        badge.removeAttribute('style');
      }
      if (vStatus) vStatus.textContent = 'Not Started';
      if (vStep) vStep.classList.remove('completed');
      if (docCard) docCard.style.borderColor = '';

      updateAadhaarPartUI('front', null);
      updateAadhaarPartUI('back', null);
      return;
    }

    updateAadhaarPartUI('front', stateObj.front);
    updateAadhaarPartUI('back', stateObj.back);

    if (stateObj.front && stateObj.back) {
      if (btnContinue) btnContinue.disabled = false;
      if (chipBtn) { chipBtn.classList.add('hidden'); chipBtn.style.display = 'none'; }
      if (chipUploaded) { chipUploaded.classList.remove('hidden'); chipUploaded.style.display = 'inline-flex'; }
      if (descEl) { descEl.classList.add('hidden'); descEl.style.display = 'none'; }
      if (metaEl) { metaEl.classList.remove('hidden'); metaEl.style.display = 'block'; }
      if (metaNameEl) metaNameEl.textContent = 'Aadhaar_Front_Back.pdf';
      if (metaSizeEl) {
        let totalSize = ((stateObj.front.size + stateObj.back.size) / (1024 * 1024)).toFixed(2);
        metaSizeEl.textContent = `${totalSize} MB`;
      }
      if (badge) {
        badge.textContent = 'Uploaded';
        badge.className = 'badge-green';
        badge.removeAttribute('style');
      }
      if (vStatus) vStatus.textContent = 'Uploaded';
      if (vStep) {
        vStep.classList.remove('active');
        vStep.classList.add('completed');
      }
      if (docCard) docCard.style.borderColor = '#10B981';
      stateObj.status = 'Uploaded';
      stateObj.name = 'Front & Back Uploaded';
    } else {
      if (btnContinue) btnContinue.disabled = true;
      if (chipBtn) { chipBtn.classList.remove('hidden'); chipBtn.style.display = 'inline-flex'; }
      if (chipUploaded) { chipUploaded.classList.add('hidden'); chipUploaded.style.display = 'none'; }
      if (descEl) { descEl.classList.remove('hidden'); descEl.style.display = 'block'; }
      if (metaEl) { metaEl.classList.add('hidden'); metaEl.style.display = 'none'; }
      if (badge) {
        badge.textContent = 'Partial';
        badge.className = 'badge-orange';
        badge.removeAttribute('style');


      }
      if (vStatus) vStatus.textContent = 'In Progress';
      if (vStep) vStep.classList.remove('completed');
      if (docCard) docCard.style.borderColor = '#FBBF24';
      stateObj.status = 'Partial';
      stateObj.name = stateObj.front ? 'Front Side Only' : 'Back Side Only';
    }
  }

  function updateAadhaarPartUI(part, partObj) {
    const fileMetaEl = document.getElementById(`file-meta-aadhaar-${part}`);
    const fileNameEl = document.getElementById(`file-name-aadhaar-${part}`);
    const fileSizeEl = document.getElementById(`file-size-aadhaar-${part}`);
    const btnEl = document.getElementById(`btn-upload-aadhaar-${part}`);
    const iconEl = document.getElementById(`icon-aadhaar-${part}`);
    const textEl = document.getElementById(`text-aadhaar-${part}`);

    if (partObj) {
      if (fileMetaEl) fileMetaEl.style.display = 'block';
      if (fileNameEl) fileNameEl.textContent = partObj.name;
      if (fileSizeEl) fileSizeEl.textContent = `${(partObj.size / (1024 * 1024)).toFixed(2)} MB`;
      if (btnEl) btnEl.classList.add('success');
      if (textEl) textEl.textContent = 'Uploaded';
      if (iconEl) {
        iconEl.innerHTML = '<circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/>';
        iconEl.setAttribute('stroke', '#10B981');
      }
    } else {
      if (fileMetaEl) fileMetaEl.style.display = 'none';
      if (fileNameEl) fileNameEl.textContent = '';
      if (fileSizeEl) fileSizeEl.textContent = '';
      if (btnEl) btnEl.classList.remove('success');
      if (textEl) textEl.textContent = `Upload ${part === 'front' ? 'Front Side' : 'Back Side'}`;
      if (iconEl) {
        iconEl.innerHTML = '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>';
        iconEl.setAttribute('stroke', 'currentColor');
      }
      const inputEl = document.getElementById(`input-aadhaar-${part}`);
      if (inputEl) inputEl.value = '';
    }
  }

  window.deleteAadhaarPart = function (part) {
    if (docState['aadhaar']) {
      delete docState['aadhaar'][part];
      if (!docState['aadhaar'].front && !docState['aadhaar'].back) {
        delete docState['aadhaar'];
      }
      localStorage.setItem('docState', JSON.stringify(docState));
    }
    updateUIForDoc('aadhaar', docState['aadhaar'] || null);
  };

  function processAadhaarFile(file, part) {
    const errorEl = document.getElementById(`error-aadhaar-${part}`);
    if (errorEl) { errorEl.classList.add('hidden'); errorEl.textContent = ''; errorEl.style.display = 'none'; }

    if (!allowedTypes.includes(file.type)) {
      if (errorEl) { errorEl.textContent = 'Invalid format. Only PDF, JPG, PNG allowed.'; errorEl.classList.remove('hidden'); errorEl.style.display = 'block'; }
      return;
    }
    if (file.size > maxFileSize) {
      if (errorEl) { errorEl.textContent = 'File is too large. Max 10MB.'; errorEl.classList.remove('hidden'); errorEl.style.display = 'block'; }
      return;
    }

    const btnEl = document.getElementById(`btn-upload-aadhaar-${part}`);
    const textEl = document.getElementById(`text-aadhaar-${part}`);
    if (btnEl) btnEl.disabled = true;
    if (textEl) textEl.textContent = 'Uploading...';

    setTimeout(() => {
      if (btnEl) btnEl.disabled = false;
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      docState['aadhaar'] = docState['aadhaar'] || {};
      const isReplacement = docState['aadhaar'][part] != null;
      docState['aadhaar'][part] = {
        name: file.name,
        size: file.size,
        date: `Today, ${timeStr}`
      };
      localStorage.setItem('docState', JSON.stringify(docState));
      updateUIForDoc('aadhaar', docState['aadhaar']);
      if (isReplacement && window.showToast) {
        window.showToast('Document updated successfully.');
      }
    }, 800);
  }

  window.showToast = function (msg) {
    let toast = document.getElementById('success-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'success-toast';
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.background = '#10B981';
      toast.style.color = '#FFFFFF';
      toast.style.padding = '12px 24px';
      toast.style.borderRadius = '8px';
      toast.style.boxShadow = '0 10px 25px -5px rgba(16,185,129,0.4)';
      toast.style.zIndex = '9999';
      toast.style.fontWeight = '500';
      toast.style.transition = 'opacity 0.3s ease';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.opacity = '1'; }, 10);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => { toast.style.display = 'none'; }, 300);
    }, 3000);
  };

  window.checkStep3ContinueState = function () {
    const isSalaried = document.getElementById('empSalaried')?.checked;
    const panUploaded = docState['pan'] && docState['pan'].status === 'Uploaded';
    const aadhaarUploaded = docState['aadhaar'] && docState['aadhaar'].status === 'Uploaded';
    const bankUploaded = docState['bank'] && docState['bank'].status === 'Uploaded';

    let hasUploadedAllRequiredDocuments = false;
    if (isSalaried) {
      const salaryUploaded = docState['salary'] && docState['salary'].status === 'Uploaded';
      hasUploadedAllRequiredDocuments = Boolean(panUploaded && aadhaarUploaded && bankUploaded && salaryUploaded);
    } else {
      const bizproofUploaded = docState['bizproof'] && docState['bizproof'].status === 'Uploaded';
      const itrUploaded = docState['itr'] && docState['itr'].status === 'Uploaded';
      hasUploadedAllRequiredDocuments = Boolean(panUploaded && aadhaarUploaded && bankUploaded && bizproofUploaded && itrUploaded);
    }

    const uploadLaterSelected = (typeof isUploadedLater !== 'undefined' && isUploadedLater) || localStorage.getItem('uploadLaterSelected') === 'true';
    const hasReachedStep4 = localStorage.getItem('hasReachedStep4') === 'true';

    const hasUploadedAnyDocument = hasAnyUploadedDocument();
    const canContinue = hasUploadedAnyDocument;

    const choiceContinueBtn = document.getElementById('choiceContinueBtn');
    if (choiceContinueBtn) {
      if (canContinue) {
        choiceContinueBtn.classList.remove('hidden');
        choiceContinueBtn.style.display = 'inline-flex';
        choiceContinueBtn.textContent = 'Continue \u2192';
      } else {
        choiceContinueBtn.classList.add('hidden');
        choiceContinueBtn.style.display = 'none';
      }
    }

    const btnSubmitDocs = document.getElementById('btnSubmitDocs');
    if (btnSubmitDocs) {
      if (hasUploadedAnyDocument) {
        btnSubmitDocs.innerHTML = `Continue &rarr;`;
      } else {
        btnSubmitDocs.innerHTML = `Submit Documents for Verification <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
      }
    }

    return canContinue;
  };
  window.checkAllDocsUploaded = window.checkStep3ContinueState;

  const choiceContinueBtn = document.getElementById('choiceContinueBtn');
  if (choiceContinueBtn) {
    choiceContinueBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!hasAnyUploadedDocument()) return;
      goToStep(4);
    });
  }

  function updateUIForDoc(type, stateObj) {
    if (type === 'aadhaar') {
      updateAadhaarUI(stateObj);
      checkAllDocsUploaded();
      return;
    }
    const uploadZone = document.getElementById(`upload-zone-${type}`);
    const previewCard = document.getElementById(`preview-${type}`);
    const badge = document.getElementById(`badge-${type}`);
    const vStatus = document.getElementById(`v-status-${type}`);
    const vStep = document.getElementById(`v-step-${type}`);
    const docCard = document.getElementById(`card-${type}`);
    const chipBtn = document.getElementById(`chip-btn-${type}`);
    const chipUploaded = document.getElementById(`chip-uploaded-${type}`);

    if (stateObj && stateObj.status === 'Uploaded') {
      if (uploadZone) {
        uploadZone.classList.add('hidden');
        uploadZone.style.display = 'none';
      }
      if (previewCard) {
        previewCard.classList.remove('hidden');
        previewCard.style.display = 'block';
      }
      if (chipBtn) { chipBtn.classList.add('hidden'); chipBtn.style.display = 'none'; }
      if (chipUploaded) { chipUploaded.classList.remove('hidden'); chipUploaded.style.display = 'inline-flex'; }

      const descEl = document.getElementById(`desc-${type}`);
      const metaEl = document.getElementById(`meta-${type}`);
      const metaNameEl = document.getElementById(`meta-name-${type}`);
      const metaSizeEl = document.getElementById(`meta-size-${type}`);

      if (descEl) { descEl.classList.add('hidden'); descEl.style.display = 'none'; }
      if (metaEl) { metaEl.classList.remove('hidden'); metaEl.style.display = 'block'; }
      const isMultiType = stateObj.files && (type === 'salary' || type === 'bank' || type === 'itr');

      if (metaNameEl) {
        if (isMultiType) {
          const count = stateObj.files.length;
          metaNameEl.textContent = count === 1 ? stateObj.files[0].name : `${count} file(s) uploaded`;
        } else {
          metaNameEl.textContent = stateObj.name;
        }
      }
      if (metaSizeEl) {
        if (isMultiType) {
          const totalSize = stateObj.files.reduce((acc, f) => acc + f.size, 0);
          metaSizeEl.textContent = `${(totalSize / (1024 * 1024)).toFixed(2)} MB`;
        } else {
          metaSizeEl.textContent = `${(stateObj.size / (1024 * 1024)).toFixed(2)} MB`;
        }
      }

      // Render individual file list for multi-file upload types directly inside #card-[type]
      if (isMultiType) {
        const docCard = document.getElementById(`card-${type}`);
        let fileListContainer = document.getElementById(`files-list-${type}`);
        if (!fileListContainer && docCard) {
          fileListContainer = document.createElement('div');
          fileListContainer.id = `files-list-${type}`;
          fileListContainer.className = 'uploaded-files-list';
          docCard.appendChild(fileListContainer);
        }

        if (fileListContainer) {
          fileListContainer.innerHTML = '';
          stateObj.files.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = 'uploaded-file-item';
            item.innerHTML = `
              <div class="file-item-left">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span class="file-item-name" title="${file.name}">${file.name}</span>
                <span class="file-item-size">(${(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
              </div>
              <div class="file-item-actions">
                <span class="badge-green" style="font-size: 10px; padding: 2px 6px; border-radius: 4px;">Uploaded</span>
                <button type="button" class="btn-file-action" onclick="replaceSpecificFile('${type}', ${index})">Replace</button>
                <button type="button" class="btn-file-action danger" onclick="deleteSpecificFile('${type}', ${index})">Delete</button>
              </div>
            `;
            fileListContainer.appendChild(item);
          });
          fileListContainer.style.display = 'flex';
        }

        // Configure chip button to allow adding more files if max limit not reached
        const maxLimit = type === 'bank' ? 6 : (type === 'itr' ? 2 : 3);
        if (chipUploaded) {
          if (stateObj.files.length < maxLimit) {
            chipUploaded.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg><span>Add File</span>`;
            chipUploaded.onclick = () => document.getElementById(`input-${type}`)?.click();
            chipUploaded.classList.remove('hidden');
            chipUploaded.style.display = 'inline-flex';
          } else {
            chipUploaded.innerHTML = `<span>Max Limit Reached</span>`;
            chipUploaded.onclick = null;
          }
        }
      }

      if (badge) {
        if (isMultiType) {
          const maxLimit = type === 'bank' ? 6 : (type === 'itr' ? 2 : 3);
          badge.textContent = `Uploaded (${stateObj.files.length}/${maxLimit})`;
        } else {
          badge.textContent = 'Uploaded';
        }
        badge.className = 'badge-green';
      }
      if (vStatus) {
        if (isMultiType) {
          const maxLimit = type === 'bank' ? 6 : (type === 'itr' ? 2 : 3);
          vStatus.textContent = `Uploaded (${stateObj.files.length}/${maxLimit})`;
        } else {
          vStatus.textContent = 'Uploaded';
        }
      }
      if (vStep) {
        vStep.classList.remove('active');
        vStep.classList.add('completed');
      }
      if (docCard) {
        docCard.style.borderColor = '#10B981';
      }
    } else {
      if (uploadZone) {
        uploadZone.classList.remove('hidden');
        uploadZone.style.display = 'block';
      }
      if (previewCard) {
        previewCard.classList.add('hidden');
        previewCard.style.display = 'none';
      }
      if (chipBtn) { chipBtn.classList.remove('hidden'); chipBtn.style.display = 'inline-flex'; }
      if (chipUploaded) { chipUploaded.classList.add('hidden'); chipUploaded.style.display = 'none'; }

      const descEl = document.getElementById(`desc-${type}`);
      const metaEl = document.getElementById(`meta-${type}`);
      const fileListContainer = document.getElementById(`files-list-${type}`);
      if (descEl) { descEl.classList.remove('hidden'); descEl.style.display = 'block'; }
      if (metaEl) { metaEl.classList.add('hidden'); metaEl.style.display = 'none'; }
      if (fileListContainer) { fileListContainer.innerHTML = ''; fileListContainer.style.display = 'none'; }

      if (badge) {
        badge.textContent = 'Pending';
        badge.className = 'badge-orange';
      }
      if (vStatus) vStatus.textContent = 'Not Started';
      if (vStep) {
        vStep.classList.remove('completed');
      }
      if (docCard) {
        docCard.style.borderColor = '';
      }
    }
    checkAllDocsUploaded();
  }

  window.deleteDocument = function (type) {
    delete docState[type];
    localStorage.setItem('docState', JSON.stringify(docState));
    updateUIForDoc(type, null);
    const inputEl = document.getElementById(`input-${type}`);
    if (inputEl) inputEl.value = ''; // Reset file input
  };

  window.deleteSpecificFile = function (type, fileIndex) {
    if (docState[type] && docState[type].files) {
      docState[type].files.splice(fileIndex, 1);
      if (docState[type].files.length === 0) {
        delete docState[type];
        const inputEl = document.getElementById(`input-${type}`);
        if (inputEl) inputEl.value = '';
      }
      localStorage.setItem('docState', JSON.stringify(docState));
      updateUIForDoc(type, docState[type] || null);
      if (window.showToast) {
        window.showToast('File deleted successfully.');
      }
    }
  };

  window.replaceSpecificFile = function (type, fileIndex) {
    const tempInput = document.createElement('input');
    tempInput.type = 'file';
    tempInput.accept = '.pdf,.jpg,.jpeg,.png';
    tempInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const errorEl = document.getElementById(`error-${type}`);
      if (errorEl) { errorEl.classList.add('hidden'); errorEl.textContent = ''; }

      if (!allowedTypes.includes(file.type)) {
        if (errorEl) { errorEl.textContent = 'Invalid format. Only PDF, JPG, PNG allowed.'; errorEl.classList.remove('hidden'); }
        else if (window.showToast) window.showToast('Invalid format. Only PDF, JPG, PNG allowed.');
        return;
      }
      if (file.size > maxFileSize) {
        if (errorEl) { errorEl.textContent = 'File is too large. Max 10MB.'; errorEl.classList.remove('hidden'); }
        else if (window.showToast) window.showToast('File is too large. Max 10MB.');
        return;
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (docState[type] && docState[type].files && docState[type].files[fileIndex]) {
        docState[type].files[fileIndex] = {
          name: file.name,
          size: file.size,
          date: `Today, ${timeStr}`
        };
        localStorage.setItem('docState', JSON.stringify(docState));
        updateUIForDoc(type, docState[type]);
        if (window.showToast) {
          window.showToast('File replaced successfully.');
        }
      }
    };
    tempInput.click();
  };

  function processMultipleFiles(filesArray, type) {
    const errorEl = document.getElementById(`error-${type}`);
    if (errorEl) { errorEl.classList.add('hidden'); errorEl.textContent = ''; }

    const maxLimit = type === 'bank' ? 6 : (type === 'itr' ? 2 : 3);

    docState[type] = docState[type] || { files: [], status: 'Pending' };
    const currentCount = docState[type].files ? docState[type].files.length : 0;
    const availableSlots = maxLimit - currentCount;

    if (availableSlots <= 0) {
      if (errorEl) { errorEl.textContent = `Maximum ${maxLimit} files allowed.`; errorEl.classList.remove('hidden'); }
      else if (window.showToast) window.showToast(`Maximum ${maxLimit} files allowed.`);
      return;
    }

    const filesToProcess = filesArray.slice(0, availableSlots);
    let validFiles = [];
    for (let file of filesToProcess) {
      if (!allowedTypes.includes(file.type)) {
        if (errorEl) { errorEl.textContent = 'Invalid format. Only PDF, JPG, PNG allowed.'; errorEl.classList.remove('hidden'); }
        else if (window.showToast) window.showToast('Invalid format. Only PDF, JPG, PNG allowed.');
        return;
      }
      if (file.size > maxFileSize) {
        if (errorEl) { errorEl.textContent = 'File is too large. Max 10MB.'; errorEl.classList.remove('hidden'); }
        else if (window.showToast) window.showToast('File is too large. Max 10MB.');
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    docState[type].files = docState[type].files || [];
    validFiles.forEach(file => {
      docState[type].files.push({
        name: file.name,
        size: file.size,
        date: `Today, ${timeStr}`
      });
    });
    docState[type].status = 'Uploaded';

    localStorage.setItem('docState', JSON.stringify(docState));
    updateUIForDoc(type, docState[type]);
    if (window.showToast) {
      window.showToast('File(s) uploaded successfully.');
    }
  }

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function processFile(file, type) {
    const errorEl = document.getElementById(`error-${type}`);
    if (errorEl) { errorEl.classList.add('hidden'); errorEl.textContent = ''; }

    if (!allowedTypes.includes(file.type)) {
      if (errorEl) { errorEl.textContent = 'Invalid format. Only PDF, JPG, PNG allowed.'; errorEl.classList.remove('hidden'); }
      return;
    }
    if (file.size > maxFileSize) {
      if (errorEl) { errorEl.textContent = 'File is too large. Max 10MB.'; errorEl.classList.remove('hidden'); }
      return;
    }

    // Simulate upload
    const progressEl = document.getElementById(`progress-${type}`);
    if (!progressEl) {
      // Instant upload if no progress UI
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      docState[type] = {
        name: file.name,
        size: file.size,
        date: `Today, ${timeStr}`,
        status: 'Uploaded'
      };
      localStorage.setItem('docState', JSON.stringify(docState));
      updateUIForDoc(type, docState[type]);
      return;
    }

    const fillEl = progressEl.querySelector('.progress-bar-fill');
    progressEl.classList.remove('hidden');
    fillEl.style.width = '0%';

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      fillEl.style.width = `${progress}%`;
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          progressEl.classList.add('hidden');

          const now = new Date();
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          const isReplacement = docState[type] != null;
          docState[type] = {
            name: file.name,
            size: file.size,
            date: `Today, ${timeStr}`,
            status: 'Uploaded'
          };
          localStorage.setItem('docState', JSON.stringify(docState));
          updateUIForDoc(type, docState[type]);
          if (isReplacement && window.showToast) {
            showToast('Document updated successfully.');
          }
        }, 300);
      }
    }, 150);
  }

  docTypes.forEach(type => {
    // Restore UI from LocalStorage
    if (docState[type]) {
      updateUIForDoc(type, docState[type]);
    } else {
      updateUIForDoc(type, null);
    }

    // Drag and Drop
    const dropZone = document.getElementById(`drop-zone-${type}`);
    const fileInput = document.getElementById(`input-${type}`);

    if (dropZone) {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
      });

      ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
      });

      dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files && files.length > 0) {
          if (type === 'salary' || type === 'bank' || type === 'itr') {
            processMultipleFiles(Array.from(files), type);
          } else {
            processFile(files[0], type);
          }
        }
      }, false);
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          if (type === 'salary' || type === 'bank' || type === 'itr') {
            processMultipleFiles(Array.from(e.target.files), type);
          } else {
            processFile(e.target.files[0], type);
          }
        }
      });
    }
  });

  ['front', 'back'].forEach(part => {
    const fileInput = document.getElementById(`input-aadhaar-${part}`);
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          processAadhaarFile(e.target.files[0], part);
        }
      });
    }
  });
  // --- END NEW DOCUMENT UPLOAD LOGIC ---

  // Helper for safe integer string formatting
  function formatMoneyString(rawStr) {
    if (!rawStr) return '0';
    const digitsOnly = rawStr.toString().replace(/[^0-9]/g, '');
    const num = parseInt(digitsOnly, 10);
    return isNaN(num) ? '0' : num.toLocaleString('en-IN');
  }

  // Populate Review Cards
  function populateReviewSummary() {
    const fn = document.getElementById('firstName')?.value.trim() || '';
    const mn = document.getElementById('middleName')?.value.trim() || '';
    const ln = document.getElementById('lastName')?.value.trim() || '';
    const fullNameParts = [fn, mn, ln].filter(Boolean);
    const fullName = fullNameParts.length > 0 ? fullNameParts.join(' ') : 'Not provided';

    const mobile = document.getElementById('mobile')?.value.trim() || '';
    const mobileFormatted = mobile ? (mobile.startsWith('+91') ? mobile : '+91 ' + mobile) : 'Not provided';
    const email = document.getElementById('email')?.value.trim() || 'Not provided';

    const genderChecked = document.querySelector('input[name="gender"]:checked')?.value;
    let genderDobStr = genderChecked || 'Not provided';

    const pan = document.getElementById('panNumber')?.value.trim().toUpperCase() || 'Not provided';

    const pin = document.getElementById('pinCode')?.value.trim() || '';
    const city = document.getElementById('city')?.value.trim() || '';
    const state = document.getElementById('state')?.value.trim() || '';
    let addressStr = 'Not provided';
    if (city || state || pin) {
      const locParts = [city, state].filter(Boolean).join(', ');
      addressStr = pin ? (locParts ? `${locParts} (${pin})` : pin) : locParts;
    }

    const isSalaried = salariedRadio ? salariedRadio.checked : true;
    const empType = isSalaried ? 'Salaried' : 'Self-Employed';

    let empDetailsStr = 'Not provided';
    let compExpLabel = 'Company Experience';
    let compExpVal = 'Not provided';
    let totalExpLabel = 'Total Experience';
    let totalExpVal = 'Not provided';
    let incomeStr = 'Not provided';

    const revGstGroup = document.getElementById('rev-gst-group');
    const revOfficeAddrGroup = document.getElementById('rev-office-addr-group');
    const revAnnualTurnoverGroup = document.getElementById('rev-annual-turnover-group');

    if (isSalaried) {
      const sector = sectorSelect?.value || '';
      if (sector === 'Government') {
        const dept = document.getElementById('orgEmployerInput')?.value.trim();
        empDetailsStr = dept ? `Government (${dept})` : 'Government';
      } else if (sector) {
        const company = document.getElementById('companyName')?.value.trim();
        empDetailsStr = company ? `${sector} (${company})` : sector;
      } else {
        const company = document.getElementById('companyName')?.value.trim();
        empDetailsStr = company ? company : 'Not provided';
      }

      compExpVal = document.getElementById('companyExperience')?.value || 'Not provided';
      totalExpVal = document.getElementById('totalExperience')?.value || 'Not provided';

      const rawInc = document.getElementById('monthlyIncome')?.value;
      incomeStr = rawInc ? '₹' + formatMoneyString(rawInc) : 'Not provided';

      if (revGstGroup) revGstGroup.classList.add('hidden');
      if (revOfficeAddrGroup) revOfficeAddrGroup.classList.add('hidden');
      if (revAnnualTurnoverGroup) revAnnualTurnoverGroup.classList.add('hidden');
    } else {
      const bName = document.getElementById('businessName')?.value.trim() || '';
      let bType = document.getElementById('businessType')?.value || '';
      if (bType === 'Others') {
        const customType = document.getElementById('otherBusinessTypeInput')?.value.trim();
        bType = customType ? customType : 'Others';
      }
      if (bName && bType) {
        empDetailsStr = `${bName} (${bType})`;
      } else if (bName) {
        empDetailsStr = bName;
      } else if (bType) {
        empDetailsStr = bType;
      } else {
        empDetailsStr = 'Not provided';
      }

      compExpLabel = 'Nature of Business';
      let nBiz = document.getElementById('natureOfBusiness')?.value || '';
      if (nBiz === 'Others') {
        const customBiz = document.getElementById('otherNatureOfBusinessInput')?.value.trim();
        nBiz = customBiz ? customBiz : 'Others';
      }
      compExpVal = nBiz || 'Not provided';

      totalExpLabel = 'Business Vintage';
      totalExpVal = document.getElementById('businessVintage')?.value || 'Not provided';

      const rawBizInc = document.getElementById('monthlyBusinessIncome')?.value;
      incomeStr = rawBizInc ? '₹' + formatMoneyString(rawBizInc) : 'Not provided';

      const gst = document.getElementById('gstNumber')?.value.trim();
      const officeAddr = document.getElementById('officeAddress')?.value.trim();
      const rawTurnover = document.getElementById('annualTurnover')?.value;

      const setTxtInternal = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
      setTxtInternal('rev-gst', gst ? gst : 'Not provided');
      setTxtInternal('rev-office-addr', officeAddr ? officeAddr : 'Not provided');
      setTxtInternal('rev-annual-turnover', rawTurnover ? '₹' + formatMoneyString(rawTurnover) : 'Not provided');

      if (revGstGroup) revGstGroup.classList.remove('hidden');
      if (revOfficeAddrGroup) revOfficeAddrGroup.classList.remove('hidden');
      if (revAnnualTurnoverGroup) revAnnualTurnoverGroup.classList.remove('hidden');
    }

    const rawLoanAmt = loanAmountInput?.value;
    const loanAmtStr = rawLoanAmt ? '₹' + formatMoneyString(rawLoanAmt) : 'Not provided';

    let purpose = loanPurposeSelect?.value || '';
    if (purpose === 'Other') {
      const customPurpose = otherLoanPurposeInput?.value.trim();
      purpose = customPurpose ? `Other (${customPurpose})` : 'Other';
    }
    const purposeStr = purpose ? purpose : 'Not provided';

    const tenure = loanTenureSelect?.value;
    const tenureStr = tenure ? `${tenure} Months` : 'Not provided';

    const rawEmi = document.getElementById('existingEmi')?.value;
    const emiStr = rawEmi ? '₹' + formatMoneyString(rawEmi) : 'Not provided';

    // Set DOM elements
    const setTxt = (id, txt) => {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    };

    setTxt('rev-name', fullName);
    setTxt('rev-mobile', mobileFormatted);
    setTxt('rev-email', email);
    setTxt('rev-gender-dob', genderDobStr);
    setTxt('rev-pan', pan);
    setTxt('rev-address', addressStr);

    setTxt('rev-emp-type', empType);
    setTxt('rev-sector-company', empDetailsStr);

    const compExpEl = document.getElementById('rev-company-exp');
    if (compExpEl) {
      const parentLabel = compExpEl.parentElement?.querySelector('.data-label');
      if (parentLabel) parentLabel.textContent = compExpLabel;
      if (isSalaried && sectorSelect?.value === 'Government') {
        compExpEl.parentElement.style.display = 'none';
      } else {
        compExpEl.parentElement.style.display = 'flex';
        compExpEl.textContent = compExpVal;
      }
    }

    const totalExpEl = document.getElementById('rev-total-exp');
    if (totalExpEl) {
      const parentLabel = totalExpEl.parentElement?.querySelector('.data-label');
      if (parentLabel) parentLabel.textContent = totalExpLabel;
      totalExpEl.textContent = totalExpVal;
    }

    setTxt('rev-income', incomeStr);
    setTxt('rev-loan-amt', loanAmtStr);
    setTxt('rev-purpose', purposeStr);
    setTxt('rev-tenure', tenureStr);
    setTxt('rev-existing-emi', emiStr);

    // Document Upload Review Statuses
    const getDocStatusText = (docKey) => {
      const doc = docState[docKey];
      if (!doc) return 'Not Uploaded';
      if (doc.files && doc.files.length > 0) {
        return `${doc.files.length} File(s) Uploaded`;
      }
      if (doc.status === 'Uploaded') return 'Uploaded';
      return 'Not Uploaded';
    };

    setTxt('rev-doc-pan', getDocStatusText('pan'));
    setTxt('rev-doc-aadhaar', docState['aadhaar']?.status === 'Uploaded' ? 'Uploaded' : (docState['aadhaar']?.front || docState['aadhaar']?.back ? 'Partial' : 'Not Uploaded'));
    setTxt('rev-doc-salary', getDocStatusText('salary'));
    setTxt('rev-doc-bank', getDocStatusText('bank'));

    const revDocBizproofGroup = document.getElementById('rev-doc-bizproof-group');
    if (isSalaried) {
      if (revDocBizproofGroup) revDocBizproofGroup.classList.add('hidden');
    } else {
      if (revDocBizproofGroup) revDocBizproofGroup.classList.remove('hidden');
      const bizTypeSel = document.getElementById('bizProofTypeSelect')?.value || 'Business Proof';
      setTxt('rev-doc-bizproof-label', bizTypeSel);
      setTxt('rev-doc-bizproof', getDocStatusText('bizproof'));
    }

    // Auto-populate CIBIL Applicant Details with exact entered values
    setTxt('cibil-name', fullName);
    const dobRaw = document.getElementById('dobInput')?.value || '';
    const dobDisplay = dobRaw ? new Date(dobRaw).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Not provided';
    setTxt('cibil-dob', dobDisplay);
    setTxt('cibil-pan', pan);
  }

  const legalModalOverlay = document.getElementById('legal-modal-overlay');
  const legalModalConsentCheck = document.getElementById('legalModalConsentCheck');
  const legalAcceptBtn = document.getElementById('legalAcceptBtn');
  const tabTermsBtn = document.getElementById('tabTermsBtn');
  const tabPrivacyBtn = document.getElementById('tabPrivacyBtn');
  const termsContentSection = document.getElementById('termsContentSection');
  const privacyContentSection = document.getElementById('privacyContentSection');
  const openTermsLink = document.getElementById('openTermsLink');
  const openPrivacyLink = document.getElementById('openPrivacyLink');
  const openCrifLink = document.getElementById('openCrifLink');
  const openExperianLink = document.getElementById('openExperianLink');
  const closeLegalModalBtn = document.getElementById('closeLegalModalBtn');
  const legalDeclineBtn = document.getElementById('legalDeclineBtn');

  function openLegalModal(tab = 'terms') {
    if (!legalModalOverlay) return;

    // Reset consent checkbox & button state when opening modal
    if (legalModalConsentCheck) legalModalConsentCheck.checked = true;
    if (legalAcceptBtn) legalAcceptBtn.disabled = false;

    legalModalOverlay.classList.remove('hidden');
    setTimeout(() => {
      legalModalOverlay.classList.add('active');
    }, 10);

    switchLegalTab(tab);
  }

  function closeLegalModal() {
    if (!legalModalOverlay) return;
    legalModalOverlay.classList.remove('active');
    setTimeout(() => {
      legalModalOverlay.classList.add('hidden');
    }, 250);
  }

  function switchLegalTab(tab) {
    if (tab === 'privacy') {
      tabTermsBtn?.classList.remove('active');
      tabPrivacyBtn?.classList.add('active');
      termsContentSection?.classList.add('hidden');
      privacyContentSection?.classList.remove('hidden');
    } else {
      tabTermsBtn?.classList.add('active');
      tabPrivacyBtn?.classList.remove('active');
      termsContentSection?.classList.remove('hidden');
      privacyContentSection?.classList.add('hidden');
    }
    const bodyEl = document.getElementById('legalModalBody');
    if (bodyEl) bodyEl.scrollTop = 0;
  }

  // Click Handlers for Links in OTP Consent Container
  if (openTermsLink) {
    openTermsLink.addEventListener('click', (e) => {
      e.preventDefault();
      openLegalModal('terms');
    });
  }

  if (openPrivacyLink) {
    openPrivacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      openLegalModal('privacy');
    });
  }

  if (openCrifLink) {
    openCrifLink.addEventListener('click', (e) => {
      e.preventDefault();
      openLegalModal('terms');
    });
  }

  if (openExperianLink) {
    openExperianLink.addEventListener('click', (e) => {
      e.preventDefault();
      openLegalModal('privacy');
    });
  }

  // Tab buttons click
  if (tabTermsBtn) tabTermsBtn.addEventListener('click', () => switchLegalTab('terms'));
  if (tabPrivacyBtn) tabPrivacyBtn.addEventListener('click', () => switchLegalTab('privacy'));

  // Close buttons
  if (closeLegalModalBtn) closeLegalModalBtn.addEventListener('click', closeLegalModal);
  if (legalDeclineBtn) legalDeclineBtn.addEventListener('click', closeLegalModal);

  // Bottom Consent Checkbox & Accept Button in Legal Modal
  if (legalModalConsentCheck && legalAcceptBtn) {
    legalModalConsentCheck.addEventListener('change', (e) => {
      legalAcceptBtn.disabled = !e.target.checked;
    });
  }

  if (legalAcceptBtn) {
    legalAcceptBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (legalModalConsentCheck) {
        legalModalConsentCheck.checked = true;
      }
      if (otpConsentCheck) {
        otpConsentCheck.checked = true;
      }
      checkOtpCompletion();
      closeLegalModal();
    });
  }

  // Expandable Lending Partners Floating Popover Toggle (+ More / Close)
  const morePartnersToggle = document.getElementById('more-partners-toggle');
  const morePartnersContainer = document.getElementById('more-partners-container');
  const popoverCloseBtn = document.getElementById('popover-close-btn');

  if (morePartnersToggle && morePartnersContainer) {
    morePartnersToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isHidden = morePartnersContainer.classList.contains('hidden');
      if (isHidden) {
        morePartnersContainer.classList.remove('hidden');
        morePartnersToggle.textContent = 'Close';
        morePartnersToggle.classList.add('active');
      } else {
        morePartnersContainer.classList.add('hidden');
        morePartnersToggle.textContent = '+ More';
        morePartnersToggle.classList.remove('active');
      }
    });

    if (popoverCloseBtn) {
      popoverCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        morePartnersContainer.classList.add('hidden');
        morePartnersToggle.textContent = '+ More';
        morePartnersToggle.classList.remove('active');
      });
    }

    document.addEventListener('click', (e) => {
      if (!morePartnersContainer.contains(e.target) && !morePartnersToggle.contains(e.target)) {
        morePartnersContainer.classList.add('hidden');
        morePartnersToggle.textContent = '+ More';
        morePartnersToggle.classList.remove('active');
      }
    });
  }

  // DOB Picker - uses native date input (no custom picker needed)
});


/* ==========================================================================
   AUTHENTICATION LOGIC (CreditGenAI)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const authMobileInput = document.getElementById('authMobileInput');
  const btnAuthContinue = document.getElementById('btn-auth-continue');

  const stateMobile = document.getElementById('auth-state-mobile');
  const stateOtp = document.getElementById('auth-state-otp');

  const otpDisplayNumber = document.getElementById('otp-display-number');
  const btnAuthChange = document.getElementById('btn-auth-change');

  const otpBoxes = document.querySelectorAll('.otp-box');
  const btnAuthVerify = document.getElementById('btn-auth-verify');

  const authContent = document.getElementById('auth-content');
  const appContent = document.getElementById('app-content');

  const appMobileInput = document.getElementById('mobile');

  const returningUserModal = document.getElementById('returningUserModal');
  const submittedAppModal = document.getElementById('submittedAppModal');

  // Helper function to cleanly extract up to 10 numeric digits and handle pasted country/trunk codes
  function cleanMobileNumber(str) {
    let digits = (str || '').replace(/[^0-9]/g, '');
    // If length exceeds 10 digits (e.g. pasted string with country code or trunk prefix)
    if (digits.length > 10) {
      // Strip trunk zero (e.g. 09876543210 -> 9876543210)
      if (digits.startsWith('0') && digits.length === 11) {
        digits = digits.slice(1);
      }
      // Strip India country code (91) (e.g. 919876543210 -> 9876543210)
      else if (digits.startsWith('91') && digits.length >= 12) {
        digits = digits.slice(2);
        if (digits.startsWith('0') && digits.length >= 11) {
          digits = digits.slice(1);
        }
      }
    }
    // Keep only the first 10 digits per requirement
    return digits.slice(0, 10);
  }

  // Robust validation for Indian Mobile Number in Authentication Card
  function validateAuthMobile(showError = true) {
    const authMobileError = document.getElementById('authMobileError');
    const val = authMobileInput ? authMobileInput.value.trim() : '';
    let errorMsg = '';

    if (!val) {
      errorMsg = 'Please enter your mobile number.';
    } else if (val.length < 10) {
      errorMsg = 'Mobile number must be exactly 10 digits.';
    } else if (!/^[6-9]\d{9}$/.test(val)) {
      errorMsg = 'Please enter a valid Indian mobile number.';
    }

    if (showError && authMobileError && authMobileInput) {
      if (errorMsg) {
        authMobileError.textContent = errorMsg;
        authMobileError.classList.remove('hidden');
        authMobileInput.classList.add('is-invalid');
      } else {
        authMobileError.textContent = '';
        authMobileError.classList.add('hidden');
        authMobileInput.classList.remove('is-invalid');
      }
    }
    return !errorMsg;
  }

  // Format Mobile Input with smooth inline UX (no unnecessary typing errors)
  if (authMobileInput) {
    const handleMobileInput = () => {
      const currentVal = authMobileInput.value;
      const cleaned = cleanMobileNumber(currentVal);
      if (currentVal !== cleaned) {
        authMobileInput.value = cleaned;
      }
      // Clear error while actively typing per UX requirement
      const authMobileError = document.getElementById('authMobileError');
      if (authMobileError && !authMobileError.classList.contains('hidden')) {
        authMobileError.textContent = '';
        authMobileError.classList.add('hidden');
        authMobileInput.classList.remove('is-invalid');
      }
    };

    authMobileInput.addEventListener('paste', (e) => {
      setTimeout(handleMobileInput, 10);
    });
    authMobileInput.addEventListener('input', (e) => {
      setTimeout(handleMobileInput, 10);
    });
    authMobileInput.addEventListener('change', (e) => {
      handleMobileInput();
    });
    authMobileInput.addEventListener('blur', () => {
      // Validate on blur only when field has lost focus
      validateAuthMobile(true);
    });
    authMobileInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && btnAuthContinue) {
        btnAuthContinue.click();
      }
    });
  }

  // OTP Countdown & Resend Timer Logic
  const otpCountdown = document.getElementById('otp-countdown');
  const otpTimerText = document.getElementById('otp-timer-text');
  const btnResendOtp = document.getElementById('btn-resend-otp');
  let otpTimerInterval = null;
  let timeLeft = 30;

  function startOtpTimer() {
    if (otpTimerInterval) clearInterval(otpTimerInterval);
    timeLeft = 30;
    if (otpTimerText) otpTimerText.style.display = 'inline';
    if (btnResendOtp) btnResendOtp.style.display = 'none';
    if (otpCountdown) otpCountdown.textContent = '(00:30)';

    otpTimerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft > 0) {
        const seconds = timeLeft < 10 ? '0' + timeLeft : timeLeft;
        if (otpCountdown) otpCountdown.textContent = `(00:${seconds})`;
      } else {
        clearInterval(otpTimerInterval);
        otpTimerInterval = null;
        if (otpTimerText) otpTimerText.style.display = 'none';
        if (btnResendOtp) btnResendOtp.style.display = 'inline-block';
      }
    }, 1000);
  }

  if (btnResendOtp) {
    btnResendOtp.addEventListener('click', () => {
      otpBoxes.forEach(box => { box.value = ''; });
      if (otpBoxes.length > 0) otpBoxes[0].focus();
      startOtpTimer();
      alert('A new OTP has been sent to +91 ' + (authMobileInput ? authMobileInput.value.trim() : 'your mobile number') + '.');
    });
  }

  // Switch to OTP State
  if (btnAuthContinue) {
    btnAuthContinue.addEventListener('click', () => {
      if (!validateAuthMobile(true)) {
        if (authMobileInput) authMobileInput.focus();
        return;
      }
      const mobileVal = authMobileInput.value.trim();

      // Set display number
      if (otpDisplayNumber) {
        otpDisplayNumber.textContent = '+91 ' + mobileVal;
      }

      // Transition out mobile state
      stateMobile.style.opacity = '0';
      setTimeout(() => {
        stateMobile.style.display = 'none';
        // Transition in OTP state
        stateOtp.style.display = 'block';
        setTimeout(() => {
          stateOtp.style.opacity = '1';
          stateOtp.style.transform = 'translateY(0)';
          if (otpBoxes.length > 0) otpBoxes[0].focus();
          startOtpTimer();
        }, 50);
      }, 300);
    });
  }

  // Switch back to Mobile State
  if (btnAuthChange) {
    btnAuthChange.addEventListener('click', () => {
      if (otpTimerInterval) clearInterval(otpTimerInterval);
      stateOtp.style.opacity = '0';
      stateOtp.style.transform = 'translateY(10px)';
      setTimeout(() => {
        stateOtp.style.display = 'none';
        stateMobile.style.display = 'block';
        setTimeout(() => {
          stateMobile.style.opacity = '1';
          const authMobileError = document.getElementById('authMobileError');
          if (authMobileError) authMobileError.classList.add('hidden');
          if (authMobileInput) {
            authMobileInput.classList.remove('is-invalid');
            authMobileInput.focus();
          }
        }, 50);
      }, 300);
    });
  }

  // OTP Inputs Logic
  otpBoxes.forEach((box, index) => {
    // Handle input
    box.addEventListener('input', (e) => {
      // Keep only digits
      box.value = box.value.replace(/[^0-9]/g, '');
      if (box.value && index < otpBoxes.length - 1) {
        otpBoxes[index + 1].focus();
      }
    });

    // Handle backspace
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !box.value && index > 0) {
        otpBoxes[index - 1].focus();
      }
    });

    // Handle Paste
    box.addEventListener('paste', (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
      if (pastedData) {
        pastedData.split('').forEach((char, i) => {
          if (otpBoxes[i]) {
            otpBoxes[i].value = char;
          }
        });
        const nextFocus = Math.min(pastedData.length, 5);
        otpBoxes[nextFocus].focus();
      }
    });
  });

  // Verify & Continue
  if (btnAuthVerify) {
    btnAuthVerify.addEventListener('click', () => {
      const mobileVal = authMobileInput.value.trim();

      // Check if OTP is fully entered (mock check)
      const otpVal = Array.from(otpBoxes).map(b => b.value).join('');
      if (otpVal.length < 6) {
        alert('Please enter the 6-digit OTP.');
        return;
      }

      // Transition to Main App
      authContent.style.display = 'none';
      appContent.style.display = 'block';

      // Set verified mobile number and lock
      if (appMobileInput) {
        appMobileInput.value = mobileVal;
      }

      // Trigger Mock States based on Mobile Number
      if (mobileVal === '9999999999' && returningUserModal) {
        returningUserModal.classList.remove('hidden');
      } else if (mobileVal === '8888888888' && submittedAppModal) {
        submittedAppModal.classList.remove('hidden');
      }
    });
  }

  // Close Modals on click (for mock demo purposes)
  const btnResumeApp = document.getElementById('btn-resume-app');
  const btnNewApp = document.getElementById('btn-new-app');
  const btnNewAppSubmitted = document.getElementById('btn-new-app-submitted');

  if (btnResumeApp) btnResumeApp.addEventListener('click', () => returningUserModal.classList.add('hidden'));
  if (btnNewApp) btnNewApp.addEventListener('click', () => returningUserModal.classList.add('hidden'));
  if (btnNewAppSubmitted) btnNewAppSubmitted.addEventListener('click', () => submittedAppModal.classList.add('hidden'));

  // Event Listeners for Legal Information Modal
  const legalModalOverlay = document.getElementById('legal-modal-overlay');
  const linkTermsConditions = document.getElementById('link-terms-conditions');
  const linkPrivacyPolicy = document.getElementById('link-privacy-policy');
  const btnCloseLegalX = document.getElementById('btn-close-legal-modal-x');
  const btnCloseLegalBottom = document.getElementById('btn-close-legal-modal-bottom');

  if (linkTermsConditions) {
    linkTermsConditions.addEventListener('click', (e) => {
      e.preventDefault();
      window.openLegalModal('terms');
    });
  }

  if (linkPrivacyPolicy) {
    linkPrivacyPolicy.addEventListener('click', (e) => {
      e.preventDefault();
      window.openLegalModal('privacy');
    });
  }

  if (btnCloseLegalX) btnCloseLegalX.addEventListener('click', window.closeLegalModal);
  if (btnCloseLegalBottom) btnCloseLegalBottom.addEventListener('click', window.closeLegalModal);

  if (legalModalOverlay) {
    legalModalOverlay.addEventListener('click', (e) => {
      if (e.target === legalModalOverlay) {
        window.closeLegalModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeLegalModal();
    }
  });

});

// Global Legal Information Modal Functions (Exposed on window)
window.openLegalModal = function (targetSection = 'terms') {
  const legalModalOverlay = document.getElementById('legal-modal-overlay');
  if (!legalModalOverlay) return;

  legalModalOverlay.classList.add('active');
  legalModalOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  const contentArea = document.getElementById('legal-modal-content-area');
  if (targetSection === 'privacy') {
    const privacySec = document.getElementById('section-privacy-policy');
    if (privacySec) {
      setTimeout(() => {
        privacySec.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  } else {
    if (contentArea) contentArea.scrollTop = 0;
  }

  const btnCloseLegalX = document.getElementById('btn-close-legal-modal-x');
  if (btnCloseLegalX) btnCloseLegalX.focus();
};

// Global Legal Information Section Controller Functions
window.openLegalScreen = function (initialView = 'hub') {
  const screen = document.getElementById('legal-page-screen');
  if (!screen) return;

  screen.style.display = 'flex';
  screen.classList.add('active');
  document.body.style.overflow = 'hidden';

  window.openLegalView(initialView);

  if (window.history && window.history.pushState) {
    window.history.pushState({ legalScreenOpen: true, currentView: initialView }, '');
  }
};

window.openLegalView = function (viewName = 'hub') {
  const hubView = document.getElementById('legal-view-hub');
  const termsView = document.getElementById('legal-view-terms');
  const privacyView = document.getElementById('legal-view-privacy');

  if (hubView) hubView.style.display = (viewName === 'hub') ? 'flex' : 'none';
  if (termsView) termsView.style.display = (viewName === 'terms') ? 'flex' : 'none';
  if (privacyView) privacyView.style.display = (viewName === 'privacy') ? 'flex' : 'none';

  const screen = document.getElementById('legal-page-screen');
  if (screen) screen.scrollTop = 0;
};

window.closeLegalScreen = function () {
  const screen = document.getElementById('legal-page-screen');
  if (!screen) return;

  screen.style.display = 'none';
  screen.classList.remove('active');
  document.body.style.overflow = '';
};

// Browser Back Button Support (popstate)
window.addEventListener('popstate', function (e) {
  const screen = document.getElementById('legal-page-screen');
  if (screen && screen.classList.contains('active')) {
    const state = e.state;
    if (state && state.legalScreenOpen) {
      window.openLegalView(state.currentView || 'hub');
    } else {
      window.closeLegalScreen();
    }
  }
});

// Backward Compatibility Aliases for Inline Handlers & Triggers
window.openLegalModal = function (targetSection = 'terms') {
  window.openLegalScreen(targetSection === 'privacy' ? 'privacy' : (targetSection === 'terms' ? 'terms' : 'hub'));
};
window.closeLegalModal = window.closeLegalScreen;

// CIBIL Score Verification Consent Legal Modal Functions
window.switchCibilTab = function (tabName = 'terms') {
  const termsTabBtn = document.getElementById('cibil-tab-terms');
  const privacyTabBtn = document.getElementById('cibil-tab-privacy');
  const termsContent = document.getElementById('cibil-modal-terms-content');
  const privacyContent = document.getElementById('cibil-modal-privacy-content');
  const bodyArea = document.getElementById('cibil-modal-body-area');

  if (tabName === 'privacy') {
    if (termsTabBtn) termsTabBtn.classList.remove('active');
    if (privacyTabBtn) privacyTabBtn.classList.add('active');
    if (termsContent) termsContent.style.display = 'none';
    if (privacyContent) privacyContent.style.display = 'block';
  } else {
    if (termsTabBtn) termsTabBtn.classList.add('active');
    if (privacyTabBtn) privacyTabBtn.classList.remove('active');
    if (termsContent) termsContent.style.display = 'block';
    if (privacyContent) privacyContent.style.display = 'none';
  }

  if (bodyArea) bodyArea.scrollTop = 0;
};

window.openCibilModal = function (type = 'terms') {
  const modal = document.getElementById('cibil-legal-modal-overlay');
  if (!modal) return;

  window.switchCibilTab(type);

  modal.style.display = 'flex';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeCibilModal = function () {
  const modal = document.getElementById('cibil-legal-modal-overlay');
  if (!modal) return;

  modal.style.display = 'none';
  modal.classList.remove('active');
  document.body.style.overflow = '';
};

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    const modal = document.getElementById('cibil-legal-modal-overlay');
    if (modal && (modal.style.display === 'flex' || modal.classList.contains('active'))) {
      window.closeCibilModal();
    }
    const dobModal = document.getElementById('dobCalendarModalBackdrop');
    if (dobModal && dobModal.classList.contains('active')) {
      window.closeDobModal();
    }
  }
});

/* ==========================================================================
   Option 2: Grid View Switcher DOB Calendar Modal Controller
   ========================================================================== */
(function () {
  const dobInput = document.getElementById('dobInput');
  const dobBackdrop = document.getElementById('dobCalendarModalBackdrop');
  const headerMonthBtn = document.getElementById('dobHeaderMonthBtn');
  const headerYearBtn = document.getElementById('dobHeaderYearBtn');
  const prevMonthBtn = document.getElementById('dobPrevMonthBtn');
  const nextMonthBtn = document.getElementById('dobNextMonthBtn');

  const daysView = document.getElementById('dobModalDaysView');
  const monthsView = document.getElementById('dobModalMonthsView');
  const yearsView = document.getElementById('dobModalYearsView');

  const daysGrid = document.getElementById('dobModalDaysGrid');
  const monthsGrid = document.getElementById('dobModalMonthsGrid');
  const yearsGrid = document.getElementById('dobModalYearsGrid');

  const closeBtn = document.getElementById('dobModalCloseBtn');
  const clearBtn = document.getElementById('dobModalClearBtn');
  const todayBtn = document.getElementById('dobModalTodayBtn');
  const applyBtn = document.getElementById('dobModalApplyBtn');

  if (!dobInput || !dobBackdrop || !daysGrid || !monthsGrid || !yearsGrid) return;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const currentYear = new Date().getFullYear();
  const minYear = 1950;
  const maxYear = currentYear - 18; // Age 18 minimum constraint

  let activeYear = maxYear - 7; // Default ~1998 (26 yrs old)
  let activeMonth = 5; // June
  let selectedDay = 15;
  let currentView = 'days'; // 'days' | 'months' | 'years'

  function updateHeaderTitles() {
    if (headerMonthBtn) headerMonthBtn.textContent = monthNames[activeMonth];
    if (headerYearBtn) headerYearBtn.textContent = activeYear;
  }

  function switchView(view) {
    currentView = view;
    if (daysView) daysView.classList.toggle('dob-view-hidden', view !== 'days');
    if (monthsView) monthsView.classList.toggle('dob-view-hidden', view !== 'months');
    if (yearsView) yearsView.classList.toggle('dob-view-hidden', view !== 'years');

    if (view === 'months') renderMonthsGrid();
    if (view === 'years') renderYearsGrid();
    if (view === 'days') renderDaysGrid();
  }

  function renderDaysGrid() {
    updateHeaderTitles();
    daysGrid.innerHTML = '';

    const firstDayIndex = new Date(activeYear, activeMonth, 1).getDay();
    const daysInMonth = new Date(activeYear, activeMonth + 1, 0).getDate();

    // Render empty lead cells
    for (let i = 0; i < firstDayIndex; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'dob-day-cell empty';
      daysGrid.appendChild(emptyCell);
    }

    // Parse current value in dobInput if any
    let currValDay = null;
    let currValMonth = null;
    let currValYear = null;
    if (dobInput.value) {
      const parts = dobInput.value.split('-');
      if (parts.length === 3) {
        currValYear = parseInt(parts[0], 10);
        currValMonth = parseInt(parts[1], 10) - 1;
        currValDay = parseInt(parts[2], 10);
      }
    }

    // Render Day Cells
    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement('div');
      cell.className = 'dob-day-cell';
      cell.textContent = d;

      if (currValYear === activeYear && currValMonth === activeMonth && currValDay === d) {
        cell.classList.add('selected');
      }

      cell.addEventListener('click', function () {
        const prev = daysGrid.querySelector('.dob-day-cell.selected');
        if (prev) prev.classList.remove('selected');

        cell.classList.add('selected');
        selectedDay = d;
        applyDobSelection(false);
      });

      daysGrid.appendChild(cell);
    }
  }

  function renderMonthsGrid() {
    updateHeaderTitles();
    monthsGrid.innerHTML = '';

    monthShort.forEach((mName, idx) => {
      const item = document.createElement('div');
      item.className = 'dob-month-item';
      if (idx === activeMonth) item.classList.add('selected');
      item.textContent = mName;

      item.addEventListener('click', function () {
        activeMonth = idx;
        switchView('days');
      });

      monthsGrid.appendChild(item);
    });
  }

  function renderYearsGrid() {
    updateHeaderTitles();
    yearsGrid.innerHTML = '';

    for (let y = maxYear; y >= minYear; y--) {
      const item = document.createElement('div');
      item.className = 'dob-year-item';
      if (y === activeYear) item.classList.add('selected');
      item.textContent = y;

      item.addEventListener('click', function () {
        activeYear = y;
        switchView('months'); // Transition year -> months grid -> days
      });

      yearsGrid.appendChild(item);
    }

    // Auto-scroll selected year into view
    setTimeout(() => {
      const selYearEl = yearsGrid.querySelector('.dob-year-item.selected');
      if (selYearEl) {
        selYearEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }, 50);
  }

  function applyDobSelection(shouldCloseModal) {
    if (!selectedDay) return;
    const formattedMonth = String(activeMonth + 1).padStart(2, '0');
    const formattedDay = String(selectedDay).padStart(2, '0');
    dobInput.value = `${activeYear}-${formattedMonth}-${formattedDay}`;

    if (typeof validateDob === 'function') validateDob();
    if (typeof populateReviewSummary === 'function') populateReviewSummary();

    if (shouldCloseModal) {
      window.closeDobModal();
    }
  }

  let lastOpenedTime = 0;

  window.openDobModal = function (evt) {
    if (evt) {
      if (typeof evt.stopPropagation === 'function') evt.stopPropagation();
      if (typeof evt.preventDefault === 'function') evt.preventDefault();
    }

    const now = Date.now();
    if (now - lastOpenedTime < 300) return;
    lastOpenedTime = now;

    if (!dobBackdrop) return;

    if (dobInput && dobInput.value) {
      const parts = dobInput.value.split('-');
      if (parts.length === 3) {
        activeYear = parseInt(parts[0], 10);
        activeMonth = parseInt(parts[1], 10) - 1;
        selectedDay = parseInt(parts[2], 10);
      }
    } else {
      selectedDay = 15;
    }

    switchView('days');
    dobBackdrop.style.display = 'flex';
    dobBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeDobModal = function () {
    if (!dobBackdrop) return;
    dobBackdrop.style.display = 'none';
    dobBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Header Navigation & View Switching Listeners
  if (headerMonthBtn) {
    headerMonthBtn.addEventListener('click', function () {
      if (currentView === 'months') switchView('days');
      else switchView('months');
    });
  }

  if (headerYearBtn) {
    headerYearBtn.addEventListener('click', function () {
      if (currentView === 'years') switchView('days');
      else switchView('years');
    });
  }

  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', function () {
      if (activeMonth === 0) {
        activeMonth = 11;
        if (activeYear > minYear) activeYear--;
      } else {
        activeMonth--;
      }
      switchView('days');
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', function () {
      if (activeMonth === 11) {
        activeMonth = 0;
        if (activeYear < maxYear) activeYear++;
      } else {
        activeMonth++;
      }
      switchView('days');
    });
  }

  // Event Listeners for Input & Icon
  dobInput.addEventListener('click', function (e) {
    window.openDobModal(e);
  });

  const dobWrapper = dobInput.closest('.input-wrapper');
  if (dobWrapper) {
    dobWrapper.addEventListener('click', function (e) {
      if (e.target !== dobInput) {
        window.openDobModal(e);
      }
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', window.closeDobModal);
  if (applyBtn) applyBtn.addEventListener('click', function () {
    applyDobSelection(true);
    window.closeDobModal();
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      dobInput.value = '';
      selectedDay = null;
      switchView('days');
      if (typeof validateDob === 'function') validateDob();
      if (typeof populateReviewSummary === 'function') populateReviewSummary();
    });
  }

  if (todayBtn) {
    todayBtn.addEventListener('click', function () {
      const d = new Date();
      activeYear = maxYear;
      activeMonth = d.getMonth();
      selectedDay = d.getDate();
      switchView('days');
      applyDobSelection(true);
    });
  }

  // Backdrop click close
  dobBackdrop.addEventListener('click', function (e) {
    if (Date.now() - lastOpenedTime < 300) return;
    if (e.target === dobBackdrop) {
      window.closeDobModal();
    }
  });
})();
