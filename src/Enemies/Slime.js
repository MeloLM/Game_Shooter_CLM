import { Physics } from "phaser";

export class Slime extends Physics.Arcade.Sprite{
  enemyHP = 40;
  enemyDmg = 20;

  constructor(scene, x, y, texture = "slime"){
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    scene.anims.create({
      key: "slime_run",
      repeat: -1,
      frameRate: 6,
      frames: scene.anims.generateFrameNumbers(texture, {
        start: 0,
        end: 5,
      })
    });

    this.scene.physics.add.overlap(this, this.player, () => {
      this.player.takeDamage(this.enemyDmg);
    });

    this.play("slime_run");
  };

  die() {
    this.scene.enemies.splice(this.scene.enemies.indexOf(this),1)
		this.destroy();
	}
}