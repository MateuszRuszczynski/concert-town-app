export function getTotalPages(count: number, pageSize: number): number {
  return Math.ceil(count / pageSize);
}
