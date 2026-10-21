'use client';

import { useState, useCallback } from 'react';
import type { ObjectSchema } from 'joi';

export function useJoiValidation<T extends Record<string, unknown>>(schema: ObjectSchema<T>) {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validate = useCallback(
    (values: T): boolean => {
      const result = schema.validate(values, {
        abortEarly: false,
        allowUnknown: true,
      });

      if (!result.error) {
        setErrors({});
        return true;
      }

      const formattedErrors: Partial<Record<keyof T, string>> = {};
      for (const item of result.error.details) {
        const key = item.path[0] as keyof T;
        if (!formattedErrors[key]) {
          formattedErrors[key] = item.message.replace(/['"]/g, '');
        }
      }

      setErrors(formattedErrors);
      return false;
    },
    [schema]
  );

  const validateField = useCallback(
    (field: keyof T, value: unknown) => {
      const fieldSchema = schema.extract(field as string);
      if (!fieldSchema) return;

      const result = fieldSchema.validate(value);
      setErrors((prev) => {
        const next = { ...prev };
        if (result.error) {
          next[field] = result.error.message.replace(/['"]/g, '');
        } else {
          delete next[field];
        }
        return next;
      });
    },
    [schema]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setFieldError = useCallback((field: keyof T, message: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  }, []);

  return {
    errors,
    validate,
    validateField,
    clearErrors,
    setFieldError,
    hasErrors: Object.keys(errors).length > 0,
  };
}
