import { Logger } from "../../../../../../model/logger";
import { AskInstall } from "../utils";
import { PrintStartCommand } from "../../../../utils";

export const InstallBrewMain = (log: Logger, _opts: {}) => {
  const _q = [
    {
      name: "appcleaner",
      cask: true,
      desc: "Allows you to thoroughly uninstall unwanted apps",
      link: "https://freemacsoft.net/appcleaner"
    },
    {
      name: "firefox",
      cask: true,
      link: "https://www.mozilla.org/firefox",
      default: false,
      choices: ["beta", "developer-edition", "nightly", "esr"]
    },
    {
      name: "google-chrome",
      cask: true,
      link: "https://www.google.com/chrome",
      default: false,
      choices: ["beta", "canary", "dev"]
    },
    {
      name: "mactex",
      cask: true,
      desc:
        "Editor to wrote computer language designed for use in typesetting; in particular, for typesetting math and other technical",
      link: "https://www.tug.org/mactex",
      default: false
    },
    {
      name: "skype",
      cask: true,
      link: "https://www.skype.com/",
      default: false
    },
    {
      name: "teamviewer",
      cask: true,
      desc: "remote control and remote support.",
      link: "https://www.teamviewer.com/",
      default: false
    },
    {
      name: "steam",
      cask: true,
      desc:
        "The ultimate entertainment platform. Play, connect, create, and more. Install Steam today and start gaming!",
      link: "https://store.steampowered.com/about/"
    },
    {
      name: "the-unarchiver",
      cask: true,
      desc:
        "The Unarchiver is the only app you need to open RAR on Mac. It’s times more powerful than the native macOS utility and supports infinitely more archive formats.",
      link: "https://theunarchiver.com"
    },
    {
      name: "vlc",
      cask: true,
      desc:
        "VLC is a free and open source cross-platform multimedia player and framework that plays most multimedia files as well as DVDs, Audio CDs, VCDs, and various streaming protocols.",
      link: "https://www.videolan.org/vlc"
    },
    {
      name: "whatpulse",
      cask: true,
      desc: "all you need to know everything about your computing habits",
      link: "https://whatpulse.org"
    }
  ];

  PrintStartCommand(log, "Mac", "Homebrew", "Main", _q.length);
  return AskInstall(log, _q);
};
