/**
 * MobileControls - Controlli touch per dispositivi mobile
 * 
 * Mostra frecce direzionali e bottone attacco touch-friendly
 */
export class MobileControls {
  scene;
  player;
  enabled = false;
  
  // Elementi UI
  container;
  upBtn;
  downBtn;
  leftBtn;
  rightBtn;
  attackBtn;
  
  // Stato input
  moveDirection = { x: 0, y: 0 };
  isAttacking = false;
  
  // Configurazione
  btnSize = 40;
  btnAlpha = 0.6;
  btnColor = 0x4a4a8a;
  btnColorActive = 0x8a8aff;
  
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    
    // Controlla se mobile o se forzato da settings
    const settings = this.loadSettings();
    this.enabled = settings.mobileControls || this.isMobileDevice();
    
    if (this.enabled) {
      this.createControls();
    }
  }
  
  /**
   * Rileva se è un dispositivo mobile
   */
  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 800 && 'ontouchstart' in window);
  }
  
  /**
   * Carica settings da localStorage
   */
  loadSettings() {
    const saved = localStorage.getItem('knightShooter_settings');
    return saved ? JSON.parse(saved) : { mobileControls: false, volume: 0.3 };
  }
  
  /**
   * Crea i controlli touch
   */
  createControls() {
    const depth = 200;
    
    // Container per D-pad (sinistra)
    const dpadX = 70;
    const dpadY = this.scene.scale.height - 80;
    
    // Sfondo D-pad (cerchio semi-trasparente)
    const dpadBg = this.scene.add.circle(dpadX, dpadY, 55, 0x000000, 0.3);
    dpadBg.setScrollFactor(0);
    dpadBg.setDepth(depth);
    
    // Freccia SU
    this.upBtn = this.createArrowButton(dpadX, dpadY - 35, '▲', 'up');
    
    // Freccia GIÙ
    this.downBtn = this.createArrowButton(dpadX, dpadY + 35, '▼', 'down');
    
    // Freccia SINISTRA
    this.leftBtn = this.createArrowButton(dpadX - 35, dpadY, '◀', 'left');
    
    // Freccia DESTRA
    this.rightBtn = this.createArrowButton(dpadX + 35, dpadY, '▶', 'right');
    
    // Bottone ATTACCO (destra)
    const attackX = this.scene.scale.width - 70;
    const attackY = this.scene.scale.height - 80;
    
    const attackBg = this.scene.add.circle(attackX, attackY, 45, this.btnColor, this.btnAlpha);
    attackBg.setScrollFactor(0);
    attackBg.setDepth(depth);
    attackBg.setInteractive();
    
    const attackText = this.scene.add.text(attackX, attackY, '⚔️', {
      fontSize: '28px'
    });
    attackText.setOrigin(0.5);
    attackText.setScrollFactor(0);
    attackText.setDepth(depth + 1);
    
    this.attackBtn = { bg: attackBg, text: attackText };
    
    // Eventi touch per attacco
    attackBg.on('pointerdown', () => {
      this.isAttacking = true;
      attackBg.setFillStyle(this.btnColorActive, 0.8);
      // Trigger attacco
      if (this.player && this.player.attack) {
        this.player.attack();
      }
    });
    
    attackBg.on('pointerup', () => {
      this.isAttacking = false;
      attackBg.setFillStyle(this.btnColor, this.btnAlpha);
    });
    
    attackBg.on('pointerout', () => {
      this.isAttacking = false;
      attackBg.setFillStyle(this.btnColor, this.btnAlpha);
    });
  }
  
  /**
   * Crea un bottone freccia direzionale
   */
  createArrowButton(x, y, symbol, direction) {
    const depth = 200;
    
    const bg = this.scene.add.circle(x, y, this.btnSize / 2, this.btnColor, this.btnAlpha);
    bg.setScrollFactor(0);
    bg.setDepth(depth);
    bg.setInteractive();
    
    const text = this.scene.add.text(x, y, symbol, {
      fontSize: '20px',
      color: '#ffffff'
    });
    text.setOrigin(0.5);
    text.setScrollFactor(0);
    text.setDepth(depth + 1);
    
    // Eventi touch
    bg.on('pointerdown', () => {
      bg.setFillStyle(this.btnColorActive, 0.8);
      this.setDirection(direction, true);
    });
    
    bg.on('pointerup', () => {
      bg.setFillStyle(this.btnColor, this.btnAlpha);
      this.setDirection(direction, false);
    });
    
    bg.on('pointerout', () => {
      bg.setFillStyle(this.btnColor, this.btnAlpha);
      this.setDirection(direction, false);
    });
    
    return { bg, text };
  }
  
  /**
   * Imposta direzione movimento
   */
  setDirection(direction, active) {
    switch(direction) {
      case 'up':
        this.moveDirection.y = active ? -1 : 0;
        break;
      case 'down':
        this.moveDirection.y = active ? 1 : 0;
        break;
      case 'left':
        this.moveDirection.x = active ? -1 : 0;
        break;
      case 'right':
        this.moveDirection.x = active ? 1 : 0;
        break;
    }
  }
  
  /**
   * Ottieni direzione movimento corrente
   */
  getMovement() {
    if (!this.enabled) return { x: 0, y: 0 };
    return this.moveDirection;
  }
  
  /**
   * Controlla se sta attaccando
   */
  getAttacking() {
    return this.isAttacking;
  }
  
  /**
   * Abilita/disabilita controlli
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    
    if (enabled && !this.upBtn) {
      this.createControls();
    } else if (!enabled && this.upBtn) {
      this.destroy();
    }
  }
  
  /**
   * Mostra/nascondi controlli
   */
  setVisible(visible) {
    if (!this.upBtn) return;
    
    const alpha = visible ? this.btnAlpha : 0;
    [this.upBtn, this.downBtn, this.leftBtn, this.rightBtn].forEach(btn => {
      if (btn) {
        btn.bg.setAlpha(alpha);
        btn.text.setAlpha(visible ? 1 : 0);
      }
    });
    
    if (this.attackBtn) {
      this.attackBtn.bg.setAlpha(alpha);
      this.attackBtn.text.setAlpha(visible ? 1 : 0);
    }
  }
  
  /**
   * Distrugge i controlli
   */
  destroy() {
    [this.upBtn, this.downBtn, this.leftBtn, this.rightBtn].forEach(btn => {
      if (btn) {
        btn.bg.destroy();
        btn.text.destroy();
      }
    });
    
    if (this.attackBtn) {
      this.attackBtn.bg.destroy();
      this.attackBtn.text.destroy();
    }
    
    this.upBtn = null;
    this.downBtn = null;
    this.leftBtn = null;
    this.rightBtn = null;
    this.attackBtn = null;
  }
}
