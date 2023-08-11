import { CustomError } from "./CustomError";

export class ForbiddenError extends CustomError {
  statusCode = 403;

  constructor(public message: string = "Forbidden", public error?: string) {
    super(message);

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeErrors() {
    if (this.error) {
      return { message: this.message, error: this.error };
    } else {
      return { message: this.message };
    }
  }
}
