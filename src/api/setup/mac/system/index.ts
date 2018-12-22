import chalk from "chalk";

import { Logger } from "../../../../model/logger";

import { Dock } from "./dock";
import { Dashboard } from "./dashboard";
import { Finder } from "./finder";
import { MacBehavior } from "./behavior";
import { Safari } from "./safari";

export const MacSystem = (log: Logger, _internet: boolean, _opts: {}) => {
  log.info(chalk.blueBright.bold("Start setup Mac system..."));

  return MacBehavior(log, _opts)
    .then(() => {
      return Dock(log, _opts);
    })
    .then(() => {
      return Dashboard(log, _opts);
    })
    .then(() => {
      return Finder(log, _opts);
    })
    .then(() => {
      return Safari(log, _opts);
    });
};
