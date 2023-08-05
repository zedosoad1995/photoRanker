import { CustomError } from "./CustomError";

export class UnauthorizedError extends CustomError {
  statusCode = 401;

  constructor(public message: string = "Unauthorized", public error?: string) {
    super(message);

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors() {
    if (this.error) {
      return { message: this.message, error: this.error };
    } else {
      return { message: this.message };
    }
  }
}
