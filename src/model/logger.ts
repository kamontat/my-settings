import { console, dailyfile, colorConsole, Tracer } from "tracer";
import {
  normalConsoleSetting,
  fileSetting,
  colorConsoleSetting
} from "../config/logger";
import { Arguments } from "yargs";
import chalk from "chalk";

export type LoggerType = "normal" | "color" | "file";
export type LoggingType = "log" | "debug" | "info" | "warn" | "error";

export interface Logging {
  log(...args: any[]): void;
  // trace(...args: any[]): void;
  debug(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  // fatal(...args: any[]): void;
}

export class NullLogger implements Logging {
  log(..._: any[]): void {}
  // trace(..._: any[]): void {}
  debug(..._: any[]): void {}
  info(..._: any[]): void {}
  warn(..._: any[]): void {}
  error(..._: any[]): void {}
  // fatal(..._: any[]): void {}
}

export type LoggerLevelType = "info" | "log" | "debug";

export class Logger implements Logging {
  private logs: { [key in LoggerType]?: Tracer.Logger };

  private _level: LoggerLevelType;

  constructor(option?: {
    console?: { normal?: Tracer.LoggerConfig; color?: Tracer.LoggerConfig };
    file?: Tracer.DailyFileConfig;
  }) {
    this.logs = {};
    this._set(option);
    this._level = "info";
  }

  private _set(option?: {
    console?: { normal?: Tracer.LoggerConfig; color?: Tracer.LoggerConfig };
    file?: Tracer.DailyFileConfig;
  }) {
    const normal =
      (option && option.console && option.console.normal) ||
      normalConsoleSetting;
    const color =
      (option && option.console && option.console.color) || colorConsoleSetting;
    const file = (option && option.file) || fileSetting;

    if (normal) this.logs.normal = console(normal);
    if (color) this.logs.color = colorConsole(color);
    if (file) this.logs.file = dailyfile(file);

    return this;
  }

  setup(argv: Arguments) {
    this._level = argv.verbose ? "log" : "info";
    chalk.enabled = argv.color;

    colorConsoleSetting.level = this.level();

    this.logs.color = colorConsole(colorConsoleSetting);
  }

  level() {
    return this._level;
  }

  only(type: LoggerType) {
    return this.logs[type] || new NullLogger();
  }

  _all(type: LoggingType, ...args: any[]) {
    this.only("normal")[type](...args);
    this.only("color")[type](...args);
    this.only("file")[type](...args);
  }

  log(...args: any[]) {
    this._all("log", ...args);
  }

  debug(...args: any[]) {
    this._all("debug", ...args);
  }

  info(...args: any[]) {
    this._all("info", ...args);
  }

  warn(...args: any[]) {
    this._all("warn", ...args);
  }

  error(...args: any[]) {
    this._all("error", ...args);
  }

  public static CONST = new Logger();
}

export const log = Logger.CONST;
