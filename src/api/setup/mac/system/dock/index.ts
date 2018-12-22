import { PromptType, Answers } from "prompts";

import { Logger } from "../../../../../model/logger";

import { Ask } from "../../../../ask";
import {
  yes_no_default,
  YND,
  PrintStartCommand,
  SetOrDefault,
  Reset
} from "../../../utils";

export const Dock = (log: Logger, _: {}) => {
  PrintStartCommand(log, "Mac", "Dock");

  const dock = "com.apple.dock";

  return Ask(log, [
    {
      help: "Position on the screen where the Dock is located.",
      type: "select" as PromptType,
      name: "position",
      message: "Dock position",
      choices: [
        { title: "Default", value: "default" },
        { title: "Bottom", value: "bottom" },
        { title: "Right", value: "right" },
        { title: "Left", value: "left" }
      ],
      action: async (result: "right" | "left" | "bottom" | "default") => {
        // defaults delete com.apple.dock orientation
        // defaults write com.apple.dock orientation -string 'bottom'
        return await SetOrDefault(log, {
          domain: dock,
          name: "orientation",
          value: result,
          default: v => v === "default"
        });
      }
    },
    {
      help: "Show indicator lights for open applications.",
      type: "toggle" as PromptType,
      name: "indicator_light",
      message: "Indicator light",
      initial: true,
      active: "On",
      inactive: "Off",
      action: async (result: boolean) => {
        // defaults write com.apple.dock show-process-indicators -bool false
        return await SetOrDefault(log, {
          domain: dock,
          name: "show-process-indicators",
          value: result
        });
      }
    },
    {
      help:
        "Defines the animation which is used to show windows being minimized into the Dock.",
      type: "select" as PromptType,
      name: "mineffect",
      message: "Minimization effect",
      initial: 1,
      choices: [
        { title: "Default", value: "default" },
        { title: "Suck", value: "suck" },
        { title: "Scale", value: "scale" },
        { title: "Genie", value: "genie" }
      ],
      action: async (result: "default" | "suck" | "scale" | "genie") => {
        // defaults delete com.apple.dock mineffect
        // defaults write com.apple.dock mineffect -string 'genie'
        return await SetOrDefault(log, {
          domain: dock,
          name: "mineffect",
          value: result,
          default: v => v === "default"
        });
      }
    },
    {
      help:
        "Hides the Dock when the mouse cursor is not in its general vicinity, and slides it open when it is.",
      type: "select" as PromptType,
      name: "auto_hide",
      message: "Automatically show and hide dock",
      initial: 1, // yes
      choices: yes_no_default,
      action: async (result: YND) => {
        // defaults delete com.apple.dock autohide
        // defaults write com.apple.dock autohide -bool true
        return await SetOrDefault(log, {
          domain: dock,
          name: "autohide",
          value: result,
          default: v => v === undefined
        });
      }
    },
    {
      help:
        "How long before the Dock automatically hides when the mouse cursor exits its location. Entering a value of zero will disable the delay.",
      type: (type: YND) => (type === true ? "number" : undefined),
      name: "auto_hide_delay",
      message: "Auto hide delay",
      initial: 0,
      increment: 0.1,
      min: -1,
      action: async (result: number) => {
        // defaults delete com.apple.dock autohide-delay
        // defaults write com.apple.dock autohide-delay -float 0
        return await SetOrDefault(log, {
          domain: dock,
          name: "autohide-delay",
          value: result,
          default: v => v < 0
        });
      }
    },
    {
      help:
        "The speed at which the Dock animates closed. Reduce this number to zero to have the Dock snap without any animation.",
      type: (type: number) => (type !== undefined ? "number" : undefined),
      name: "auto_hide_speed",
      message: "Auto hide speed",
      initial: 0.2,
      increment: 0.1,
      min: -1,
      action: async (result: number) => {
        // defaults delete com.apple.dock autohide-time-modifier
        // defaults write com.apple.dock autohide-time-modifier -float 0.2
        return await SetOrDefault(log, {
          domain: dock,
          name: "autohide-time-modifier",
          value: result,
          default: v => v < 0
        });
      }
    },
    {
      help: "While applications are loading, bounce their icons in the Dock.",
      type: "select" as PromptType,
      name: "bounce_icons",
      message: "Bounce icon when launch",
      choices: yes_no_default,
      action: async (result: YND) => {
        // defaults delete com.apple.dock launchanim
        // defaults write com.apple.dock launchanim -bool true
        return await SetOrDefault(log, {
          domain: dock,
          name: "launchanim",
          value: result,
          default: v => v === undefined
        });
      }
    },
    {
      help:
        "When applications request attention, normally the Dock will bounce the icon of that application. This feature prevents any bouncing animation from happening.",
      type: "select" as PromptType,
      name: "prevent_bounce_icons_when_need_attention",
      message: "PREVENT bouncing icon when need attention",
      choices: yes_no_default,
      action: async (result: YND) => {
        // defaults delete com.apple.dock no-bouncing
        // defaults write com.apple.dock no-bouncing -bool true
        return await SetOrDefault(log, {
          domain: dock,
          name: "no-bouncing",
          value: result,
          default: v => v === undefined
        });
      }
    },
    {
      help:
        "Empties the contents of the Dock and forcibly shows only open applications.",
      type: "select" as PromptType,
      name: "hide_when_not_open",
      message: "Hide icon in dock when app not open",
      initial: 2, // no
      choices: yes_no_default,
      action: async (result: YND) => {
        // defaults delete com.apple.dock static-only
        // defaults write com.apple.dock static-only -bool true
        return await SetOrDefault(log, {
          domain: dock,
          name: "static-only",
          value: result,
          default: v => v === undefined
        });
      }
    },
    {
      help:
        "Instead of minimizing windows to the right side of the Dock, windows are minimized into the icon of the application they belong to. To access these minimized windows, right click the Dock icon for that application.",
      type: "toggle" as PromptType,
      name: "mini_to_icon",
      message: "Minimize application into icon",
      initial: true,
      active: "Yes",
      inactive: "No",
      action: async (result: boolean) => {
        // defaults write com.apple.dock minimize-to-application -bool true
        return await SetOrDefault(log, {
          domain: dock,
          name: "minimize-to-application",
          value: result
        });
      }
    },
    {
      help:
        "Manually set the size of the icons in the Dock. If negative number will be factory reset",
      type: "number" as PromptType,
      name: "icon_size",
      message: "Icon size",
      initial: 79,
      min: -1,
      action: async (result: number) => {
        // defaults delete com.apple.dock tilesize
        // defaults write com.apple.dock tilesize -int 79
        return await SetOrDefault(log, {
          domain: dock,
          name: "tilesize",
          value: result,
          default: v => v < 0
        });
      }
    },
    {
      help: "Icons in the Dock will enlarge when the mouse hovers over them.",
      type: "select" as PromptType,
      name: "enable_mag",
      message: "Magnification",
      choices: yes_no_default,
      action: async (result: YND) => {
        // defaults delete com.apple.dock magnification
        // defaults write com.apple.dock magnification -bool false
        return await SetOrDefault(log, {
          domain: dock,
          name: "magnification",
          value: result,
          default: v => v === undefined
        });
      }
    },
    {
      help:
        "The size, in pixels, of the icons when the mouse hovers over items in the Dock.",
      type: (type: YND) => (type === true ? "number" : undefined),
      name: "mag_size",
      message: "Magnification size",
      initial: (_: any, q: Answers<string>) => {
        return (q.icon_size as number) + 1;
      },
      min: -1,
      action: async (result: number) => {
        // defaults delete com.apple.dock largesize
        // defaults write com.apple.dock largesize -int 120
        return await SetOrDefault(log, {
          domain: dock,
          name: "largesize",
          value: result,
          default: v => v < 0
        });
      }
    },
    {
      help:
        "While hovering over top of an icon in the Dock, use the scroll wheel on the mouse, or use the scroll gesture on the track pad to expose all the windows in the app.",
      type: "select" as PromptType,
      name: "scroll_expose_window",
      message: "Scroll to show window",
      initial: 1, // yes
      choices: yes_no_default,
      action: async (result: YND) => {
        // defaults delete com.apple.dock scroll-to-open
        // defaults write com.apple.dock scroll-to-open -bool false
        return await SetOrDefault(log, {
          domain: dock,
          name: "scroll-to-open",
          value: result,
          default: v => v === undefined
        });
      }
    },
    {
      help:
        "When switching between applications by clicking app icons in the Dock, all other apps are hidden in the background.",
      type: "select" as PromptType,
      name: "single_mode",
      message: "Single application mode",
      choices: yes_no_default,
      action: async (result: YND) => {
        // defaults delete com.apple.dock single-app
        // defaults write com.apple.dock single-app -bool false
        return await SetOrDefault(log, {
          domain: dock,
          name: "single-app",
          value: result,
          default: v => v === undefined
        });
      }
    }
  ]).then(() => {
    Reset(log, "Dock");
  });
};
