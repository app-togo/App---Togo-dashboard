export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: "weak" | "fair" | "good" | "strong";
}

export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /[0-9]/,
  hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
};

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let passedChecks = 0;

  // Check minimum length
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`);
  } else {
    passedChecks++;
  }

  // Check for uppercase
  if (!PASSWORD_REQUIREMENTS.hasUppercase.test(password)) {
    errors.push("Password must contain at least one uppercase letter (A-Z)");
  } else {
    passedChecks++;
  }

  // Check for lowercase
  if (!PASSWORD_REQUIREMENTS.hasLowercase.test(password)) {
    errors.push("Password must contain at least one lowercase letter (a-z)");
  } else {
    passedChecks++;
  }

  // Check for number
  if (!PASSWORD_REQUIREMENTS.hasNumber.test(password)) {
    errors.push("Password must contain at least one number (0-9)");
  } else {
    passedChecks++;
  }

  // Check for special character
  if (!PASSWORD_REQUIREMENTS.hasSpecialChar.test(password)) {
    errors.push("Password must contain at least one special character (!@#$%^&*..etc)");
  } else {
    passedChecks++;
  }

  // Determine strength
  let strength: "weak" | "fair" | "good" | "strong" = "weak";
  if (passedChecks <= 2) {
    strength = "weak";
  } else if (passedChecks === 3) {
    strength = "fair";
  } else if (passedChecks === 4) {
    strength = "good";
  } else if (passedChecks === 5) {
    strength = "strong";
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
}
