import { Logger } from "../../../../../../model/logger";

import { Ask, InstallQuestion } from "../utils";
import { PrintStartCommand, PreAskQuestion } from "../../../../utils";
import { BrewTap, BrewIsTapped } from "../../utils";
import { Question } from "../../../../../ask";
import { Choice } from "prompts";

export const CustomFontChoice = (name: string, url: string) => {
  const dashname = name.toLowerCase().replace(/ /g, "-");
  return {
    title: `Font ${name} (${url})`,
    value: `font-${dashname}`
  };
};

export const GoogleFontChoice = (name: string, url?: string) => {
  const dashname = name.toLowerCase().replace(/ /g, "-");
  const urlname = name.replace(/ /g, "%20");

  const title = `Font ${name} (${
    url ? url : `https://fonts.google.com/specimen/${urlname}`
  })`;
  const value = `font-${dashname}`;
  return {
    title: title,
    value: value
  } as Choice;
};

export const SeperateChoice = (name: string) => {
  return {
    title: name,
    value: "",
    disabled: true
  } as Choice;
};

export const FontGroup = (
  groupName: string,
  desc: string,
  groups: Choice[]
) => {
  return {
    name: groupName,
    muliselect: true,
    cask: true,
    desc: desc,
    choices: groups
  } as InstallQuestion;
};

export const InstallBrewFont = (log: Logger, _opts: {}) => {
  const _q = [
    PreAskQuestion(log, {
      name: "Font",
      default: true,
      yesFn: () => {
        const fontCask = "homebrew/cask-fonts";
        return BrewIsTapped(log, fontCask).then(tap => {
          if (!tap) return BrewTap(log, fontCask);
          return new Promise<undefined>(res => res());
        });
      }
    }),
    ...InstallQuestion(log, [
      FontGroup("Google font set #1", "Popular google set", [
        GoogleFontChoice("Karla"),
        GoogleFontChoice("Lora"),
        GoogleFontChoice("Playfair Display"),
        GoogleFontChoice("Playfair Display SC"),
        GoogleFontChoice("Archivo Black"),
        GoogleFontChoice("Archivo Narrow"),
        GoogleFontChoice("Spectral"),
        GoogleFontChoice("Fjalla One"),
        GoogleFontChoice("Roboto"),
        GoogleFontChoice("Montserrat"),
        GoogleFontChoice("Rubik"),
        GoogleFontChoice("Cardo"),
        GoogleFontChoice("Cormorant"),
        GoogleFontChoice("Work Sans"),
        GoogleFontChoice("Concert one"),
        GoogleFontChoice("Arvo"),
        GoogleFontChoice("Lato"),
        GoogleFontChoice("Abril FatFace"),
        GoogleFontChoice("Old Standard TT"),
        GoogleFontChoice("PT Mono"),
        GoogleFontChoice("PT Serif")
      ]),
      FontGroup("Google font set #2", "Font Optimized for UI", [
        GoogleFontChoice("PT Sans"),
        GoogleFontChoice("Fira Sans"),
        GoogleFontChoice("Nunito"),
        GoogleFontChoice("Oxygen")
      ]),
      FontGroup("Google font set #3", "Legibility and Readability", [
        GoogleFontChoice("Exo"),
        GoogleFontChoice("Exo 2"),
        GoogleFontChoice("Merriweather"),
        GoogleFontChoice("Merriweather Sans"),
        GoogleFontChoice("Open Sans"),
        GoogleFontChoice(
          "Noto Sans Thai",
          "https://www.google.com/get/noto/#sans-thai"
        ),
        GoogleFontChoice("Noto Sans", "https://www.google.com/get/noto"),
        GoogleFontChoice("Source Sans Pro")
      ]),
      FontGroup("My Favorite set", "Development", [
        CustomFontChoice("Fira code", "https://github.com/tonsky/FiraCode"),
        CustomFontChoice(
          "Firacode Nerd Font",
          "https://github.com/ryanoasis/nerd-fonts"
        ),
        CustomFontChoice(
          "Firamono Nerd Font",
          "https://github.com/ryanoasis/nerd-fonts"
        ),
        CustomFontChoice(
          "Firacode Nerd Font Mono",
          "https://github.com/ryanoasis/nerd-fonts"
        ),
        CustomFontChoice(
          "Firamono Nerd Font Mono",
          "https://github.com/ryanoasis/nerd-fonts"
        ),
        CustomFontChoice(
          "Hack Nerd Font",
          "https://github.com/ryanoasis/nerd-fonts"
        ),
        CustomFontChoice(
          "Hack Nerd Font Mono",
          "https://github.com/ryanoasis/nerd-fonts"
        ),
        CustomFontChoice(
          "Dejavu Sans Mono for Powerline",
          "https://github.com/powerline/fonts/tree/master/DejaVuSansMono"
        ),
        CustomFontChoice(
          "Dejavu Sans",
          "https://sourceforge.net/projects/dejavu"
        ),
        CustomFontChoice(
          "Dejavusansmono Nerd Font",
          "https://github.com/ryanoasis/nerd-fonts"
        ),
        CustomFontChoice(
          "Dejavusansmono Nerd Font Mono",
          "https://github.com/ryanoasis/nerd-fonts"
        )
      ])
    ])
  ] as Question[];

  PrintStartCommand(log, "Mac", "Homebrew", "font", _q.length);
  return Ask(log, _q);
};
