export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateName(value: string): ValidationResult {
  if (!value.trim()) return { valid: false, error: 'Name is required' };
  if (value.trim().length < 2) return { valid: false, error: 'Name must be at least 2 characters' };
  return { valid: true };
}

export function validateEmail(value: string): ValidationResult {
  if (!value.trim()) return { valid: false, error: 'Email is required' };
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(value)) return { valid: false, error: 'Enter a valid email address' };
  return { valid: true };
}

export function validatePhone(value: string): ValidationResult {
  if (!value.trim()) return { valid: false, error: 'Phone number is required' };
  const digits = value.replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 15) return { valid: false, error: 'Enter a valid Australian phone number' };
  return { valid: true };
}

export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value.trim()) return { valid: false, error: `${fieldName} is required` };
  return { valid: true };
}

export function validateMessage(value: string): ValidationResult {
  if (!value.trim()) return { valid: false, error: 'Message is required' };
  if (value.trim().length < 10) return { valid: false, error: 'Please provide a bit more detail (at least 10 characters)' };
  return { valid: true };
}
