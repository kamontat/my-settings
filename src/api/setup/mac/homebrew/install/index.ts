import { Logger } from "../../../../../model/logger";
import { PrintStartCommand } from "../../../utils";
import { InstallBrewMain } from "./main";
import { InstallBrewMainDev } from "./main/dev";
import { InstallBrewFont } from "./font";

export const HomebrewInstallation = (log: Logger, opts: {}) => {
  PrintStartCommand(log, "Mac", "Homebrew");

  return InstallBrewMain(log, opts)
    .then(() => {
      return InstallBrewMainDev(log, opts);
    })
    .then(() => {
      return InstallBrewFont(log, opts);
    });
};
