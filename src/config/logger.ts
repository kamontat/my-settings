import { Tracer } from "tracer";
import chalk from "chalk";

export const normalConsoleSetting = undefined;

export const colorConsoleSetting: Tracer.LoggerConfig = {
  format: `[{{title}}] {{message}}`,
  dateformat: "HH:MM:ss.L",
  filters: {
    log: s => chalk.gray(s),
    debug: s => chalk.cyan.dim(s),
    info: s => chalk.greenBright(s),
    warn: s => chalk.yellow.dim(s),
    error: s => chalk.red.bold(s)
  }
};

export const fileSetting: Tracer.DailyFileConfig = {
  root: "/tmp",
  maxLogFiles: 5
};
