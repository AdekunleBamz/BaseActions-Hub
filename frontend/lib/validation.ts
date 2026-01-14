/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate message length
 */
export function isValidMessage(message: string, minLength = 1, maxLength = 280): boolean {
  const trimmed = message.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
}

/**
 * Check if string is empty or whitespace only
 */
export function isEmpty(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

/**
 * Validate transaction hash format
 */
export function isValidTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate ENS name format
 */
export function isValidEnsName(name: string): boolean {
  return /^[a-zA-Z0-9-]+\.eth$/.test(name);
}

/**
 * Check if value is a positive number
 */
export function isPositiveNumber(value: unknown): boolean {
  return typeof value === "number" && !isNaN(value) && value > 0;
}

/**
 * Check if value is within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validate hexadecimal string
 */
export function isValidHex(value: string): boolean {
  return /^0x[a-fA-F0-9]+$/.test(value);
}

/**
 * Check for profanity (basic filter)
 */
const basicProfanityList = ["spam", "scam", "phishing"];

export function containsProfanity(text: string): boolean {
  const lowerText = text.toLowerCase();
  return basicProfanityList.some((word) => lowerText.includes(word));
}

/**
 * Sanitize string by removing HTML tags
 */
export function sanitizeHtml(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}

/**
 * Check if string contains only alphanumeric characters
 */
export function isAlphanumeric(text: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(text);
}

/**
 * Validation result type
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate with custom rules
 */
export function validate(
  value: string,
  rules: Array<{ check: (val: string) => boolean; message: string }>
): ValidationResult {
  for (const rule of rules) {
    if (!rule.check(value)) {
      return { isValid: false, error: rule.message };
    }
  }
  return { isValid: true };
}
