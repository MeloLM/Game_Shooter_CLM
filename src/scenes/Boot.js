/**
 * Boot Scene - Asset Preloading
 * Loads all global assets before game starts
 */
export default class Boot extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  preload() {
    // Load textures
    // this.load.image('key', 'path/to/asset');
    
    // Load audio
    // this.load.audio('key', 'path/to/audio');
    
    // Load fonts
    // this.load.bitmapFont('key', 'path/to/font');
  }

  create() {
    // Once loading complete, start MainMenu
    this.scene.start('MainMenu');
  }
}
