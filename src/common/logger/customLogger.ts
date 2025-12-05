import { LoggerService, Injectable, LogLevel } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CustomLogger implements LoggerService {
  private logLevels: LogLevel[] = ['log', 'warn', 'error', 'debug', 'verbose'];

  log(message: string) {
    this.writeToFile('log', message);
  }

  warn(message: string) {
    this.writeToFile('warn', message);
  }

  error(message: string, trace: string) {
    this.writeToFile('error', `${message}\nTrace: ${trace}`);
  }

  debug(message: string) {
    this.writeToFile('debug', message);
  }

  verbose(message: string) {
    this.writeToFile('verbose', message);
  }

  private writeToFile(level: LogLevel, message: string) {
    const logMessage = `${new Date().toISOString()} [${level.toUpperCase()}]: ${message}\n`;
    const logFilePath = path.join(__dirname, '..', 'logs', `${level}.log`);

    if (!fs.existsSync(path.dirname(logFilePath))) {
      fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
    }
    fs.appendFileSync(logFilePath, logMessage);
  }
}
