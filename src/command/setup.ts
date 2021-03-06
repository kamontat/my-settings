import { Logger } from "../model/logger";
import { CommandSetting } from "./_type";
import { Arguments } from "yargs";
import { SetupNewMac } from "../api/setup-mac";
import { Asker } from "../api/ask";

export default {
  name: ["setup", "$0"],
  subcommand: {
    require: {
      kind: {
        desc: "What kind of setup do you want?",
        choices: ["mac"]
      }
    }
  },
  description: "Show hello to person name",
  option: {
    internet: {
      alias: "I",
      desc: "Setup with internet access",
      type: "boolean",
      default: true
    },
    exit: {
      alias: "E",
      desc:
        "Instead of exit only current group of question, exit the whole command",
      type: "boolean",
      default: false
    },
    "confirm-exit": {
      alias: "e",
      desc: "Add comfirmation how 'ctrl+c' should be",
      type: "boolean",
      default: true
    },
    default: {
      alias: "D",
      desc:
        "The command will never prompt anything, and call with all default value (Experiment)",
      type: "boolean",
      default: false
    }
  },
  action: (log: Logger, argv: Arguments) => {
    log.setup(argv);

    const internet: boolean = argv.internet;
    const exit: boolean = (argv.exit === undefined && false) || argv.exit;
    const ask: boolean = (argv.e === undefined && true) || argv.e;
    const makePrompt: boolean =
      (argv.default === undefined && false) || argv.default;

    log.debug(
      `Start command with ${makePrompt ? "never prompts" : "initial prompts"}`
    );

    Asker.CONST.setAsk(ask);
    Asker.CONST.setExit(exit);
    Asker.CONST.NeverPrompts(makePrompt);

    switch (argv.kind) {
      case "mac":
        log.debug(`Setup new mac ${internet ? "with" : "without"} internet`);
        SetupNewMac(log, { internet: internet });
        break;
      default:
        log.debug(`Setup with unknown setting`);
    }
  },
  help: {
    example: {
      command: "$0 setup mac",
      desc: "Run setup command for mac with internet"
    }
  }
} as CommandSetting;
