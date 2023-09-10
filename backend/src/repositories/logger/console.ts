import { LoggerRepo } from "@/types/logger";

export class ConsoleLogger implements LoggerRepo {
  info(message: string) {
    console.log(message);
  }
}
