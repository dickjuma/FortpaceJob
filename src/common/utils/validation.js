export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^\+?[0-9]{7,15}$/;

export function validateEmail(value) {
  const email = String(value || '').trim().toLowerCase();
  if (!email) return 'Email is required.';
  if (!EMAIL_REGEX.test(email)) return 'Enter a valid email address.';
  return '';
}

export function validatePassword(value) {
  const password = String(value || '');
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(password)) return 'Password must include an uppercase letter.';
  if (!/[0-9]/.test(password)) return 'Password must include a number.';
  return '';
}

export function validatePhone(value) {
  const phone = String(value || '').trim();
  if (!phone) return 'Phone number is required.';
  if (!PHONE_REGEX.test(phone)) return 'Enter a valid phone number.';
  return '';
}

export function validateRequired(value, label = 'This field') {
  if (value == null || String(value).trim() === '') return `${label} is required.`;
  return '';
}

export function validateMinLength(value, min, label = 'This field') {
  if (String(value || '').trim().length < min) {
    return `${label} must be at least ${min} characters.`;
  }
  return '';
}

export function validateMaxLength(value, max, label = 'This field') {
  if (String(value || '').trim().length > max) {
    return `${label} must be at most ${max} characters.`;
  }
  return '';
}

export function validateName(value, label = 'Name') {
  const name = String(value || '').trim();
  if (!name) return `${label} is required.`;
  if (name.length < 2) return `${label} must be at least 2 characters.`;
  if (!/^[a-zA-Z\s'.-]+$/.test(name)) return `${label} contains invalid characters.`;
  return '';
}

export function validateOtp(value, length = 6) {
  const otp = String(value || '').replace(/\s/g, '');
  if (!otp) return 'Verification code is required.';
  if (!/^\d+$/.test(otp)) return 'Verification code must contain digits only.';
  if (otp.length !== length) return `Enter the complete ${length}-digit code.`;
  return '';
}

export function validateConfirmPassword(password, confirm) {
  if (!confirm) return 'Please confirm your password.';
  if (String(password) !== String(confirm)) return 'Passwords do not match.';
  return '';
}

export function validatePositiveNumber(value, label = 'Amount') {
  const num = Number(value);
  if (value === '' || value == null || Number.isNaN(num)) return `${label} is required.`;
  if (num <= 0) return `${label} must be greater than zero.`;
  return '';
}

export function validateBudgetRange(minValue, maxValue) {
  const min = Number(minValue);
  const max = Number(maxValue);
  const minErr = validatePositiveNumber(minValue, 'Minimum budget');
  if (minErr) return minErr;
  const maxErr = validatePositiveNumber(maxValue, 'Maximum budget');
  if (maxErr) return maxErr;
  if (min > max) return 'Minimum budget cannot exceed maximum budget.';
  return '';
}

export function validateRating(value, min = 1, max = 5) {
  const rating = Number(value);
  if (!rating || Number.isNaN(rating)) return 'Please select a rating.';
  if (rating < min || rating > max) return `Rating must be between ${min} and ${max}.`;
  return '';
}

export function validateSelect(value, label = 'Selection') {
  if (value == null || String(value).trim() === '') return `Please select ${label.toLowerCase()}.`;
  return '';
}

export function validateTermsAccepted(value) {
  if (!value) return 'You must agree to the terms to continue.';
  return '';
}

export function validateCoverLetter(value, min = 50) {
  const letter = String(value || '').trim();
  if (!letter) return 'Cover letter is required.';
  if (letter.length < min) return `Cover letter must be at least ${min} characters.`;
  return '';
}

export function validateDisputeDescription(value, min = 20) {
  const text = String(value || '').trim();
  if (!text) return 'Please describe the issue.';
  if (text.length < min) return `Description must be at least ${min} characters.`;
  return '';
}

export function validateRevisionFeedback(value, min = 20) {
  const text = String(value || '').trim();
  if (!text) return 'Please describe what needs to be changed.';
  if (text.length < min) return `Feedback must be at least ${min} characters.`;
  return '';
}

export function validateWithdrawalAmount(value, min, max, symbol = '$') {
  const num = Number(value);
  if (value === '' || value == null || Number.isNaN(num)) return 'Enter a withdrawal amount.';
  if (num < min) return `Minimum withdrawal is ${symbol}${min.toFixed(2)}.`;
  if (num > max) return `Amount exceeds available balance (${symbol}${max.toFixed(2)}).`;
  return '';
}

export function validateJobTitle(value) {
  return validateMinLength(value, 5, 'Job title');
}

export function validateJobDescription(value, min = 50) {
  return validateMinLength(value, min, 'Job description');
}

export function validateContactForm(form) {
  const errors = {};
  const nameErr = validateName(form.name, 'Name');
  if (nameErr) errors.name = nameErr;
  const emailErr = validateEmail(form.email);
  if (emailErr) errors.email = emailErr;
  const messageErr = validateMinLength(form.message, 10, 'Message');
  if (messageErr) errors.message = messageErr;
  if (form.phone) {
    const phoneErr = validatePhone(form.phone);
    if (phoneErr) errors.phone = phoneErr;
  }
  return errors;
}

/** Run validators; returns first error string or empty string. */
export function firstError(...checks) {
  for (const check of checks) {
    const err = typeof check === 'function' ? check() : check;
    if (err) return err;
  }
  return '';
}

/** Adapter for react-hook-form `validate` rules. */
export function rhfValidate(validator, ...args) {
  return (value) => validator(value, ...args) || true;
}

/** Adapter for react-hook-form confirm-password fields. */
export function rhfValidateConfirm(getPassword) {
  return (value) => validateConfirmPassword(getPassword(), value) || true;
}
