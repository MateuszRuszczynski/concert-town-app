export function normalizeNumericInput (value: string): string {
  const digitsOnly = value.replace(/\D/g, '');
  const withoutLeadingZeros = digitsOnly.replace(/^0+(?=\d)/, '');
  return withoutLeadingZeros === '' ? '0' : withoutLeadingZeros;
}
