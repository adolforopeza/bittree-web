// src/core/logger/index.ts
import fs from 'fs';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export class Logger {
  private filePath: string | null;

  constructor(filePath?: string) {
    this.filePath = filePath || process.env.LOG_FILE_PATH || '/tmp/app.log';
  }

  private write(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const line = JSON.stringify({ ts: timestamp, level, message, meta }) + '\n';
    try {
      if (level === 'error') console.error(message, meta || '');
      else if (level === 'warn') console.warn(message, meta || '');
      else console.log(message, meta || '');
    } catch {
      // ignore console errors
    }

    try {
      if (this.filePath) fs.appendFileSync(this.filePath, line);
    } catch (e) {
      // serverless may restrict fs; swallow errors
    }
  }

  error(msg: string, meta?: any) {
    this.write('error', msg, meta);
  }
  warn(msg: string, meta?: any) {
    this.write('warn', msg, meta);
  }
  info(msg: string, meta?: any) {
    this.write('info', msg, meta);
  }
  debug(msg: string, meta?: any) {
    if (process.env.NODE_ENV !== 'production') this.write('debug', msg, meta);
  }
}

const logger = new Logger();
export default logger;
