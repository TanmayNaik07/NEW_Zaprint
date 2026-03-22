/**
 * Input validation and sanitization utilities for Zaprint API routes.
 * 
 * OWASP: Protects against injection attacks (XSS, SQL injection via Supabase),
 * mass-assignment, and data integrity issues.
 * 
 * All validators return a result object with either validated data or an error message.
 * This approach ensures type safety and consistent error handling.
 */

import { NextResponse } from "next/server"

// --- Types ---

interface ValidationSuccess<T> {
  success: true
  data: T
}

interface ValidationError {
  success: false
  error: string
}

type ValidationResult<T> = ValidationSuccess<T> | ValidationError

// --- Core Validators ---

/**
 * Validate that a value is a valid UUID v4 string.
 * OWASP: Prevents injection via malformed IDs passed to database queries.
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isValidUUID(value: unknown): value is string {
  return typeof value === "string" && UUID_REGEX.test(value)
}

/**
 * Sanitize a text string by stripping HTML tags and trimming whitespace.
 * OWASP: Mitigates stored XSS attacks on user-generated content.
 */
export function sanitizeText(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")  // Strip HTML tags
    .replace(/&/g, "&amp;")    // Encode remaining special chars
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .trim()
}

/**
 * Validate a string field with length constraints.
 */
export function validateString(
  value: unknown,
  fieldName: string,
  options: { minLength?: number; maxLength?: number; required?: boolean } = {}
): ValidationResult<string> {
  const { minLength = 0, maxLength = 10000, required = true } = options

  if (value === undefined || value === null || value === "") {
    if (required) {
      return { success: false, error: `${fieldName} is required` }
    }
    return { success: true, data: "" }
  }

  if (typeof value !== "string") {
    return { success: false, error: `${fieldName} must be a string` }
  }

  const sanitized = sanitizeText(value)

  if (sanitized.length < minLength) {
    return {
      success: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    }
  }

  if (sanitized.length > maxLength) {
    return {
      success: false,
      error: `${fieldName} must be at most ${maxLength} characters`,
    }
  }

  return { success: true, data: sanitized }
}

/**
 * Validate that a value is a valid integer within a range.
 */
export function validateInteger(
  value: unknown,
  fieldName: string,
  options: { min?: number; max?: number; required?: boolean } = {}
): ValidationResult<number> {
  const { min = -Infinity, max = Infinity, required = true } = options

  if (value === undefined || value === null) {
    if (required) {
      return { success: false, error: `${fieldName} is required` }
    }
    return { success: true, data: 0 }
  }

  const num = typeof value === "string" ? parseInt(value, 10) : value

  if (typeof num !== "number" || isNaN(num) || !Number.isFinite(num)) {
    return { success: false, error: `${fieldName} must be a valid number` }
  }

  if (!Number.isInteger(num)) {
    return { success: false, error: `${fieldName} must be an integer` }
  }

  if (num < min || num > max) {
    return {
      success: false,
      error: `${fieldName} must be between ${min} and ${max}`,
    }
  }

  return { success: true, data: num }
}

/**
 * Validate that a value is a valid positive number (for amounts, etc.).
 */
export function validatePositiveNumber(
  value: unknown,
  fieldName: string,
  options: { max?: number; required?: boolean } = {}
): ValidationResult<number> {
  const { max = 1_000_000, required = true } = options

  if (value === undefined || value === null) {
    if (required) {
      return { success: false, error: `${fieldName} is required` }
    }
    return { success: true, data: 0 }
  }

  const num = typeof value === "string" ? parseFloat(value) : value

  if (typeof num !== "number" || isNaN(num) || !Number.isFinite(num)) {
    return { success: false, error: `${fieldName} must be a valid number` }
  }

  if (num <= 0) {
    return { success: false, error: `${fieldName} must be positive` }
  }

  if (num > max) {
    return { success: false, error: `${fieldName} exceeds maximum allowed value` }
  }

  return { success: true, data: num }
}

/**
 * Validate a UUID field.
 */
export function validateUUID(
  value: unknown,
  fieldName: string,
  options: { required?: boolean } = {}
): ValidationResult<string> {
  const { required = true } = options

  if (value === undefined || value === null || value === "") {
    if (required) {
      return { success: false, error: `${fieldName} is required` }
    }
    return { success: true, data: "" }
  }

  if (typeof value !== "string") {
    return { success: false, error: `${fieldName} must be a string` }
  }

  if (!isValidUUID(value)) {
    return { success: false, error: `${fieldName} must be a valid UUID` }
  }

  return { success: true, data: value }
}

/**
 * Validate that a value is a boolean.
 */
export function validateBoolean(
  value: unknown,
  fieldName: string,
  options: { required?: boolean } = {}
): ValidationResult<boolean> {
  const { required = true } = options

  if (value === undefined || value === null) {
    if (required) {
      return { success: false, error: `${fieldName} is required` }
    }
    return { success: true, data: false }
  }

  if (typeof value !== "boolean") {
    return { success: false, error: `${fieldName} must be a boolean` }
  }

  return { success: true, data: value }
}

/**
 * Validate that a value is one of the allowed enum values.
 */
export function validateEnum<T extends string>(
  value: unknown,
  fieldName: string,
  allowedValues: readonly T[],
  options: { required?: boolean } = {}
): ValidationResult<T> {
  const { required = true } = options

  if (value === undefined || value === null || value === "") {
    if (required) {
      return { success: false, error: `${fieldName} is required` }
    }
    return { success: true, data: allowedValues[0] }
  }

  if (typeof value !== "string") {
    return { success: false, error: `${fieldName} must be a string` }
  }

  if (!allowedValues.includes(value as T)) {
    return {
      success: false,
      error: `${fieldName} must be one of: ${allowedValues.join(", ")}`,
    }
  }

  return { success: true, data: value as T }
}

// --- Schema-based validation ---

type FieldValidator = (value: unknown) => ValidationResult<any>

/**
 * Validate an object against a schema of field validators.
 * OWASP: Rejects unexpected fields to prevent mass-assignment attacks.
 * 
 * @param body The raw request body object
 * @param schema A map of field names to validator functions
 * @param options.allowExtraFields If false (default), rejects any fields not in the schema
 * @returns Validated data object or error response
 */
export function validateBody<T extends Record<string, any>>(
  body: unknown,
  schema: Record<string, FieldValidator>,
  options: { allowExtraFields?: boolean } = {}
): ValidationResult<T> {
  const { allowExtraFields = false } = options

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { success: false, error: "Request body must be a JSON object" }
  }

  const rawBody = body as Record<string, unknown>

  // OWASP: Reject unexpected fields to prevent mass-assignment
  if (!allowExtraFields) {
    const allowedKeys = new Set(Object.keys(schema))
    const unexpectedKeys = Object.keys(rawBody).filter(
      (key) => !allowedKeys.has(key)
    )
    if (unexpectedKeys.length > 0) {
      return {
        success: false,
        error: `Unexpected fields: ${unexpectedKeys.join(", ")}`,
      }
    }
  }

  const validated: Record<string, any> = {}

  for (const [field, validator] of Object.entries(schema)) {
    const result = validator(rawBody[field])
    if (!result.success) {
      return result
    }
    validated[field] = result.data
  }

  return { success: true, data: validated as T }
}

/**
 * Safely parse a JSON request body.
 * Returns a 400 error response if the body is invalid JSON.
 */
export async function safeParseJSON(
  request: Request
): Promise<ValidationResult<Record<string, unknown>>> {
  try {
    const body = await request.json()
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return { success: false, error: "Request body must be a JSON object" }
    }
    return { success: true, data: body as Record<string, unknown> }
  } catch {
    return { success: false, error: "Invalid JSON in request body" }
  }
}

/**
 * Return a standardized 400 validation error response.
 */
export function validationErrorResponse(error: string): NextResponse {
  return NextResponse.json({ error }, { status: 400 })
}

// --- Razorpay-specific validators ---

/** Validate Razorpay order ID format (order_XXXXX) */
export function isValidRazorpayOrderId(value: unknown): value is string {
  return typeof value === "string" && /^order_[A-Za-z0-9]{14,20}$/.test(value)
}

/** Validate Razorpay payment ID format (pay_XXXXX) */
export function isValidRazorpayPaymentId(value: unknown): value is string {
  return typeof value === "string" && /^pay_[A-Za-z0-9]{14,20}$/.test(value)
}

/** Validate Razorpay signature (64-char hex) */
export function isValidRazorpaySignature(value: unknown): value is string {
  return typeof value === "string" && /^[a-f0-9]{64}$/.test(value)
}
