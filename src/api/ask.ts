import prompts, { PromptObject } from "prompts";
import { Logger } from "../model/logger";

import Chalk from "chalk";
import chalk from "chalk";

type Action = (v: any, raw?: any) => void | Promise<any>;

type Json<T> = {
  [key: string]: T;
};

export interface Question extends PromptObject {
  help: string;
  action: Action;
}

export class Asker {
  private exit: boolean;
  private ask: boolean;

  private constructor() {
    this.exit = false;
    this.ask = true;
  }

  setExit(exit: boolean) {
    this.exit = exit;
    if (this.exit) this.ask = false;
  }

  setAsk(ask: boolean) {
    this.ask = ask;
  }

  Ask(log: Logger, _questions: Question[]) {
    log.log(`Initial ask with ${_questions.length} questions`);

    const actions: Json<Action> = {};
    const question = _questions.map((v, i) => {
      actions[v.name.toString()] = v.action;
      const help = v.help;
      let called = false;
      v.onRender = function() {
        if (help && help !== "")
          if (!called) {
            // new 2 space before start question
            console.log();
            console.log();

            console.log(
              Chalk`{dim ${(
                i + 1
              ).toString()})} {redBright.bold Help}: {grey ${help}}`
            );
          }
        called = true;
      };

      delete v.action;
      delete v.help;
      return v as PromptObject;
    });

    return prompts(question, {
      onCancel: async (prompt, _answer) => {
        const name = prompt.name.toString();
        log.log(
          `User cancel on ${name} prompt with input is ${JSON.stringify(
            _answer
          )}`
        );

        if (this.ask) {
          console.log();
          console.log();
          return await prompts({
            type: "toggle",
            name: "exit",
            message: `${chalk.inverse.underline.bold(
              "Do you want to exit every question set?"
            )}`,
            initial: this.exit,
            active: "Yes",
            inactive: "No"
          }).then(result => result.exit && process.exit(2));
        } else if (this.exit) return process.exit(3);
        return undefined;
      },
      onSubmit: async (prompts, _answer) => {
        console.log(); // for formating
        console.log(); // for formating

        const name = prompts.name.toString();
        const answer =
          typeof _answer === "object" && !Array.isArray(_answer)
            ? _answer[name]
            : _answer;
        log.log(`User submit "${answer}" to ${name}`);

        const result = await actions[name](answer, _answer);
        if (result === true || result === "true") {
          log.debug("Skip all set of questions");
          return true;
        } else return false;
      }
    });
  }

  public static CONST = new Asker();
}

export const Ask = (l: Logger, _q: Question[]) => Asker.CONST.Ask(l, _q);
