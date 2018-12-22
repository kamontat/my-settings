import { PromptType } from "prompts";

import { Logger } from "../../../../../model/logger";

import { Ask } from "../../../../ask";
import {
  yes_no_default,
  YND,
  PrintStartCommand,
  SetOrDefault,
  Reset
} from "../../../utils";

export const Dashboard = (log: Logger, _: {}) => {
  PrintStartCommand(log, "Mac", "Dashboard");

  return Ask(log, [
    {
      help: "Completely disable Dashboard.",
      type: "select" as PromptType,
      name: "disable_dashboard",
      message: "Disable dashboard",
      choices: yes_no_default,
      action: async (result: YND) => {
        return await SetOrDefault(log, {
          domain: "com.apple.dashboard",
          name: "mcx-disabled",
          value: result,
          default: v => v === undefined
        });
      }
    }
  ]).then(() => {
    Reset(log, "Dock");
  });
};
