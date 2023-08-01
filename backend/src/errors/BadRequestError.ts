import { CustomError } from "./CustomError";

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string = "Bad Request", public code?: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    if (this.code) {
      return { message: this.message, code: this.code };
    } else {
      return { message: this.message };
    }
  }
}
