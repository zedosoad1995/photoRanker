import { ZodError } from "zod";
import { CustomError } from "./CustomError";

export class ValidationError extends CustomError {
  statusCode = 422;

  constructor(public error: ZodError | { path: string; message: string }) {
    super("Validation Error");

    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  serializeErrors() {
    if (this.error instanceof ZodError) {
      const field = this.error.errors[0].path.join(".");

      return { message: this.error.errors[0].message, field };
    } else {
      return { message: this.error.message, field: this.error.path };
    }
  }
}
