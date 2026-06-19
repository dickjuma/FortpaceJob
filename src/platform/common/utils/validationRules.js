import {
  rhfValidate,
  rhfValidateConfirm,
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequired,
  validateMinLength,
  validateName,
  validateTermsAccepted,
  validateCoverLetter,
  validateDisputeDescription,
  validateRevisionFeedback,
} from './validation';

export const emailRule = { validate: rhfValidate(validateEmail) };
export const passwordRule = { validate: rhfValidate(validatePassword) };
export const phoneRule = { validate: rhfValidate(validatePhone) };
export const requiredRule = (label) => ({ validate: rhfValidate(validateRequired, label) });
export const minLengthRule = (min, label) => ({ validate: rhfValidate(validateMinLength, min, label) });
export const nameRule = (label = 'Name') => ({ validate: rhfValidate(validateName, label) });
export const termsRule = { validate: rhfValidate(validateTermsAccepted) };
export const coverLetterRule = { validate: rhfValidate(validateCoverLetter) };
export const disputeDescriptionRule = { validate: rhfValidate(validateDisputeDescription) };
export const revisionFeedbackRule = { validate: rhfValidate(validateRevisionFeedback) };

export function confirmPasswordRule(getPassword) {
  return { validate: rhfValidateConfirm(getPassword) };
}

export const loginRules = {
  email: emailRule,
  password: requiredRule('Password'),
};

export const registerRules = {
  firstName: nameRule('First name'),
  lastName: nameRule('Last name'),
  fullName: nameRule('Full name'),
  email: emailRule,
  phone: phoneRule,
  password: passwordRule,
  terms: termsRule,
};
