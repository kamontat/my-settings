import { Ask, Question } from "../../../../ask";
import { Logger } from "../../../../../model/logger";
import { PromptType, Choice } from "prompts";
import { CapitalString } from "../../../utils";
import { BrewInstall, CaskInstall } from "../utils";

export interface InstallQuestion<T = string> {
  name: string;
  cask?: boolean;
  desc?: string;
  link?: string;
  default?: boolean | T;
  choices?: T[] | Choice[];
  muliselect?: boolean;
}

export const InstallQuestion = (log: Logger, _questions: InstallQuestion[]) => {
  return _questions.map(i => {
    let help = "";
    if (i.desc && i.link) help = `${i.desc} (${i.link})`;
    else if (i.desc) help = `${i.desc}`;
    else if (i.link) help = `${i.link}`;
    else help = `No help for ${i.name}`;
    log.debug(`Setup question with help=${help}`);

    const DEFAULT = "default";
    const NOT_INSTALL = "no";

    let choices: Choice[] | undefined = [
      {
        title: CapitalString(DEFAULT),
        value: DEFAULT
      },
      {
        title: CapitalString(NOT_INSTALL),
        value: NOT_INSTALL
      }
    ];

    let type: PromptType = "toggle";
    if (i.choices && i.choices.length > 0) {
      type = i.muliselect ? "multiselect" : "select";
      if (typeof i.choices[0] === "string") {
        choices.push(
          ...(i.choices as string[]).map((v: string) => {
            return {
              title: CapitalString(v),
              value: v
            };
          })
        );
      } else {
        choices = i.choices as Choice[];
      }
    }

    log.debug(`Setup question with type=${type}`);
    if (type === "select" || type === "multiselect")
      log.debug(`Setup question with choices=${JSON.stringify(choices)}`);

    let def: number | boolean;
    // case have choice
    if (choices) {
      if (typeof i.default === "string") {
        // default is one of the choices
        def = choices.findIndex(v => v.value === i.default);
        // default is NOT one of the choices (fallback)
        if (def < 0) def = 0;
      } else {
        // wrong input default (fallback)
        def = 0;
      }
    } else {
      def = typeof i.default === "boolean" ? i.default : true;
    }

    log.debug(`Setup question with default=${def}`);

    const name = i.name.toLowerCase().replace(/[ !@#$%^&*()-+]/g, "_");
    const depName = i.name.toLowerCase().replace(/ /g, "-");

    log.debug(`Setup question with name=${name}`);
    log.debug(`Setup question with dependency=${depName}`);

    return {
      help: help,
      type: type,
      name: name,
      message: `${i.choices ? "Select" : "Install"} "${i.name}" in homebrew`,
      initial: def,
      active: "Yes",
      inactive: "No",
      choices: choices,
      action: async (result: boolean | string | string[]) => {
        if (result) {
          let name: string[] = [depName];
          if (typeof result === "string") {
            // if not default name
            if (result.toString() !== DEFAULT)
              name = [`${depName}-${result.toString()}`]; // append name selected from user e.g. firefox-dev
          } else {
            if ((result as string[]).length < 1) return;
            name = result as string[];
          }
          log.debug(
            `Install ${name.join(",")} to brew${i.cask ? " cask" : ""}`
          );

          if (i.cask === true) return await CaskInstall(log, ...name);
          else return await BrewInstall(log, ...name);
        }
        return;
      }
    } as Question;
  });
};

export const AskInstall = (log: Logger, _questions: InstallQuestion[]) => {
  const questions = InstallQuestion(log, _questions);
  return Ask(log, questions);
};

export { Ask };
