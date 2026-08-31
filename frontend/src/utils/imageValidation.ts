const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function validateEventImage(file: File | null): string | undefined {
  if (!file) return undefined;

  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'Please upload a JPEG, PNG, or WebP image';
  }

  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `Image must be under ${MAX_FILE_SIZE_MB}MB`;
  }

  return undefined;
}


