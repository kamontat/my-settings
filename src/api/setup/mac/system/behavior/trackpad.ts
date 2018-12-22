import { Logger } from "../../../../../model/logger";
import { Ask } from "../../homebrew/install/utils";
import { DefaultHelper, Write, WriteGlobal } from "../../../../commandline";
import { PrintStartCommand } from "../../../utils";
import { Question } from "../../../../ask";
import chalk from "chalk";
import { runInContext } from "vm";

//   {
//     help: ``,
//     type: "toggle",
//     name: "",
//     message: "",
//     initial: true,
//     active: "Yes",
//     inactive: "No",
//     action: async (result: boolean) => {
//       return await WriteGlobal(log, "", "-bool", result);
//     }
//   },

const domain = {
  builtin: "com.apple.AppleMultitouchTrackpad",
  bluetooth: "com.apple.driver.AppleBluetoothMultitouch.trackpad"
};

// Built-in trackpad
// ActuateDetents                              TrackpadMomentumScroll
// ActuationStrength                           TrackpadPinch
// Clicking                                    TrackpadRightClick
// DragLock                                    TrackpadRotate
// Dragging                                    TrackpadScroll
// FirstClickThreshold                         TrackpadThreeFingerDrag
// ForceSuppressed                             TrackpadThreeFingerHorizSwipeGesture
// SecondClickThreshold                        TrackpadThreeFingerTapGesture
// TrackpadCornerSecondaryClick                TrackpadThreeFingerVertSwipeGesture
// TrackpadFiveFingerPinchGesture              TrackpadTwoFingerDoubleTapGesture
// TrackpadFourFingerHorizSwipeGesture         TrackpadTwoFingerFromRightEdgeSwipeGesture
// TrackpadFourFingerPinchGesture              USBMouseStopsTrackpad
// TrackpadFourFingerVertSwipeGesture          UserPreferences
// TrackpadHandResting                         version
// TrackpadHorizScroll

// Bluetooth trackpad
// Clicking                                    TrackpadRightClick
// DragLock                                    TrackpadRotate
// Dragging                                    TrackpadScroll
// TrackpadCornerSecondaryClick                TrackpadThreeFingerDrag
// TrackpadFiveFingerPinchGesture              TrackpadThreeFingerHorizSwipeGesture
// TrackpadFourFingerHorizSwipeGesture         TrackpadThreeFingerTapGesture
// TrackpadFourFingerPinchGesture              TrackpadThreeFingerVertSwipeGesture
// TrackpadFourFingerVertSwipeGesture          TrackpadTwoFingerDoubleTapGesture
// TrackpadHandResting                         TrackpadTwoFingerFromRightEdgeSwipeGesture
// TrackpadHorizScroll                         USBMouseStopsTrackpad
// TrackpadMomentumScroll                      UserPreferences
// TrackpadPinch                               version

export const BuildTrackpadQuestion = (
  log: Logger,
  messages: {
    help: string;
    cmd_name: string;
    message: string;
    default?: boolean;
    active?: string;
    inactive?: string;
    after?: (result: boolean) => void;
  },
  options?: { builtin?: boolean; bluetooth?: boolean }
) => {
  return {
    help: messages.help,
    type: "toggle",
    name: messages.message.toLowerCase().replace(/ /g, "_"),
    message: messages.message,
    initial: messages.default === undefined ? true : messages.default,
    active: messages.active === undefined ? "Yes" : messages.active,
    inactive: messages.inactive === undefined ? "No" : messages.inactive,
    action: async (result: boolean) => {
      if (messages.after) messages.after(result);
      return BuildTrackpadAction(log, messages.cmd_name, result, options);
    }
  } as Question;
};

export const BuildTrackpadAction = (
  log: Logger,
  name: string,
  result: any,
  settings?: { builtin?: boolean; bluetooth?: boolean }
) => {
  const built = settings && settings.builtin ? settings.builtin : true;
  const bluetooth = settings && settings.bluetooth ? settings.bluetooth : true;

  return new Promise(res => res())
    .then(() => {
      if (built)
        return DefaultHelper(log, domain.builtin, name, { result: result });
      else return Promise.resolve(undefined);
    })
    .then(() => {
      if (bluetooth)
        return DefaultHelper(log, domain.bluetooth, name, { result: result });
      else return Promise.resolve(undefined);
    });
};

export const MacTrackpad = (log: Logger, _opts: {}) => {
  const prev = { three: false, four: false };
  const _q = [
    {
      help: `Look up & data detectors behavior, to show more information`,
      type: "select",
      name: "loop_up_gesture",
      message: "Look up gesture",
      choices: [
        {
          title: "Use force click (in support force click MacOS only)",
          value: "force"
        },
        {
          title: "Use Tap with three fingers",
          value: "three"
        },
        {
          title: "Disable look up behavior",
          value: "no"
        }
      ],
      action: async (_result: "force" | "three" | "no") => {
        const result = {
          three: 0,
          force: 0
        };
        if (_result === "force") result.force = 1;
        if (_result === "three") result.three = 2;

        // defaults write com.apple.AppleMultitouchTrackpad TrackpadThreeFingerTapGesture -int <number>
        // defaults write -g com.apple.trackpad.forceClick -int <number>
        return DefaultHelper(
          log,
          "com.apple.AppleMultitouchTrackpad",
          "TrackpadThreeFingerTapGesture",
          { result: result.three }
        ).then(() =>
          DefaultHelper(log, "com.apple.trackpad.forceClick", undefined, {
            result: result.force,
            global: true
          })
        );
      }
    },
    BuildTrackpadQuestion(log, {
      help: `Tap to click instead of press to click in trackpad`,
      cmd_name: "Clicking",
      message: "Tap to click"
    }),
    {
      help: `Content tracks finger movement.
${chalk.redBright("Reverse")}: Swipe fingers ${chalk.bold.inverse(
        "up"
      )} on trackpad, magic mouse, scroll-wheel, content goes ${chalk.bold.inverse(
        "down"
      )}, scrollbar goes ${chalk.bold.inverse("up")}.
${chalk.redBright("Natural")}: Swipe fingers ${chalk.bold.inverse(
        "up"
      )} on trackpad, magic mouse, scroll-wheel, content goes ${chalk.bold.inverse(
        "up"
      )}, scrollbar goes ${chalk.bold.inverse("down")}.`,
      type: "toggle",
      name: "scrolling",
      message: "Scroll direction",
      initial: true,
      active: "Natural",
      inactive: "Reverse",
      action: async (result: boolean) => {
        // Default scrolling
        // defaults write -g com.apple.swipescrolldirection -bool false
        // Natural scrolling
        // defaults write -g com.apple.swipescrolldirection -bool true
        return await WriteGlobal(
          log,
          "com.apple.swipescrolldirection",
          "-bool",
          result
        );
      }
    },
    BuildTrackpadQuestion(log, {
      help: `After your finger has stopped moving, the page continues to scroll in the intended direction until it slowly stops`,
      cmd_name: "TrackpadMomentumScroll",
      message: "Momentum scroll (Inertia scroll)"
    }),
    BuildTrackpadQuestion(log, {
      help: `Making ${chalk.blueBright("drag window")} AND ${chalk.blueBright(
        "select text"
      )} with ${chalk.blueBright("three finger")} gesture.`,
      cmd_name: "TrackpadThreeFingerDrag",
      message: "Drag / Select text with three finger",
      after: r => (prev.three = r)
    }),
    {
      help: `Exposé To see all the open windows in the current app`,
      type: "multiselect",
      name: "app_expose",
      message: "Enable App Exposé",
      initial: true,
      choices: [
        {
          title: `Swipe down with ${chalk.blue("Three finger")} gesture`,
          value: 3,
          disable: prev.three
        },
        {
          title: `Swipe down with ${chalk.blue("Four finger")} gesture`,
          value: 4,
          disable: prev.four
        }
      ],
      action: async (result: number[]) => {
        console.log(prev.three);

        const data = {
          enable: true,
          three: 0,
          four: 0
        };

        if (!result || result.length < 1) {
          data.enable = false;
        } else {
          result.includes(3) && (data.three = 2);
          result.includes(4) && (data.four = 2);
        }

        Promise.all([
          // defaults write com.apple.dock showAppExposeGestureEnabled -bool <enable>
          DefaultHelper(log, "com.apple.dock", "showAppExposeGestureEnabled", {
            result: data.enable
          }),
          // defaults write com.apple.AppleMultitouchTrackpad TrackpadThreeFingerVertSwipeGesture -int <three>
          // defaults write com.apple.driver.AppleBluetoothMultitouch.trackpad TrackpadThreeFingerVertSwipeGesture -int <three>
          BuildTrackpadAction(
            log,
            "TrackpadThreeFingerVertSwipeGesture",
            data.three
          ),
          // defaults write com.apple.AppleMultitouchTrackpad TrackpadFourFingerVertSwipeGesture -int <three>
          // defaults write com.apple.driver.AppleBluetoothMultitouch.trackpad TrackpadFourFingerVertSwipeGesture -int <three>
          BuildTrackpadAction(
            log,
            "TrackpadFourFingerVertSwipeGesture",
            data.four
          )
        ]);
      }
    }
  ] as Question[];

  PrintStartCommand(log, "Mac", "Behavior", "Trackpad", _q.length);
  return Ask(log, _q);
};
