/**
 * ShopSystem - Sistema shop tra le wave
 * Permette al player di comprare upgrade con le monete raccolte
 */

export class ShopSystem {
  scene;
  isOpen = false;
  coins = 0;

  // UI Elements
  shopContainer = null;
  coinDisplay = null;

  // Scroll
  scrollContainer = null;
  maskGraphics = null;
  scrollY = 0;
  isDragging = false;
  lastY = 0;

  // Catalogo upgrade disponibili
  upgrades = [
    {
      id: 'heal_small',
      name: '❤️ Cura Piccola',
      description: 'Recupera 100 HP',
      cost: 10,
      type: 'consumable',
      effect: (scene) => {
        scene.player.heal(100);
      }
    },
    {
      id: 'heal_full',
      name: '💖 Cura Completa',
      description: 'Recupera tutti gli HP',
      cost: 30,
      type: 'consumable',
      effect: (scene) => {
        scene.player.heal(scene.player.maxHP);
      }
    },
    {
      id: 'damage_up',
      name: '⚔️ Danno +5',
      description: 'Aumenta il danno base',
      cost: 25,
      type: 'permanent',
      effect: (scene) => {
        scene.player.bonusDamage += 5;
      }
    },
    {
      id: 'speed_up',
      name: '👟 Velocità +10',
      description: 'Aumenta la velocità',
      cost: 20,
      type: 'permanent',
      effect: (scene) => {
        scene.player.baseSpeed += 10;
        scene.player.speed = scene.player.baseSpeed;
      }
    },
    {
      id: 'max_hp_up',
      name: '🛡️ HP Max +100',
      description: 'Aumenta HP massimi',
      cost: 35,
      type: 'permanent',
      effect: (scene) => {
        scene.player.maxHP += 100;
        scene.player.currentHP += 100;
      }
    },
    {
      id: 'shield_time',
      name: '🔵 Scudo Esteso',
      description: 'Immunità +3 secondi',
      cost: 40,
      type: 'permanent',
      effect: (scene) => {
        scene.immuneDuration += 3000;
      }
    }
  ];

  constructor(scene) {
    this.scene = scene;
    this.loadCoins();
  }

  /**
   * Carica monete da localStorage
   */
  loadCoins() {
    try {
      const saved = localStorage.getItem('knightShooter_coins');
      this.coins = saved ? parseInt(saved) : 0;
    } catch (e) {
      this.coins = 0;
    }
  }

  /**
   * Salva monete
   */
  saveCoins() {
    try {
      localStorage.setItem('knightShooter_coins', this.coins.toString());
    } catch (e) {
      console.warn('[ShopSystem] Cannot save coins');
    }
  }

  /**
   * Aggiungi monete
   */
  addCoins(amount) {
    this.coins += amount;
    this.updateCoinDisplay();
    // Non salvare ogni volta per performance, salva alla fine wave
  }

  /**
   * Rimuovi monete
   */
  spendCoins(amount) {
    if (this.coins >= amount) {
      this.coins -= amount;
      this.updateCoinDisplay();
      return true;
    }
    return false;
  }

  /**
   * Crea UI dello shop
   */
  createShopUI() {
    const centerX = 320;
    const centerY = 180;

    // Container principale
    this.shopContainer = this.scene.add.container(centerX, centerY);
    this.shopContainer.setScrollFactor(0);
    this.shopContainer.setDepth(2000); // Super high depth to overlay everything
    this.shopContainer.setVisible(false);

    // Background overlay (Semi-transparent, less intrusive)
    const bg = this.scene.add.rectangle(0, 0, 500, 340, 0x1a1a2e, 0.95);
    bg.setStrokeStyle(3, 0xffd700);
    this.shopContainer.add(bg);

    // Decorative header background
    const headerBg = this.scene.add.rectangle(0, -130, 500, 50, 0x111122, 1);
    this.shopContainer.add(headerBg);

    // Titolo
    const title = this.scene.add.text(0, -130, 'MERCAZIO', {
      fontFamily: 'Verdana',
      fontSize: '28px',
      color: '#ffd700',
      fontStyle: 'bold'
    });
    title.setOrigin(0.5);
    this.shopContainer.add(title);

    // Coin display container
    const coinBg = this.scene.add.rectangle(0, -90, 150, 30, 0x000000, 0.5);
    this.shopContainer.add(coinBg);

    // Coin Icon
    const coinIcon = this.scene.add.image(-40, -90, 'coin');
    coinIcon.setDisplaySize(16, 16);
    this.shopContainer.add(coinIcon);

    // Coin Text
    this.coinDisplay = this.scene.add.text(-10, -90, `${this.coins}`, {
      fontFamily: 'Verdana',
      fontSize: '18px',
      color: '#ffd700',
      fontStyle: 'bold'
    });
    this.coinDisplay.setOrigin(0, 0.5);
    this.shopContainer.add(this.coinDisplay);

    // --- SCROLLABLE AREA SETUP ---
    const maskX = centerX - 240;
    const maskY = centerY - 80;
    const maskW = 480;
    const maskH = 220;

    // Maschera
    this.maskGraphics = this.scene.make.graphics();
    this.maskGraphics.fillStyle(0xffffff);
    this.maskGraphics.fillRect(maskX, maskY, maskW, maskH);
    const mask = new Phaser.Display.Masks.GeometryMask(this.scene, this.maskGraphics);

    // Container scorrevole
    this.scrollContainer = this.scene.add.container(0, 0);
    this.shopContainer.add(this.scrollContainer);
    this.scrollContainer.setMask(mask);

    // Input area for scrolling (invisible rect over the list)
    // FIX: This rect was likely blocking button clicks if depth was wrong or it consumed inputs.
    // Instead of a blocking rect, we use a Zone that provides scroll but lets clicks through if not dragging.
    const hitArea = this.scene.add.zone(0, 30, maskW, maskH);
    hitArea.setInteractive();
    // Move hitArea to the back of the container so buttons (added later) are on top? 
    // Actually, buttons are in `scrollContainer`. `hitArea` is in `shopContainer`.
    // If `hitArea` is in front of `scrollContainer`, it blocks.
    // If `hitArea` is behind, `scrollContainer` buttons take precedence.
    this.shopContainer.add(hitArea);
    this.shopContainer.sendToBack(hitArea); // Ensure it's behind content?
    // Wait, if it's behind, then clicking empty space scrolls, but clicking button clicks button.
    // But we want to be able to drag *starting* from a button too.

    // Better Logic: Detect drag vs click globally or on specific elements.

    // For now, let's make the hitArea transparent to clicks but used for drag reference? 
    // No, Phaser input is hierarchical. 

    // Let's REMOVE the blocking hitArea and just use the background or a general input handler that doesn't stop propagation.
    // Or simpler: Make the buttons themselves draggable? No.

    // Solution: Add the scroll listener to the container/background, but ensure buttons don't stop propagation?
    // Or, remove the explicit `pointers` blockage.

    // Let's try: `hitArea` should NOT be interactive in a blocking way.
    // Actually, simpler fix: The user said "link is only in the row of the first object".
    // This implies the *mask* limits the interactive area of the *children*, or the hitArea size was tiny (default 0x0 without setSize).
    // In the previous code: `this.scene.add.rectangle(0, 30, maskW, maskH, ...)` has default origin 0.5.
    // It covered the center.

    // Let's use the SCENE input for scrolling logic to avoid blocking buttons.
    // And rely on the wheel for main PC scrolling.

    // Scroll Logic (Global)
    this.scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      if (this.isOpen) this.scroll(deltaY * 0.5);
    });

    // Drag Logic (Global but checked against bounds)
    this.scene.input.on('pointerdown', (pointer) => {
      if (this.isOpen &&
        pointer.x > maskX && pointer.x < maskX + maskW &&
        pointer.y > maskY && pointer.y < maskY + maskH) {
        this.isDragging = true;
        this.lastY = pointer.y;
      }
    });
    this.scene.input.on('pointerup', () => {
      this.isDragging = false;
    });
    this.scene.input.on('pointermove', (pointer) => {
      if (this.isOpen && this.isDragging) {
        const dy = this.lastY - pointer.y;
        this.scroll(dy);
        this.lastY = pointer.y;
      }
    });

    // Upgrade buttons
    this.createUpgradeButtons();

    // Close button
    const closeBtn = this.scene.add.text(0, 130, '[Premi SPACE o clicca qui per chiudere]', {
      fontFamily: 'Verdana',
      fontSize: '12px',
      color: '#aaaaaa'
    });
    closeBtn.setOrigin(0.5);
    closeBtn.setInteractive();
    closeBtn.on('pointerdown', () => this.close());
    this.shopContainer.add(closeBtn);

    // Keyboard listener
    this.scene.input.keyboard.on('keydown-SPACE', () => {
      if (this.isOpen) this.close();
    });
  }

  /**
   * Gestisce lo scroll
   */
  scroll(amount) {
    if (!this.scrollContainer) return;

    this.scrollY -= amount;

    // Bounds
    const contentHeight = this.upgrades.length * 60; // 60px height per item
    const viewHeight = 220;
    const minScroll = -(contentHeight - viewHeight) - 20; // extra padding
    const maxScroll = 0;

    if (minScroll > 0) {
      this.scrollY = 0; // Content fits perfectly
    } else {
      this.scrollY = Phaser.Math.Clamp(this.scrollY, minScroll, maxScroll);
    }

    this.scrollContainer.y = this.scrollY;
  }

  /**
   * Crea bottoni upgrade
   */
  createUpgradeButtons() {
    const startY = -60;
    const spacing = 55;

    // Clear old
    this.scrollContainer.removeAll(true);

    this.upgrades.forEach((upgrade, index) => {
      const y = startY + (index * spacing);

      // Container per singolo item
      const itemCont = this.scene.add.container(0, y);
      const itemWidth = 440;
      const itemHeight = 50;

      // Make the whole container interactive as a "div"
      itemCont.setInteractive(new Phaser.Geom.Rectangle(-itemWidth / 2, -itemHeight / 2, itemWidth, itemHeight), Phaser.Geom.Rectangle.Contains);

      // Background Item
      const btnBg = this.scene.add.rectangle(0, 0, itemWidth, itemHeight, 0x2a2a4e, 1);
      btnBg.setStrokeStyle(1, 0x444488);
      // We don't need btnBg interactive if container is, but let's keep visual feedback logic on it or container.
      itemCont.add(btnBg);

      // Icon
      let iconKey = 'potion';
      if (upgrade.id === 'damage_up') iconKey = 'sword';
      else if (upgrade.id === 'max_hp_up') iconKey = 'green_potion';
      else if (upgrade.id === 'heal_full') iconKey = 'red_potion';
      else if (upgrade.id === 'shield_time') iconKey = 'shield1';
      else if (upgrade.id === 'speed_up') iconKey = 'blue_potion';

      try {
        const icon = this.scene.add.image(-200, 0, iconKey).setDisplaySize(32, 32);
        itemCont.add(icon);
      } catch (e) {
        itemCont.add(this.scene.add.text(-200, 0, '⚡').setOrigin(0.5));
      }

      // Texts
      const nameText = this.scene.add.text(-170, -15, upgrade.name, {
        fontFamily: 'Verdana', fontSize: '18px', color: '#ffffff', fontStyle: 'bold'
      });
      itemCont.add(nameText);

      const descText = this.scene.add.text(-170, 8, upgrade.description, {
        fontFamily: 'Verdana', fontSize: '12px', color: '#aaaaaa'
      });
      itemCont.add(descText);

      // Cost
      const costContainer = this.scene.add.container(160, 0);
      const costIcon = this.scene.add.image(-15, 0, 'coin').setDisplaySize(16, 16);
      const costText = this.scene.add.text(5, 0, `${upgrade.cost}`, {
        fontFamily: 'Verdana', fontSize: '18px', color: '#ffd700', fontStyle: 'bold'
      }).setOrigin(0, 0.5);

      costContainer.add([costIcon, costText]);
      itemCont.add(costContainer);

      // Events on the Container (The "Div")
      itemCont.on('pointerover', () => { btnBg.setFillStyle(0x3a3a6e); });
      itemCont.on('pointerout', () => { btnBg.setFillStyle(0x2a2a4e); });
      itemCont.on('pointerdown', () => {
        if (!this.isDragging) this.purchaseUpgrade(upgrade);
      });

      this.scrollContainer.add(itemCont);
    });
  }

  /**
   * Acquista upgrade
   */
  purchaseUpgrade(upgrade) {
    if (this.coins >= upgrade.cost) {
      this.spendCoins(upgrade.cost);
      upgrade.effect(this.scene);

      // Feedback visivo
      this.showPurchaseFeedback(upgrade.name);

      // Suono (se disponibile)
      if (this.scene.audioManager) {
        this.scene.audioManager.playSFX('item_pickup');
      }
    } else {
      // Non abbastanza monete
      this.showNotEnoughCoins();
    }
  }

  /**
   * Feedback acquisto
   */
  showPurchaseFeedback(itemName) {
    const text = this.scene.add.text(320, 250, `✓ ${itemName} acquistato!`, {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#00ff00',
      fontStyle: 'bold'
    });
    text.setOrigin(0.5);
    text.setScrollFactor(0);
    text.setDepth(250);

    this.scene.tweens.add({
      targets: text,
      y: text.y - 30,
      alpha: 0,
      duration: 1500,
      onComplete: () => text.destroy()
    });
  }

  /**
   * Feedback monete insufficienti
   */
  showNotEnoughCoins() {
    const text = this.scene.add.text(320, 250, '✗ Monete insufficienti!', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ff0000',
      fontStyle: 'bold'
    });
    text.setOrigin(0.5);
    text.setScrollFactor(0);
    text.setDepth(250);

    this.scene.tweens.add({
      targets: text,
      alpha: 0,
      duration: 1000,
      onComplete: () => text.destroy()
    });
  }

  /**
   * Apri shop
   */
  open() {
    if (!this.shopContainer) {
      this.createShopUI();
    }

    this.isOpen = true;
    this.shopContainer.setVisible(true);
    this.updateCoinDisplay();

    // Pausa il gioco
    this.scene.physics.pause();
  }

  /**
   * Chiudi shop
   */
  close() {
    this.isOpen = false;
    if (this.shopContainer) {
      this.shopContainer.setVisible(false);
    }

    // Salva monete
    this.saveCoins();

    // Riprendi gioco
    this.scene.physics.resume();

    // Notifica wave manager
    this.scene.events.emit('shopClosed');
  }

  /**
   * Aggiorna display monete
   */
  updateCoinDisplay() {
    if (this.coinDisplay) {
      this.coinDisplay.setText(`${this.coins}`);
    }
  }

  /**
   * Reset per nuova partita
   */
  reset() {
    this.coins = 0;
    this.saveCoins();
  }
}
