import { Game, Scale } from "phaser";
import { Level } from "./src/scenes/Level";
import { MainMenu } from "./src/scenes/MainMenu";
import { GameOver } from "./src/scenes/GameOver";
import { TrophyScreen } from "./src/scenes/TrophyScreen";
import { Settings } from "./src/scenes/Settings";
 

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