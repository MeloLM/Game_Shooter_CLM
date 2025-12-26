/**
 * Sistema Mini-mappa
 * Mostra una mappa in scala ridotta con posizioni di player, nemici e pozioni
 */
export class Minimap {
  scene;
  container;
  mapWidth = 60;
  mapHeight = 35;
  mapX = 570;  // Angolo destro
  mapY = 120;  // Spostato più in basso per evitare overlap con combo
  scale;
  
  // Elementi grafici
  background;
  border;
  playerDot;
  enemyDots = [];
  bottleDots = [];
  
  // Ottimizzazione: aggiorna ogni N frame
  updateFrequency = 3;  // Aggiorna ogni 3 frame
  frameCounter = 0;
  
  constructor(scene, mapPixelWidth = 640, mapPixelHeight = 360) {
    this.scene = scene;
    this.scale = {
      x: this.mapWidth / mapPixelWidth,
      y: this.mapHeight / mapPixelHeight
    };
    
    this.createMinimap();
  }
  
  /**
   * Crea gli elementi della mini-mappa
   */
  createMinimap() {
    // Container per tutti gli elementi
    const depth = 60;
    
    // Sfondo nero semi-trasparente
    this.background = this.scene.add.rectangle(
      this.mapX + this.mapWidth / 2,
      this.mapY + this.mapHeight / 2,
      this.mapWidth + 4,
      this.mapHeight + 4,
      0x000000,
      0.6
    );
    this.background.setScrollFactor(0);
    this.background.setDepth(depth);
    
    // Bordo verde
    this.border = this.scene.add.rectangle(
      this.mapX + this.mapWidth / 2,
      this.mapY + this.mapHeight / 2,
      this.mapWidth + 4,
      this.mapHeight + 4
    );
    this.border.setStrokeStyle(1, 0x00ff00);
    this.border.setFillStyle();
    this.border.setScrollFactor(0);
    this.border.setDepth(depth + 1);
    
    // Dot del player (verde brillante)
    this.playerDot = this.scene.add.circle(0, 0, 3, 0x00ff00);
    this.playerDot.setScrollFactor(0);
    this.playerDot.setDepth(depth + 3);
    
    // Etichetta
    this.label = this.scene.add.text(this.mapX, this.mapY - 10, '📍 MAP', {
      fontFamily: 'Arial',
      fontSize: '8px',
      color: '#00ff00'
    });
    this.label.setScrollFactor(0);
    this.label.setDepth(depth);
  }
  
  /**
   * Converte coordinate mondo in coordinate mini-mappa
   */
  worldToMap(worldX, worldY) {
    return {
      x: this.mapX + (worldX * this.scale.x),
      y: this.mapY + (worldY * this.scale.y)
    };
  }
  
  /**
   * Aggiorna la mini-mappa (chiamare ogni frame)
   * Ottimizzato: aggiorna solo ogni N frame per performance
   */
  update() {
    if (!this.scene || !this.scene.player) return;
    
    // Ottimizzazione: salta frame per ridurre carico
    this.frameCounter++;
    if (this.frameCounter < this.updateFrequency) {
      return;
    }
    this.frameCounter = 0;
    
    // Aggiorna posizione player (sempre)
    const playerPos = this.worldToMap(this.scene.player.x, this.scene.player.y);
    this.playerDot.setPosition(playerPos.x, playerPos.y);
    
    // Aggiorna nemici
    this.updateEnemyDots();
    
    // Aggiorna pozioni
    this.updateBottleDots();
  }
  
  /**
   * Aggiorna i dot dei nemici
   */
  updateEnemyDots() {
    const enemies = this.scene.enemies || [];
    
    // Rimuovi dot in eccesso
    while (this.enemyDots.length > enemies.length) {
      const dot = this.enemyDots.pop();
      if (dot) dot.destroy();
    }
    
    // Aggiungi/aggiorna dot
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (!enemy || !enemy.active) continue;
      
      // Crea nuovo dot se necessario
      if (!this.enemyDots[i]) {
        this.enemyDots[i] = this.scene.add.circle(0, 0, 2, 0xff0000);
        this.enemyDots[i].setScrollFactor(0);
        this.enemyDots[i].setDepth(61);
      }
      
      // Aggiorna posizione
      const pos = this.worldToMap(enemy.x, enemy.y);
      this.enemyDots[i].setPosition(pos.x, pos.y);
      this.enemyDots[i].setVisible(true);
    }
  }
  
  /**
   * Aggiorna i dot delle pozioni
   */
  updateBottleDots() {
    const bottles = this.scene.bottles || [];
    
    // Rimuovi dot in eccesso
    while (this.bottleDots.length > bottles.length) {
      const dot = this.bottleDots.pop();
      if (dot) dot.destroy();
    }
    
    // Aggiungi/aggiorna dot
    for (let i = 0; i < bottles.length; i++) {
      const bottle = bottles[i];
      if (!bottle || !bottle.active) continue;
      
      // Crea nuovo dot se necessario
      if (!this.bottleDots[i]) {
        this.bottleDots[i] = this.scene.add.circle(0, 0, 2, 0x00ffff);
        this.bottleDots[i].setScrollFactor(0);
        this.bottleDots[i].setDepth(62);
      }
      
      // Aggiorna posizione
      const pos = this.worldToMap(bottle.x, bottle.y);
      this.bottleDots[i].setPosition(pos.x, pos.y);
      this.bottleDots[i].setVisible(true);
    }
  }
  
  /**
   * Mostra/nascondi mini-mappa
   */
  setVisible(visible) {
    this.background.setVisible(visible);
    this.border.setVisible(visible);
    this.playerDot.setVisible(visible);
    this.label.setVisible(visible);
    this.enemyDots.forEach(d => d && d.setVisible(visible));
    this.bottleDots.forEach(d => d && d.setVisible(visible));
  }
  
  /**
   * Distruggi la mini-mappa
   */
  destroy() {
    this.background.destroy();
    this.border.destroy();
    this.playerDot.destroy();
    this.label.destroy();
    this.enemyDots.forEach(d => d && d.destroy());
    this.bottleDots.forEach(d => d && d.destroy());
  }
}
