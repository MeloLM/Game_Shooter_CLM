/**
 * Sistema di gestione delle Wave (ondate) di nemici
 * 
 * Progressione:
 * - Wave 1-3: Solo Slime
 * - Wave 4-6: Slime + Fly
 * - Wave 7-10: Slime + Fly + Goblin
 * - Wave 11+: Tutti i nemici + Speed + Ranged
 * - Wave 15+: Tutti + Tank
 * - Boss ogni 10 wave
 */
export class WaveManager {
  scene;
  currentWave = 0;
  enemiesInWave = 0;
  enemiesKilledInWave = 0;
  waveActive = false;
  timeBetweenWaves = 5000; // 5 secondi tra una wave e l'altra
  baseEnemiesPerWave = 5;
  spawnDelay = 1500; // Delay base tra spawn
  waveText;
  waveAnnouncement;
  
  // Configurazione nemici per wave
  enemyConfigs = {
    slime: { minWave: 1, weight: 30 },
    fly: { minWave: 4, weight: 25 },
    goblin: { minWave: 7, weight: 20 },
    speed: { minWave: 11, weight: 15 },
    ranged: { minWave: 11, weight: 10 },
    tank: { minWave: 15, weight: 5 }
  };
  
  constructor(scene) {
    this.scene = scene;
    this.createWaveUI();
  }
  
  /**
   * Crea l'UI per mostrare la wave corrente
   */
  createWaveUI() {
    // Testo wave nell'HUD (angolo alto destro)
    this.waveText = this.scene.add.text(580, 25, '🌊 Wave 0', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#ffcc00',
      fontStyle: 'bold'
    });
    this.waveText.setOrigin(0.5, 0);
    this.waveText.setScrollFactor(0);
    this.waveText.setDepth(50);
    
    // Testo annuncio wave (centro schermo)
    this.waveAnnouncement = this.scene.add.text(320, 180, '', {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4
    });
    this.waveAnnouncement.setOrigin(0.5);
    this.waveAnnouncement.setScrollFactor(0);
    this.waveAnnouncement.setDepth(100);
    this.waveAnnouncement.setAlpha(0);
  }
  
  /**
   * Avvia il sistema di wave
   */
  start() {
    this.startNextWave();
  }
  
  /**
   * Inizia la prossima wave
   */
  startNextWave() {
    this.currentWave++;
    this.enemiesKilledInWave = 0;
    this.waveActive = true;
    
    // Calcola numero nemici (aumenta con le wave)
    this.enemiesInWave = this.baseEnemiesPerWave + Math.floor(this.currentWave * 1.5);
    
    // Mostra annuncio wave
    this.showWaveAnnouncement();
    
    // Aggiorna UI
    this.updateWaveUI();
    
    // Inizia spawn nemici
    this.startSpawning();
  }
  
  /**
   * Mostra l'annuncio della nuova wave
   */
  showWaveAnnouncement() {
    let text = `WAVE ${this.currentWave}`;
    let color = '#ffffff';
    
    // Wave speciali
    if (this.currentWave % 10 === 0) {
      text = `⚠️ BOSS WAVE ${this.currentWave} ⚠️`;
      color = '#ff0000';
    } else if (this.currentWave === 4) {
      text = `WAVE ${this.currentWave}\n🦟 New Enemy: Fly!`;
      color = '#00ffff';
    } else if (this.currentWave === 7) {
      text = `WAVE ${this.currentWave}\n👺 New Enemy: Goblin!`;
      color = '#00ff00';
    } else if (this.currentWave === 11) {
      text = `WAVE ${this.currentWave}\n⚡ New: Speed & Ranged!`;
      color = '#ff00ff';
    } else if (this.currentWave === 15) {
      text = `WAVE ${this.currentWave}\n🛡️ New Enemy: Tank!`;
      color = '#8B4513';
    }
    
    this.waveAnnouncement.setText(text);
    this.waveAnnouncement.setColor(color);
    
    // Animazione fade in/out
    this.scene.tweens.add({
      targets: this.waveAnnouncement,
      alpha: { from: 0, to: 1 },
      duration: 500,
      yoyo: true,
      hold: 1500,
      ease: 'Power2'
    });
  }
  
  /**
   * Aggiorna l'UI della wave
   */
  updateWaveUI() {
    if (this.waveText) {
      const remaining = this.enemiesInWave - this.enemiesKilledInWave;
      this.waveText.setText(`🌊 Wave ${this.currentWave} (${remaining})`);
    }
  }
  
  /**
   * Inizia lo spawn dei nemici per la wave corrente
   */
  startSpawning() {
    let spawned = 0;
    
    // Calcola delay spawn (diminuisce con le wave, minimo 500ms)
    const currentSpawnDelay = Math.max(500, this.spawnDelay - (this.currentWave * 50));
    
    const spawnEvent = this.scene.time.addEvent({
      delay: currentSpawnDelay,
      repeat: this.enemiesInWave - 1,
      callback: () => {
        if (!this.waveActive) {
          spawnEvent.remove();
          return;
        }
        
        this.spawnEnemy();
        spawned++;
      }
    });
  }
  
  /**
   * Spawna un singolo nemico basato sulla wave corrente
   */
  spawnEnemy() {
    if (!this.scene || !this.scene.enemies) return;
    
    // Trova posizione spawn fuori dalla camera
    let x, y;
    const side = Phaser.Math.Between(0, 3);
    
    switch(side) {
      case 0: // Top
        x = Phaser.Math.Between(0, 640);
        y = -20;
        break;
      case 1: // Right
        x = 660;
        y = Phaser.Math.Between(0, 360);
        break;
      case 2: // Bottom
        x = Phaser.Math.Between(0, 640);
        y = 380;
        break;
      case 3: // Left
        x = -20;
        y = Phaser.Math.Between(0, 360);
        break;
    }
    
    // Seleziona tipo nemico
    const enemyType = this.selectEnemyType();
    const enemy = this.createEnemy(enemyType, x, y);
    
    if (enemy) {
      this.scene.enemies.push(enemy);
    }
  }
  
  /**
   * Seleziona il tipo di nemico da spawnare basato su peso e wave
   */
  selectEnemyType() {
    const availableEnemies = [];
    let totalWeight = 0;
    
    for (const [type, config] of Object.entries(this.enemyConfigs)) {
      if (this.currentWave >= config.minWave) {
        availableEnemies.push({ type, weight: config.weight });
        totalWeight += config.weight;
      }
    }
    
    // Selezione pesata
    let random = Phaser.Math.Between(1, totalWeight);
    for (const enemy of availableEnemies) {
      random -= enemy.weight;
      if (random <= 0) {
        return enemy.type;
      }
    }
    
    return 'slime'; // Default
  }
  
  /**
   * Crea un nemico del tipo specificato
   */
  createEnemy(type, x, y) {
    const enemyCreators = this.scene.enemiesList;
    
    switch(type) {
      case 'slime':
        return enemyCreators[0](x, y);
      case 'goblin':
        return enemyCreators[1](x, y);
      case 'fly':
        return enemyCreators[2](x, y);
      case 'tank':
        if (enemyCreators[3]) return enemyCreators[3](x, y);
        return enemyCreators[1](x, y); // Fallback a goblin
      case 'speed':
        if (enemyCreators[4]) return enemyCreators[4](x, y);
        return enemyCreators[2](x, y); // Fallback a fly
      case 'ranged':
        if (enemyCreators[5]) return enemyCreators[5](x, y);
        return enemyCreators[1](x, y); // Fallback a goblin
      default:
        return enemyCreators[0](x, y);
    }
  }
  
  /**
   * Chiamato quando un nemico viene ucciso
   */
  onEnemyKilled() {
    if (!this.waveActive) return;
    
    this.enemiesKilledInWave++;
    this.updateWaveUI();
    
    // Controlla se la wave è completata
    if (this.enemiesKilledInWave >= this.enemiesInWave) {
      this.waveComplete();
    }
  }
  
  /**
   * Wave completata
   */
  waveComplete() {
    this.waveActive = false;
    
    // Mostra messaggio completamento
    const completeText = this.scene.add.text(320, 200, '✅ WAVE COMPLETE!', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#00ff00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    });
    completeText.setOrigin(0.5);
    completeText.setScrollFactor(0);
    completeText.setDepth(100);
    
    this.scene.tweens.add({
      targets: completeText,
      alpha: { from: 1, to: 0 },
      y: completeText.y - 30,
      duration: 2000,
      onComplete: () => completeText.destroy()
    });
    
    // Prossima wave dopo il delay
    this.scene.time.delayedCall(this.timeBetweenWaves, () => {
      this.startNextWave();
    });
  }
  
  /**
   * Ottieni statistiche della wave
   */
  getStats() {
    return {
      currentWave: this.currentWave,
      enemiesInWave: this.enemiesInWave,
      enemiesKilled: this.enemiesKilledInWave,
      enemiesRemaining: this.enemiesInWave - this.enemiesKilledInWave
    };
  }
}
