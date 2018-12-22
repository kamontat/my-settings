import { Logger } from "../../../../model/logger";
import { SetupHomebrew } from "./setup";
import { Require } from "../../utils";
import { HomebrewInstallation } from "./install";

export const MacHomeBrew = (log: Logger, internet: boolean, opts: {}) => {
  return Require(internet, SetupHomebrew(log, opts)).then(() => {
    return Require(internet, HomebrewInstallation(log, opts));
  });
};
