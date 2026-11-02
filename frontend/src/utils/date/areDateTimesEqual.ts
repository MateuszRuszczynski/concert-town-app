export function areDateTimesEqual(
  dateA: string,
  dateB: string
): boolean {
  return new Date(dateA).getTime() === new Date(dateB).getTime();
}
