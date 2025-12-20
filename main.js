import { Game, Scale } from "phaser";
import { Level } from "./src/Level";
import { MainMenu } from "./src/MainMenu";
import { GameOver } from "./src/GameOver";
 

 new Game({
  width: 640,
  height: 360,
  scene: [MainMenu, Level, GameOver],
  physics:{
    default: 'arcade',
    arcade:{
      debug: false
    }
  },
  scale:{
    autoCenter: Scale.CENTER_BOTH,
    mode: Scale.FIT
  },
  pixelArt: true
 })