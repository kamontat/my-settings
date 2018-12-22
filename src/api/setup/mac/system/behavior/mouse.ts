import { Logger } from "../../../../../model/logger";
import { Ask } from "../../homebrew/install/utils";
import { PromptType } from "prompts";
import { WriteGlobal } from "../../../../commandline";
import { PrintStartCommand, Instruction } from "../../../utils";
import { Question } from "../../../../ask";
import chalk from "chalk";

export const MacMouse = (log: Logger, _opts: {}) => {
  const _q = [] as Question[];

  PrintStartCommand(log, "Mac", "Behavior", "Mouse", _q.length);
  return Ask(log, _q);
};
