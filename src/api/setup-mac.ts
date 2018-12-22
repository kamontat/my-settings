import { Logger } from "../model/logger";
import { MacSystem } from "./setup/mac/system";
import { MacHomeBrew } from "./setup/mac/homebrew";

export const SetupNewMac = (log: Logger, settings: { internet: boolean }) => {
  return MacSystem(log, settings.internet, {}).then(() => {
    MacHomeBrew(log, settings.internet, {});
  });
};
