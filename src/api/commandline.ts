import execa = require("execa");
import { Logger, LoggerLevelType } from "../model/logger";
import { Writable } from "stream";
import { cursorTo, clearLine, moveCursor } from "readline";

export interface DefaultHelperSetting {
  result?: any;
  action?: "read" | "write" | "delete";
  global?: boolean;
}

export const DefaultHelper = async (
  log: Logger,
  domain: string,
  name?: string,
  setting?: DefaultHelperSetting
) => {
  const g = setting && setting.global ? setting.global : false;
  const action = setting && setting.action ? setting.action : "write";
  const result = setting && setting.result;

  let key = "";
  if (typeof result == "number") {
    if (result % 1 === 0) key = "-int";
    else key = "-float";
  } else if (typeof result == "boolean") key = "-bool";
  else if (typeof result == "string") key = "-string";

  const args = [domain];
  if (name) args.push(name);
  if (key && result !== undefined && key !== "") args.push(key, result);

  switch (action) {
    case "read":
      if (g) return await ReadGlobal(log, ...args);
      else return await Read(log, ...args);

    case "delete":
      return await Delete(log, ...args);

    case "write":
    default:
      if (g) return await WriteGlobal(log, ...args);
      else return await Write(log, ...args);
  }
};

export const ReadGlobal = async (log: Logger, ...args: any) => {
  return await Read(log, "-g", ...args);
};

export const Read = async (log: Logger, ...args: any) => {
  return await Exec(log, "defaults", "read", ...args);
};

export const WriteGlobal = async (log: Logger, ...args: any) => {
  return await Write(log, "-g", ...args);
};

export const Write = async (log: Logger, ...args: any) => {
  return await Exec(log, "defaults", "write", ...args);
};

export const Delete = async (log: Logger, ...args: any) => {
  try {
    return await Exec(log, "defaults", "delete", ...args);
  } catch (e) {
    return e as execa.ExecaReturns;
  }
};

export const Reset = async (log: Logger, args: string) => {
  return await Exec(log, "killall", args);
};

export const Exec = async (log: Logger, command: string, ...args: any[]) => {
  try {
    log.debug(`Execute: ${command} ${args.join(" ")}`);
    return await execa(command, args);
  } catch (e) {
    if (e.code) {
      log.error(`${e.code}: ${e.stderr}`);
    } else {
      log.error(e);
    }
    return e as execa.ExecaReturns;
  }
};

export const write1Line = (w: Writable, str: string) => {
  const array = str.split("\n").filter(v => v !== "" && v !== "\t");

  cursorTo(w, 0);
  moveCursor(w, 0, -1);
  clearLine(w, 0);
  w.write(`${array[array.length - 1]}\n`);
};

class CustomStream<T extends Writable> extends Writable {
  private std: T;
  private level: LoggerLevelType;

  constructor(writer: T, level: LoggerLevelType) {
    super();
    this.level = level;
    this.std = writer;
  }

  _write(chunk: any, _: any, next: any) {
    if (this.level === "info") write1Line(this.std, chunk.toString());
    else this.std.write(chunk.toString());

    next();
  }
}

export const ExecPipe = async (
  log: Logger,
  command: string,
  ...args: any[]
) => {
  try {
    log.debug(`Execute (pipe to stdout): ${command} ${args.join(" ")}`);
    const child = execa(command, args);
    child.stdout.pipe(new CustomStream(process.stdout, log.level()));
    child.stderr.pipe(new CustomStream(process.stderr, log.level()));

    return await child;
  } catch (e) {
    if (e.code) {
      log.error(`${e.code}: ${e.stderr}`);
    } else {
      log.error(e);
    }
    return;
  }
};
