import { Logger } from "../../../../../model/logger";
import { Ask } from "../../homebrew/install/utils";
import { PromptType } from "prompts";
import { WriteGlobal } from "../../../../commandline";
import { PrintStartCommand, Instruction } from "../../../utils";
import { Question } from "../../../../ask";

export const MacKeyboard = (log: Logger, _opts: {}) => {
  const _q = [
    {
      help:
        "You have to choose between 2 behavior, when user press and hold the keys (more information https://www.howtogeek.com/267463/how-to-enable-key-repeating-in-macos)",
      type: "toggle" as PromptType,
      name: "repeat_keys",
      message: "Press and Hold behavior keys",
      initial: true,
      active: "Repeat",
      inactive: "Special",
      action: async (result: boolean) => {
        return await WriteGlobal(
          log,
          "ApplePressAndHoldEnabled",
          "-bool",
          result === true ? "false" : "true"
        );
      }
    }
  ] as Question[];

  PrintStartCommand(log, "Mac", "Behavior", "Keyboard", _q.length);
  return Ask(log, _q);
};
