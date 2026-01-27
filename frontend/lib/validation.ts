/**
 * Validation utilities and helpers
 */

// ============================================================================
// Format Validation
// ============================================================================

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
  if (!message) return false;
  const trimmed = message.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
}

/**
 * Check if string is empty or whitespace only
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

/**
 * Check if value is defined and not null
 */
export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

/**
 * Validate transaction hash format
 */
export function isValidTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Validate email format (simple)
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string, protocols = ["http:", "https:"]): boolean {
  try {
    const urlObj = new URL(url);
    return protocols.includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * Validate date string
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Validate UUID format (v4)
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// ============================================================================
// Number Validation
// ============================================================================

/**
 * Validate integer
 */
export function isInteger(str: string): boolean {
  return /^-?\d+$/.test(str);
}

/**
 * Validate float
 */
export function isFloat(str: string): boolean {
  return /^-?\d*(\.\d+)?$/.test(str) && str !== "" && str !== "." && str !== "-";
}

/**
 * Validate positive number
 */
export function isPositiveNumber(value: number): boolean {
  return typeof value === "number" && !isNaN(value) && value > 0;
}

/**
 * Validate non-negative number
 */
export function isNonNegativeNumber(value: number): boolean {
  return typeof value === "number" && !isNaN(value) && value >= 0;
}

// ============================================================================
// Password Validation
// ============================================================================

export interface PasswordStrength {
  score: number; // 0-4
  hasLowerCase: boolean;
  hasUpperCase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  isLongEnough: boolean;
}

/**
 * Check password strength
 */
export function checkPasswordStrength(password: string, minLength = 8): PasswordStrength {
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isLongEnough = password.length >= minLength;

  let score = 0;
  if (isLongEnough) score++;
  if (hasLowerCase && hasUpperCase) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  return {
    score,
    hasLowerCase,
    hasUpperCase,
    hasNumber,
    hasSpecial,
    isLongEnough,
  };
}

// ============================================================================
// File Validation
// ============================================================================

/**
 * Validate file size
 */
export function isValidFileSize(file: File, maxSizeInBytes: number): boolean {
  return file.size <= maxSizeInBytes;
}

/**
 * Validate file type
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  // Check exact mime type match or wildcard (image/*)
  return allowedTypes.some((type) => {
    if (type.endsWith("/*")) {
      const category = type.split("/")[0];
      return file.type.startsWith(`${category}/`);
    }
    return file.type === type;
  });
}

// ============================================================================
// Object Validation
// ============================================================================

/**
 * Deep check for required keys
 */
export function hasRequiredKeys(obj: Record<string, unknown>, keys: string[]): boolean {
  return keys.every((key) => {
    const value = obj[key];
    return value !== undefined && value !== null && value !== "";
  });
}

// ============================================================================
// Schema-like Validation helpers
// ============================================================================

export type Validator<T> = (value: unknown) => value is T;

/**
 * Create a string validator
 */
export function stringValidator(options: { minLength?: number; maxLength?: number; pattern?: RegExp } = {}): Validator<string> {
  return (value: unknown): value is string => {
    if (typeof value !== "string") return false;
    if (options.minLength !== undefined && value.length < options.minLength) return false;
    if (options.maxLength !== undefined && value.length > options.maxLength) return false;
    if (options.pattern !== undefined && !options.pattern.test(value)) return false;
    return true;
  };
}

/**
 * Create a number validator
 */
export function numberValidator(options: { min?: number; max?: number; integer?: boolean } = {}): Validator<number> {
  return (value: unknown): value is number => {
    if (typeof value !== "number" || isNaN(value)) return false;
    if (options.integer && !Number.isInteger(value)) return false;
    if (options.min !== undefined && value < options.min) return false;
    if (options.max !== undefined && value > options.max) return false;
    return true;
  };
}

/**
 * Create an array validator
 */
export function arrayValidator<T>(itemValidator: Validator<T>, options: { minLength?: number; maxLength?: number } = {}): Validator<T[]> {
  return (value: unknown): value is T[] => {
    if (!Array.isArray(value)) return false;
    if (options.minLength !== undefined && value.length < options.minLength) return false;
    if (options.maxLength !== undefined && value.length > options.maxLength) return false;
    return value.every(itemValidator);
  };
}
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
