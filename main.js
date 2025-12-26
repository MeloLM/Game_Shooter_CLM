import { Game, Scale } from "phaser";
import { Level } from "./src/Level";
import { MainMenu } from "./src/MainMenu";
import { GameOver } from "./src/GameOver";
import { TrophyScreen } from "./src/TrophyScreen";
import { Settings } from "./src/Settings";
 

 new Game({
  width: 640,
  height: 360,
  scene: [MainMenu, Level, GameOver, TrophyScreen, Settings],
  physics:{
    default: 'arcade',
    arcade:{
      debug: false
    }
  },
  scale:{
    autoCenter: Scale.CENTER_BOTH,
    mode: Scale.FIT,
    // Responsive per mobile landscape
    min: {
      width: 320,
      height: 180
    },
    max: {
      width: 1280,
      height: 720
    }
  },
  pixelArt: true,
  // Ottimizzazioni mobile
  input: {
    activePointers: 3  // Supporto multi-touch
  },
  render: {
    antialias: false,
    pixelArt: true
  }
 })