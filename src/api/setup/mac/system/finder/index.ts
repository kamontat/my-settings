import { PromptType } from "prompts";

import { Logger } from "../../../../../model/logger";

import { Ask, Question } from "../../../../ask";
import {
  yes_no_default,
  YND,
  PrintStartCommand,
  SetOrDefault,
  Reset
} from "../../../utils";
import { WriteGlobal } from "../../../../commandline";

export const Finder = (log: Logger, _: {}) => {
  const finder = "com.apple.finder";
  const _q = [
    {
      help:
        "Reveals hidden files that begin with a period or are flagged specifically as hidden.",
      type: "toggle" as PromptType,
      name: "show_hidden_files",
      message: "Show Hidden files",
      active: "Yes",
      inactive: "No",
      action: async (result: boolean) => {
        // defaults write com.apple.finder AppleShowAllFiles -bool false
        return await SetOrDefault(log, {
          domain: finder,
          name: "AppleShowAllFiles",
          value: result
        });
      }
    },
    {
      help:
        "Play sound effects for common user actions such as emptying the Trash.",
      type: "select" as PromptType,
      name: "play_sound",
      message: "Play sound effects",
      choices: yes_no_default,
      action: async (result: YND) => {
        // defaults delete com.apple.finder FinderSounds
        // defaults write com.apple.finder FinderSounds -bool true
        return await SetOrDefault(log, {
          domain: finder,
          name: "FinderSounds",
          value: result,
          default: v => v === undefined
        });
      }
    },
    {
      help:
        'Disable all interface animations in the Finder. On Snow Leopard (Mac OS X 10.6) and later, this does not disable the "snap to grid" animation.',
      type: "select" as PromptType,
      name: "animations",
      message: "Disable animations",
      choices: yes_no_default,
      action: async (result: YND) => {
        // defaults delete com.apple.finder DisableAllAnimations
        // defaults write com.apple.finder DisableAllAnimations -bool true
        return await SetOrDefault(log, {
          domain: finder,
          name: "DisableAllAnimations",
          value: result,
          default: v => v === undefined
        });
      }
    },
    {
      help: "Allow icons to be shown on the Desktop.",
      type: "select" as PromptType,
      name: "icons_in_desktop",
      message: "Show icons in Desktop",
      choices: yes_no_default,
      action: async (result: YND) => {
        // defaults delete com.apple.finder CreateDesktop
        // defaults write com.apple.finder CreateDesktop -bool true
        return await SetOrDefault(log, {
          domain: finder,
          name: "CreateDesktop",
          value: result,
          default: v => v === undefined
        });
      }
    },
    {
      help:
        'Gives the ability to quit the Finder without relaunching. This feature is shown in the "Finder" menu.',
      type: "select" as PromptType,
      name: "quit_finder",
      message: "Quit instead of relaunch",
      choices: yes_no_default,
      action: async (result: YND) => {
        // defaults delete com.apple.finder QuitMenuItem
        // defaults write com.apple.finder QuitMenuItem -bool true
        return await SetOrDefault(log, {
          domain: finder,
          name: "QuitMenuItem",
          value: result,
          default: v => v === undefined
        });
      }
    },
    {
      help: "Show all file extensions in Finder",
      type: "toggle" as PromptType,
      name: "show_ext",
      message: "Show file extension",
      initial: false,
      active: "Yes",
      inactive: "No",
      action: async (result: boolean) => {
        // defaults write -g AppleShowAllExtensions -bool true
        return WriteGlobal(log, "AppleShowAllExtensions", "-bool", result);
      }
    },
    {
      help:
        "The view mode of new Finder windows that do not already have a custom view set.",
      type: "select" as PromptType,
      name: "finder_view_mode",
      message: "Finder default view mode",
      initial: 1,
      choices: [
        { title: "Default", value: "default" },
        { title: "List view", value: "Nlsv" },
        { title: "Icon view", value: "icnv" },
        { title: "Column view", value: "clmv" },
        { title: "Cover flow view", value: "Flwv" }
      ],
      action: async (result: string) => {
        // defaults delete com.apple.finder FXPreferredViewStyle
        // defaults write com.apple.finder FXPreferredViewStyle -string Nlsv
        return await SetOrDefault(log, {
          domain: finder,
          name: "FXPreferredViewStyle",
          value: result,
          default: v => v === "default"
        });
      }
    },
    {
      help: "The default folder view mode to display search results.",
      type: "select" as PromptType,
      name: "finder_search_view_mode",
      message: "View mode for search result",
      initial: 1,
      choices: [
        { title: "Default", value: "default" },
        { title: "List view", value: "Nlsv" },
        { title: "Icon view", value: "icnv" },
        { title: "Column view", value: "clmv" },
        { title: "Cover flow view", value: "Flwv" }
      ],
      action: async (result: string) => {
        // defaults delete com.apple.finder FXPreferredSearchViewStyle
        // defaults write com.apple.finder FXPreferredSearchViewStyle -string Nlsv
        return await SetOrDefault(log, {
          domain: finder,
          name: "FXPreferredSearchViewStyle",
          value: result,
          default: v => v === "default"
        });
      }
    }
  ] as Question[];

  PrintStartCommand(log, "Mac", "Finder");
  return Ask(log, _q).then(() => {
    Reset(log, "Finder");
  });
};
