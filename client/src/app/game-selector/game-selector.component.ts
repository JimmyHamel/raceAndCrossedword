import { Component } from "@angular/core";
import * as Url from "../../../../common/communication/communication-url";
import { NO_CONTENT } from "../crossword/grid/constant";
import { DIFFICULTY_FR } from "../crossword/constants-ui-text";

interface Game {
  title: string;
  description: string;
  image_url: string;
  game_url: string;
  gamemode_name: string[];
  gamemode_url: string[];
  options_name: string [][];
  options_url: string [][];
}

const CROSSWORD: Game = {
  title: "Mots croisés",
  description: "Un jeu de mots croisés en ligne!",
  image_url: Url.CW_IMG_URL,
  game_url: Url.CROSSWORD_BOARD_URL,
  gamemode_name: ["Solo", "Multijoueur"],
  gamemode_url: [Url.GameMode.singleplayer, Url.GameMode.multiplayer],
  options_name: [
    DIFFICULTY_FR,
    ["Creer", "Rejoindre"]
  ],
  options_url: [
    [Url.EASY_URL, Url.MEDIUM_URL, Url.HARD_URL],
    [Url.CROSSWORD_NEWROOM_URL, Url.CROSSWORD_LOBBY_URL],
  ]
};

const CAR: Game = {
  title: "Jeu de course",
  description: "Devenez un pilote professionel et tester nos pistes",
  image_url: Url.RACE_IMG_URL,
  game_url: "",
  gamemode_name: ["Solo"],
  gamemode_url: [NO_CONTENT],
  options_name: [
    ["Jouer", "Admin"]
  ],
  options_url: [
    [Url.LIST_URL, Url.ADMIN_URL],
  ],
};

@Component({
  selector: "app-game-selector",
  templateUrl: "./game-selector.component.html",
  styleUrls: ["./game-selector.component.css"]
})

export class GameSelectorComponent {
  public games: Game[];
  public readonly title: string = "LOG2990 - Equipe 14";

  public constructor() {
    this.games = [CROSSWORD, CAR];
  }

}
