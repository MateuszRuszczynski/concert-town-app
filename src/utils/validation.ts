import {
  HTML_TAG_REGEX,
  LEADING_TRAILING_SPACE_REGEX,
  MULTIPLE_SPACES_REGEX
} from './sanitization';

//#region consts
const NAME_REGEX = /^[\p{L}\s'-]+$/u;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_NAME_LENGTH = 50;
const MAX_EMAIL_LENGTH = 100;
const MAX_PASSWORD_LENGTH = 50;
//#endregion

export function validateName (value: string): string | undefined {
  const trimmedName = value.trim();

  if (trimmedName.length === 0) return 'This field is required';
  if (trimmedName.length > MAX_NAME_LENGTH)
    return `Must be under ${MAX_NAME_LENGTH} characters`;
  if (MULTIPLE_SPACES_REGEX.test(trimmedName)) return 'Remove extra spaces';
  if (!NAME_REGEX.test(trimmedName)) return 'Contains invalid characters';

  return undefined;
}

export function validateEmail (value: string): string | undefined {
  const trimmedEmail = value.trim();

  if (trimmedEmail.length === 0) return 'Email is required';
  if (trimmedEmail.length > MAX_EMAIL_LENGTH)
    return `Must be under ${MAX_EMAIL_LENGTH} characters`;
  if (HTML_TAG_REGEX.test(trimmedEmail))
    return 'Email contains invalid characters';
  if (!EMAIL_REGEX.test(trimmedEmail)) return 'Enter a valid email address';

  return undefined;
}

export function validatePasswordCharacters (value: string): string | undefined {
  if (HTML_TAG_REGEX.test(value))
    return 'Password cannot contain < or > characters';
  if (LEADING_TRAILING_SPACE_REGEX.test(value))
    return 'Password cannot start or end with a space';
  if (value.length > MAX_PASSWORD_LENGTH)
    return `Must be under ${MAX_PASSWORD_LENGTH} characters`;
  return undefined;
}

export function validatePassword (
  value: string,
  isPasswordValid: boolean
): string | undefined {
  if (value.length === 0) return 'Password is required';

  const characterError = validatePasswordCharacters(value);
  if (characterError) return characterError;
  if (!isPasswordValid) return 'Password does not meet all requirements';

  return undefined;
}

export function validatePasswordMatch (
  password: string,
  confirmPassword: string
): string | undefined {
  if (confirmPassword.length === 0) return 'Please repeat your password';
  if (confirmPassword !== password) return "Passwords don't match";
  return undefined;
}
