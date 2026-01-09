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
    this.shopContainer.setDepth(200);
    this.shopContainer.setVisible(false);
    
    // Background overlay
    const bg = this.scene.add.rectangle(0, 0, 500, 320, 0x000000, 0.85);
    bg.setStrokeStyle(2, 0xffd700);
    this.shopContainer.add(bg);
    
    // Titolo
    const title = this.scene.add.text(0, -130, '🛒 SHOP', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#ffd700',
      fontStyle: 'bold'
    });
    title.setOrigin(0.5);
    this.shopContainer.add(title);
    
    // Coin display
    this.coinDisplay = this.scene.add.text(0, -100, `💰 ${this.coins}`, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffd700'
    });
    this.coinDisplay.setOrigin(0.5);
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
      
      // Button background
      const btnBg = this.scene.add.rectangle(-100, y, 380, 38, 0x1a1a2e, 0.9);
      btnBg.setStrokeStyle(1, 0x444488);
      btnBg.setInteractive();
      
      // Hover effects
      btnBg.on('pointerover', () => {
        btnBg.setFillStyle(0x2a2a4e);
      });
      btnBg.on('pointerout', () => {
        btnBg.setFillStyle(0x1a1a2e);
      });
      
      // Click handler
      btnBg.on('pointerdown', () => {
        this.purchaseUpgrade(upgrade);
      });
      
      this.shopContainer.add(btnBg);
      
      // Upgrade name
      const nameText = this.scene.add.text(-270, y - 8, upgrade.name, {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#ffffff',
        fontStyle: 'bold'
      });
      this.shopContainer.add(nameText);
      
      // Description
      const descText = this.scene.add.text(-270, y + 6, upgrade.description, {
        fontFamily: 'Arial',
        fontSize: '10px',
        color: '#aaaaaa'
      });
      this.shopContainer.add(descText);
      
      // Cost
      const costText = this.scene.add.text(60, y, `💰 ${upgrade.cost}`, {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#ffd700'
      });
      costText.setOrigin(0.5);
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
      this.coinDisplay.setText(`💰 ${this.coins}`);
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
