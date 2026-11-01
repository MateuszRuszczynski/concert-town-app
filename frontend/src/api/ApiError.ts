export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, data: unknown) {
    super('API error');
    this.status = status;
    this.data = data;
  }
}
