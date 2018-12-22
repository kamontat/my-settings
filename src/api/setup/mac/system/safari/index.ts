import { Question } from "../../../../ask";
import { PrintStartCommand } from "../../../utils";
import { Logger } from "../../../../../model/logger";
import { Ask } from "../../homebrew/install/utils";
import { PromptType } from "prompts";
import { Exec, Write } from "../../../../commandline";

const name = "Safari";
const subname = undefined;
const domain = "com.apple.Safari";

export const Safari = (log: Logger, _: {}) => {
  const _q = [
    {
      help: "For developer who use safari and want debug menu",
      type: "toggle" as PromptType,
      name: "debug_menu",
      message: "Show Developer menu",
      initial: true,
      active: "Yes",
      inactive: "No",
      action: async (result: boolean) => {
        // defaults write com.apple.Safari IncludeDevelopMenu -bool true
        // defaults write com.apple.Safari IncludeInternalDebugMenu -bool true
        return await Write(
          log,
          domain,
          "IncludeDevelopMenu",
          "-bool",
          result
        ).then(() => {
          return Write(
            log,
            domain,
            "IncludeInternalDebugMenu",
            "-bool",
            result
          );
        });
      }
    }
  ] as Question[];

  PrintStartCommand(log, "Mac", name, subname, _q.length);
  return Ask(log, _q);
};
