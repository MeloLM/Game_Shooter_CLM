/**
 * PauseManager.js
 * Gestisce il sistema di pausa del gioco
 * Seguendo il pattern Event-Driven dell'architettura
 */
export class PauseManager {
  constructor(scene) {
    this.scene = scene;
    this.isPaused = false;
    this.pauseContainer = null;
    this.trophyModal = null;
  }

  create() {
    this.pauseContainer = this.scene.add.container(0, 0);
    this.pauseContainer.setScrollFactor(0);
    this.pauseContainer.setDepth(100);
    this.pauseContainer.setVisible(false);

    // Overlay
    const overlay = this.scene.add.rectangle(320, 180, 640, 360, 0x000000, 0.7);
    this.pauseContainer.add(overlay);

    // Title
    const title = this.scene.add.text(320, 100, 'PAUSA', {
      fontFamily: 'Verdana', fontSize: '32px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.pauseContainer.add(title);

    // Buttons
    const resumeBtn = this.createButton(320, 180, 'RIPRENDI', () => this.toggle(), 0x00ff00);
    this.pauseContainer.add(resumeBtn);

    const trophyBtn = this.createButton(320, 240, 'TROFEI', () => this.openTrophyModal(), 0xffd700);
    this.pauseContainer.add(trophyBtn);

    const menuBtn = this.createButton(320, 300, 'MENU PRINCIPALE', () => {
      this.scene.scene.stop('Level');
      this.scene.scene.start('MainMenu');
    }, 0xff0000);
    this.pauseContainer.add(menuBtn);

    // Input
    this.scene.input.keyboard.on('keydown-ESC', () => this.toggle());
    this.scene.input.keyboard.on('keydown-P', () => this.toggle());
  }

  createButton(x, y, text, callback, color) {
    const container = this.scene.add.container(x, y);

    const bg = this.scene.add.rectangle(0, 0, 200, 45, 0x000000, 0.5);
    bg.setStrokeStyle(2, color);
    bg.setInteractive({ useHandCursor: true });

    const label = this.scene.add.text(0, 0, text, {
      fontFamily: 'Verdana', fontSize: '16px', color: '#ffffff', fontStyle: 'bold'
    }).setOrigin(0.5);

    container.add([bg, label]);

    bg.on('pointerover', () => { bg.setFillStyle(color, 0.3); label.setScale(1.05); });
    bg.on('pointerout', () => { bg.setFillStyle(0x000000, 0.5); label.setScale(1); });
    bg.on('pointerdown', callback);

    return container;
  }

  openTrophyModal() {
    this.trophyModal = this.scene.add.container(320, 180);
    this.trophyModal.setScrollFactor(0).setDepth(200); // Above pause menu

    // Background
    const bg = this.scene.add.rectangle(0, 0, 500, 340, 0x1a1a2e, 0.95);
    bg.setStrokeStyle(2, 0xffd700);
    this.trophyModal.add(bg);

    // Title
    this.trophyModal.add(this.scene.add.text(0, -150, 'ACHIEVEMENTS', {
      fontFamily: 'Verdana', fontSize: '22px', color: '#ffd700', fontStyle: 'bold'
    }).setOrigin(0.5));

    // Close Button
    const closeBtn = this.scene.add.text(230, -150, 'X', {
      fontFamily: 'Verdana', fontSize: '20px', color: '#ff0000', fontStyle: 'bold'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => this.trophyModal.destroy());
    this.trophyModal.add(closeBtn);

    // Scrollable Logic (Simplified for now with fixed Page or small list)
    // For now, listing items. If too many, we might need pagination or masking.
    // Let's implement a scroll mask.
    const listContainer = this.scene.add.container(0, -110);
    const maskShape = this.scene.make.graphics();
    maskShape.fillStyle(0xffffff);
    maskShape.fillRect(320 - 240, 180 - 110, 480, 260); // Absolute coords for mask
    const mask = maskShape.createGeometryMask();
    listContainer.setMask(mask);
    this.trophyModal.add(listContainer);

    const achievements = this.scene.achievementSystem.achievements;
    const unlockedIds = this.scene.achievementSystem.unlockedAchievements;

    achievements.forEach((ach, index) => {
      const isUnlocked = unlockedIds.includes(ach.id);
      const y = index * 60;

      const itemBg = this.scene.add.rectangle(0, y, 460, 50, 0x000000, 0.3);
      if (isUnlocked) itemBg.setStrokeStyle(1, 0x00ff00);

      const icon = this.scene.add.text(-210, y, ach.icon, { fontSize: '24px' }).setOrigin(0.5);
      const name = this.scene.add.text(-180, y - 10, ach.name, {
        fontFamily: 'Verdana', fontSize: '14px', color: isUnlocked ? '#ffffff' : '#888888', fontStyle: 'bold'
      }).setOrigin(0, 0.5);
      const desc = this.scene.add.text(-180, y + 10, ach.description, {
        fontFamily: 'Verdana', fontSize: '10px', color: '#aaaaaa'
      }).setOrigin(0, 0.5);

      listContainer.add([itemBg, icon, name, desc]);
    });

    // Simple drag scroll
    const zone = this.scene.add.zone(0, 0, 500, 340).setInteractive();
    this.trophyModal.addAt(zone, 0); // Behind items, before bg? No, zone must be top.

    let dragStartY = 0;
    zone.on('pointerdown', (p) => { dragStartY = p.y; });
    zone.on('pointermove', (p) => {
      if (p.isDown) {
        const dy = p.y - dragStartY;
        listContainer.y += dy;
        dragStartY = p.y;
        // Clamp
        const minY = -110 - (achievements.length * 60 - 260);
        if (listContainer.y > -110) listContainer.y = -110;
        if (listContainer.y < minY) listContainer.y = minY;
      }
    });
  }

  toggle() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.scene.physics.pause();
      this.pauseContainer.setVisible(true);
    } else {
      this.scene.physics.resume();
      this.pauseContainer.setVisible(false);
      if (this.trophyModal) this.trophyModal.destroy();
    }
    this.scene.events.emit('pauseStateChanged', this.isPaused);
  }

  getIsPaused() { return this.isPaused; }
}
