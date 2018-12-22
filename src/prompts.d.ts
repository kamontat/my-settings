// Type definitions for prompts 1.2
// Project: https://github.com/terkelg/prompts
// Definitions by: Berkay GURSOY <https://github.com/Berkays>
//                 Daniel Perez Alvarez <https://github.com/danielpa9708>
//                 Kamontat Chantrachirathumrong <https://github.com/kamontat>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.8

declare module "prompts" {
  // import Kleur from "kleur";

  export = prompts;

  function prompts<T extends string = string>(
    questions: prompts.PromptObject<T> | Array<prompts.PromptObject<T>>,
    options?: prompts.Options
  ): Promise<prompts.Answers<T>>;

  namespace prompts {
    // Circular reference from prompts
    const prompt: any;

    function inject(obj: any): void;

    namespace inject {
      const prototype: {};
    }

    namespace prompts {
      function autocomplete(args: PromptObject): any;

      function confirm(args: PromptObject): void;

      function invisible(args: PromptObject): any;

      function list(args: PromptObject): any;

      function multiselect(args: PromptObject): any;

      function number(args: PromptObject): void;

      function password(args: PromptObject): any;

      function select(args: PromptObject): void;

      function text(args: PromptObject): void;

      function toggle(args: PromptObject): void;
    }

    interface Choice {
      title: string;
      value: any;
      disable?: boolean;
      selected?: boolean;
    }

    interface Options {
      onSubmit?: (prompt: PromptObject, answer: any, answers: any[]) => void;
      onCancel?: (prompt: PromptObject, answers: any) => void;
    }

    interface PromptObject<T extends string = string> {
      type: ValueOrFunc<PromptType, PromptType | Falsy> | Falsy;
      name: ValueOrFunc<T>;
      message?: ValueOrFunc<T, string>;
      initial?: ValueOrFunc<T, string | number | boolean>;
      style?: string;
      format?: PrevCaller<T, void>;
      validate?: PrevCaller<T, void>;
      onState?: PrevCaller<T, void>;
      onRender?: (this: PromptObject, kleur: any) => void;
      min?: number;
      max?: number;
      float?: boolean;
      round?: number;
      increment?: number;
      seperator?: string;
      active?: string;
      inactive?: string;
      choices?: Choice[];
      hint?: string;
      suggest?: ((prev: any, values: any, prompt: PromptObject) => void);
      limit?: number;
    }

    type Answers<T extends string> = { [id in T]: any };

    type PrevCaller<T extends string, R = T> = (
      prev: any,
      values: Answers<T>,
      prompt: PromptObject
    ) => R;

    type Caller<T> = (value: T) => string;

    type Falsy = false | null | undefined;

    type PromptType =
      | "text"
      | "password"
      | "invisible"
      | "number"
      | "confirm"
      | "list"
      | "toggle"
      | "select"
      | "multiselect"
      | "autocomplete";

    type ValueOrFunc<T extends string, R = T> = R | PrevCaller<T, R>;

    type ValueOrCaller<T> = T | Caller<T>;
  }
}
