const MIN_LENGTH = 8
const MAX_LENGTH = 72 // bcrypt truncates beyond this

export type PasswordValidation =
  | { ok: true }
  | { ok: false; error: string }

export function validatePassword(password: string): PasswordValidation {
  if (password.length < MIN_LENGTH) {
    return {
      ok: false,
      error: `Password must be at least ${MIN_LENGTH} characters`,
    }
  }

  if (password.length > MAX_LENGTH) {
    return {
      ok: false,
      error: `Password must be at most ${MAX_LENGTH} characters`,
    }
  }

  if (!/[a-z]/.test(password)) {
    return {
      ok: false,
      error: "Password must include at least one lowercase letter",
    }
  }

  if (!/[A-Z]/.test(password)) {
    return {
      ok: false,
      error: "Password must include at least one uppercase letter",
    }
  }

  if (!/[0-9]/.test(password)) {
    return {
      ok: false,
      error: "Password must include at least one number",
    }
  }

  return { ok: true }
}

export const PASSWORD_REQUIREMENTS =
  "At least 8 characters, with uppercase, lowercase, and a number"
