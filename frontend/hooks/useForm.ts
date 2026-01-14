"use client";

import { useState, useCallback, useMemo } from "react";
import { FormState } from "@/types";

type ValidationRule<T> = {
  validate: (value: T[keyof T], values: T) => boolean;
  message: string;
};

type FieldValidation<T> = {
  [K in keyof T]?: ValidationRule<T>[];
};

interface UseFormOptions<T> {
  initialValues: T;
  validations?: FieldValidation<T>;
  onSubmit?: (values: T) => void | Promise<void>;
}

interface FieldProps {
  value: unknown;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur: () => void;
  name: string;
}

/**
 * Hook for managing form state with validation
 */
export function useForm<T extends Record<string, unknown>>(options: UseFormOptions<T>) {
  const { initialValues, validations = {}, onSubmit } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  // Validate a single field
  const validateField = useCallback(
    (name: keyof T, value: T[keyof T]): string | undefined => {
      const fieldValidations = validations[name];
      if (!fieldValidations) return undefined;

      for (const rule of fieldValidations) {
        if (!rule.validate(value, values)) {
          return rule.message;
        }
      }

      return undefined;
    },
    [validations, values]
  );

  // Validate all fields
  const validateAll = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    for (const key of Object.keys(values) as (keyof T)[]) {
      const error = validateField(key, values[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  }, [values, validateField]);

  // Set a single field value
  const setFieldValue = useCallback(
    (name: keyof T, value: T[keyof T]) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      // Validate on change if field was touched
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [touched, validateField]
  );

  // Set field touched
  const setFieldTouched = useCallback(
    (name: keyof T, isTouched = true) => {
      setTouched((prev) => ({ ...prev, [name]: isTouched }));

      if (isTouched) {
        const error = validateField(name, values[name]);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [values, validateField]
  );

  // Handle input change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const finalValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
      setFieldValue(name as keyof T, finalValue as T[keyof T]);
    },
    [setFieldValue]
  );

  // Handle blur
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setFieldTouched(name as keyof T);
    },
    [setFieldTouched]
  );

  // Handle submit
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      setSubmitCount((c) => c + 1);

      // Touch all fields
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Record<keyof T, boolean>
      );
      setTouched(allTouched);

      const isValid = validateAll();
      if (!isValid) return;

      setIsSubmitting(true);
      try {
        await onSubmit?.(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validateAll, onSubmit]
  );

  // Reset form
  const reset = useCallback(
    (newValues?: T) => {
      setValues(newValues || initialValues);
      setTouched({});
      setErrors({});
      setIsSubmitting(false);
      setSubmitCount(0);
    },
    [initialValues]
  );

  // Get field props helper
  const getFieldProps = useCallback(
    (name: keyof T): FieldProps => ({
      name: name as string,
      value: values[name],
      onChange: handleChange,
      onBlur: handleBlur as unknown as () => void,
    }),
    [values, handleChange, handleBlur]
  );

  // Computed states
  const isDirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(initialValues),
    [values, initialValues]
  );

  const isValid = useMemo(() => Object.values(errors).every((e) => !e), [errors]);

  const formState: FormState = {
    isDirty,
    isValid,
    isSubmitting,
    submitCount,
  };

  return {
    values,
    errors,
    touched,
    formState,
    setFieldValue,
    setFieldTouched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    getFieldProps,
    setValues,
    setErrors,
    validateField,
    validateAll,
  };
}

// Common validation helpers
export const formValidators = {
  required: (message = "This field is required"): ValidationRule<Record<string, unknown>> => ({
    validate: (value) => {
      if (typeof value === "string") return value.trim().length > 0;
      return value !== undefined && value !== null;
    },
    message,
  }),

  minLength: (min: number, message?: string): ValidationRule<Record<string, unknown>> => ({
    validate: (value) => typeof value === "string" && value.length >= min,
    message: message || `Must be at least ${min} characters`,
  }),

  maxLength: (max: number, message?: string): ValidationRule<Record<string, unknown>> => ({
    validate: (value) => typeof value === "string" && value.length <= max,
    message: message || `Must be at most ${max} characters`,
  }),

  email: (message = "Invalid email address"): ValidationRule<Record<string, unknown>> => ({
    validate: (value) =>
      typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
  }),

  pattern: (
    regex: RegExp,
    message = "Invalid format"
  ): ValidationRule<Record<string, unknown>> => ({
    validate: (value) => typeof value === "string" && regex.test(value),
    message,
  }),

  min: (min: number, message?: string): ValidationRule<Record<string, unknown>> => ({
    validate: (value) => typeof value === "number" && value >= min,
    message: message || `Must be at least ${min}`,
  }),

  max: (max: number, message?: string): ValidationRule<Record<string, unknown>> => ({
    validate: (value) => typeof value === "number" && value <= max,
    message: message || `Must be at most ${max}`,
  }),
};
