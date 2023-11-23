import { LoggerRepo } from "@/types/repositories/logger";

export class ConsoleLogger implements LoggerRepo {
  info(message: string) {
    console.log(message);
  }
}
