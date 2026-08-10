import { HTML_TAG_REGEX } from "./sanitization";

const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 2000;
const MAX_HOST_LENGTH = 100;

export function validateEventTitle(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'Title is required';
  if (trimmed.length > MAX_TITLE_LENGTH) return `Must be under ${MAX_TITLE_LENGTH} characters`;
  if (HTML_TAG_REGEX.test(trimmed)) return 'Title contains invalid characters';
  return undefined;
}

export function validateEventDescription(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'Description is required';
  if (trimmed.length > MAX_DESCRIPTION_LENGTH) return `Must be under ${MAX_DESCRIPTION_LENGTH} characters`;
  if (HTML_TAG_REGEX.test(trimmed)) return 'Description contains invalid characters';
  return undefined;
}

export function validateEventHost(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'Host is required';
  if (trimmed.length > MAX_HOST_LENGTH) return `Must be under ${MAX_HOST_LENGTH} characters`;
  if (HTML_TAG_REGEX.test(trimmed)) return 'Host contains invalid characters';
  return undefined;
}

export function validateDateRange(startsAt: string, endsAt: string): string | undefined {
  if (!startsAt) return undefined; // окрема помилка для порожнього поля обробляється нижче
  if (!endsAt) return undefined;
  if (new Date(endsAt) <= new Date(startsAt)) return 'End time must be after start time';
  return undefined;
}

export function validateCapacity(value: number): string | undefined {
  if (!Number.isInteger(value) || value <= 0) return 'Capacity must be a positive number';
  if (value > 100000) return 'Capacity seems unrealistically high';
  return undefined;
}

export function validatePrice(value: number): string | undefined {
  if (value < 0) return 'Price cannot be negative';
  if (value > 100000) return 'Price seems unrealistically high';
  return undefined;
}
