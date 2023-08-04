import { CustomError } from "./CustomError";

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string = "Bad Request", public error?: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    if (this.error) {
      return { message: this.message, error: this.error };
    } else {
      return { message: this.message };
    }
  }
}
