import chalk from "chalk";

import { Delete, Write, Reset, DefaultHelper } from "../commandline";
import { Logger } from "../../model/logger";
import { Question } from "../ask";
import { PromptType } from "prompts";

export type YND = true | false | undefined;

export const yes_no_default = [
  { title: "Default", value: undefined },
  { title: "Yes", value: true },
  { title: "No", value: false }
];

export type SetOption<T> = {
  domain: string;
  name: string;
  value: T;
  default?: (v: T) => boolean;
};

export const SetOrDefault = async <T = number | string | boolean | undefined>(
  log: Logger,
  opts: SetOption<T>
) => {
  if (opts.value === undefined || (opts.default && opts.default(opts.value))) {
    return await DefaultHelper(log, opts.domain, opts.name, {
      action: "delete"
    });
  } else {
    return await DefaultHelper(log, opts.domain, opts.name, {
      result: opts.value
    });
  }
};

export const PrintStartCommand = (
  log: Logger,
  os: "Mac" | "Unknown",
  command: string,
  subcommand?: string,
  numberOfQuestion?: number
) => {
  const line = "---------------------------------------";
  console.log();
  console.log(line);
  log.info(
    chalk.blueBright(
      `Starting ${os} ${command}${subcommand ? ` (${subcommand})` : ""}... ${
        numberOfQuestion ? `(${numberOfQuestion} questions)` : ""
      }`
    ),
    chalk.redBright("[cancel by ctrl+c]")
  );
};

export const Instruction = (log: Logger, msg: string) => {
  log.info(
    chalk`{bgWhiteBright {red.bold.dim Instruction}: {green.dim ${msg}}}`
  );
};

export interface PreAskQuestionType {
  name: string;
  default?: boolean;
  yesFn: () => Promise<any>;
}

export const PreAskQuestion = (
  log: Logger,
  question: PreAskQuestionType
): Question => {
  log.debug(`Check is user want to install ${question.name} or not`);

  return {
    help: "",
    type: "toggle" as PromptType,
    active: "Yes",
    inactive: "No",
    initial: question.default === false ? false : true,
    name: `start_${question.name.toLowerCase().replace(" ", "_")}`,
    message: `Do you want to start ${question.name}?`,
    action: async (result: boolean) => {
      if (result === true) {
        await question.yesFn();
        return false;
      }
      return true;
    }
  };
};

export const Require = (internet: boolean, command: Promise<any>) => {
  if (internet) return command;
  else return new Promise(res => res());
};

export const CapitalString = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export { Reset };
