import { Logger } from "../../../../../../model/logger";

import { AskInstall } from "../utils";
import { PrintStartCommand } from "../../../../utils";

export const InstallBrewMainDev = (log: Logger, _opts: {}) => {
  const _q = [
    {
      name: "android-studio",
      cask: true,
      desc:
        "Android Studio provides the fastest tools for building apps on every type of Android device.",
      link: "https://developer.android.com/studio",
      default: false
    },
    {
      name: "charles",
      cask: true,
      desc:
        "an HTTP proxy / HTTP monitor / Reverse Proxy that enables a developer to view all of the HTTP and SSL / HTTPS traffic",
      link: "https://www.charlesproxy.com",
      default: false
    },
    {
      name: "wireshark",
      cask: true,
      desc: "the world’s foremost and widely-used network protocol analyzer",
      link: "https://www.wireshark.org",
      default: false
    },
    {
      name: "postman",
      cask: true,
      desc: "Postman is the only complete API Development Environment",
      link: "https://www.getpostman.com/"
    },
    {
      name: "docker",
      cask: true,
      desc:
        "The preferred choice for millions of developers that are building containerized applications",
      link: "https://www.docker.com",
      default: "toolbox",
      choices: ["toolbox", "edge"]
    },
    {
      name: "visual-studio-code",
      cask: true,
      link: "https://code.visualstudio.com/",
      default: "insiders",
      choices: ["insiders"]
    },
    {
      name: "atom",
      cask: true,
      desc: "A hackable text editor for the 21st Century",
      link: "https://atom.io",
      default: "no",
      choices: ["beta"]
    },
    {
      name: "iterm2",
      cask: true,
      desc: "a replacement for Terminal and the successor to iTerm",
      link: "https://www.iterm2.com",
      default: "default",
      choices: ["beta", "nightly", "legacy"]
    },
    {
      name: "sourcetree",
      cask: true,
      desc: "Simplicity and power in a beautiful Git GUI",
      link: "https://www.sourcetreeapp.com",
      default: false
    },
    {
      name: "asdf",
      desc:
        "Extendable version manager with support mulitple programming language",
      link: "https://github.com/asdf-vm/asdf"
    },
    {
      name: "git",
      desc:
        "version control system designed to handle everything from small to very large projects with speed and efficiency.",
      link: "https://git-scm.com/"
    },
    {
      name: "git-extras",
      desc:
        "GIT utilities -- repo summary, repl, changelog population, author commit percentages and more",
      link: "https://github.com/tj/git-extras"
    },
    {
      name: "bash",
      desc:
        "Bash is an sh-compatible shell that incorporates useful features from the Korn shell (ksh) and C shell (csh).",
      link: "https://www.gnu.org/software/bash/",
      default: false
    },
    {
      name: "bash-completion@2",
      desc: "Programmable completion for Bash 4.1+",
      link: "https://salsa.debian.org/debian/bash-completion",
      default: false
    },
    {
      name: "zsh",
      desc: "UNIX shell (command interpreter)",
      link: "https://www.zsh.org"
    },
    {
      name: "zsh-completions",
      desc: "Additional completion definitions for zsh",
      link: "https://github.com/zsh-users/zsh-completions"
    }
  ];

  PrintStartCommand(log, "Mac", "Homebrew", "Development", _q.length);
  return AskInstall(log, _q);
};
