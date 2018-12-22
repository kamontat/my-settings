import { Logger } from "../../../../../model/logger";
import { PrintStartCommand, Instruction } from "../../../utils";
import { MacKeyboard } from "./keyboard";
import { MacMouse } from "./mouse";
import { MacTrackpad } from "./trackpad";

export const MacBehavior = (log: Logger, _opts: {}) => {
  PrintStartCommand(log, "Mac", "General");

  return MacKeyboard(log, _opts)
    .then(() => {
      return MacTrackpad(log, _opts);
    })
    .then(() => {
      return MacMouse(log, _opts);
    })
    .then(() => {
      Instruction(
        log,
        "This setting, you might need to restart the computer to apply the results."
      );
    });
};
