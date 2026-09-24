export class ApiError extends Error {
  statusCode: number;
  issues?: unknown[];

  constructor(message: string, statusCode: number, issues?: unknown[]) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.issues = issues;
  }
}
