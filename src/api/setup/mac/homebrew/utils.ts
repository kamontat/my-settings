import { ExecPipe, Exec } from "../../../commandline";
import { Logger } from "../../../../model/logger";

export const BrewInstall = async (log: Logger, ...args: string[]) => {
  return ExecPipe(log, "brew", "install", ...args);
};

export const CaskInstall = async (log: Logger, ...args: string[]) => {
  return ExecPipe(log, "brew", "cask", "install", ...args);
};

export const BrewTap = async (log: Logger, tap: string) => {
  return ExecPipe(log, "brew", "tap", tap);
};

export const BrewIsTapped = async (log: Logger, tap: string) => {
  const { stdout } = await Exec(log, "brew", "tap-info", tap);
  return !stdout.includes("Not installed");
};
