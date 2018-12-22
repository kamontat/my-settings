import fs from "fs";

import { Logger } from "../../../../../model/logger";
import { PrintStartCommand, PreAskQuestion } from "../../../utils";
import { Exec, ExecPipe } from "../../../../commandline";
import { BrewTap } from "../utils";
import { Ask } from "../install/utils";

export const SetupHomebrew = (log: Logger, _opts?: {}) => {
  PrintStartCommand(log, "Mac", "Homebrew", "Setup");

  const brewExist = fs.existsSync("/usr/local/bin/brew");
  if (brewExist) return new Promise(res => res());

  return Ask(log, [
    PreAskQuestion(log, {
      name: "Homebrew",
      default: true,
      yesFn: () => {
        // curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install
        return Exec(
          log,
          "curl",
          "-fsSL",
          "https://raw.githubusercontent.com/Homebrew/install/master/install"
        )
          .then(({ stdout }) => {
            // ruby -e ${result}
            return ExecPipe(log, "ruby", "-e", stdout);
          })
          .then(() => {
            // brew tap homebrew/cask-versions
            return BrewTap(log, "homebrew/cask-versions");
          })
          .then(() => {
            // brew tap homebrew/cask-fonts
            return BrewTap(log, "homebrew/cask-fonts");
          });
      }
    })
  ]);
};
