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
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#ffd700',
      fontStyle: 'bold'
    });
    title.setOrigin(0.5);
    this.shopContainer.add(title);

    // Icona Shop (Carrello) - Se disponibile, altrimenti testo
    // if (this.scene.textures.exists('shop_icon')) ...

    // Coin display container
    const coinBg = this.scene.add.rectangle(0, -90, 150, 30, 0x000000, 0.5);
    this.shopContainer.add(coinBg);

    // Coin Icon
    const coinIcon = this.scene.add.image(-40, -90, 'coin');
    coinIcon.setDisplaySize(16, 16);
    this.shopContainer.add(coinIcon);

    // Coin Text
    this.coinDisplay = this.scene.add.text(-10, -90, `${this.coins}`, {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#ffd700',
      fontStyle: 'bold'
    });
    this.coinDisplay.setOrigin(0, 0.5);
    this.shopContainer.add(this.coinDisplay);

    // Upgrade buttons
    this.createUpgradeButtons();

    // Close button
    const closeBtn = this.scene.add.text(0, 130, '[Premi SPACE o clicca qui per chiudere]', {
      fontFamily: 'Arial',
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
   * Crea bottoni upgrade
   */
  createUpgradeButtons() {
    const startY = -60;
    const spacing = 45;

    this.upgrades.forEach((upgrade, index) => {
      const y = startY + (index * spacing);

      // Button background with hover effect
      const btnBg = this.scene.add.rectangle(0, y, 460, 40, 0x2a2a4e, 1);
      btnBg.setStrokeStyle(1, 0x444488);
      btnBg.setInteractive({ useHandCursor: true });

      // Icon selection based on ID
      let iconKey = 'potion'; // default
      let iconFrame = null;

      if (upgrade.id === 'heal_small') { iconKey = 'potion'; }
      else if (upgrade.id === 'heal_full') { iconKey = 'red_potion'; } // Assuming red_potion exists or use potion with tint
      else if (upgrade.id === 'damage_up') { iconKey = 'sword'; }
      else if (upgrade.id === 'speed_up') { iconKey = 'blue_potion'; } // Placeholder for speed
      else if (upgrade.id === 'max_hp_up') { iconKey = 'green_potion'; }
      else if (upgrade.id === 'shield_time') { iconKey = 'shield1'; }

      // Icon
      try {
        const icon = this.scene.add.image(-200, y, iconKey, iconFrame);
        icon.setDisplaySize(24, 24);
        this.shopContainer.add(icon);
      } catch (e) {
        // Fallback text if image fails
        const iconText = this.scene.add.text(-200, y, '⚡', { fontSize: '20px' });
        iconText.setOrigin(0.5);
        this.shopContainer.add(iconText);
      }

      // Hover effects
      btnBg.on('pointerover', () => {
        btnBg.setFillStyle(0x3a3a6e);
        this.scene.tweens.add({
          targets: [nameText, costText],
          scale: 1.1,
          duration: 100
        });
      });
      btnBg.on('pointerout', () => {
        btnBg.setFillStyle(0x2a2a4e);
        this.scene.tweens.add({
          targets: [nameText, costText],
          scale: 1,
          duration: 100
        });
      });

      // Click handler
      btnBg.on('pointerdown', () => {
        this.purchaseUpgrade(upgrade);
        // Little bounce
        this.scene.tweens.add({
          targets: btnBg,
          scaleX: 0.98,
          scaleY: 0.98,
          duration: 50,
          yoyo: true
        });
      });

      this.shopContainer.add(btnBg);
      // Bring other text in front if needed, but container order matters.
      // Since we add bg last in loop, need to be careful.
      // Re-ordering logic: Add BG first, then text/icons on top.
      this.shopContainer.sendToBack(btnBg); // Ensure text is on top if added after? No, added sequentially.

      // We added BG first in this block, so text needs to be added AFTER bg.

      // Upgrade name
      const nameText = this.scene.add.text(-180, y - 8, upgrade.name.replace(/^[^\w\s]+/, ''), { // Strip emoji prefix if we use icons
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#ffffff',
        fontStyle: 'bold'
      });
      this.shopContainer.add(nameText);

      // Description
      const descText = this.scene.add.text(-180, y + 10, upgrade.description, {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#aaaaaa'
      });
      this.shopContainer.add(descText);

      // Cost Icon & Text
      const costIcon = this.scene.add.image(140, y, 'coin');
      costIcon.setDisplaySize(14, 14);
      this.shopContainer.add(costIcon);

      const costText = this.scene.add.text(160, y, `${upgrade.cost}`, {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#ffd700',
        fontStyle: 'bold'
      });
      costText.setOrigin(0, 0.5);
      this.shopContainer.add(costText);
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
