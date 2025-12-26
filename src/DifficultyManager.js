/**
 * Sistema Difficoltà Dinamica
 * Aumenta la sfida in base al tempo di gioco e alle performance del giocatore
 * 
 * Parametri che cambiano:
 * - Velocità nemici
 * - HP nemici
 * - Danno nemici
 * - Frequenza spawn
 * - Frequenza pozioni
 */
export class DifficultyManager {
  scene;
  baseDifficulty = 1;
  currentDifficulty = 1;
  maxDifficulty = 5;
  
  // Fattori che influenzano la difficoltà
  timeFactor = 0;       // Aumenta col tempo
  killFactor = 0;       // Aumenta con le uccisioni
  deathFactor = 0;      // Diminuisce quando il player muore (nelle partite successive)
  
  // Moltiplicatori per parametri nemici
  enemySpeedMultiplier = 1;
  enemyHPMultiplier = 1;
  enemyDamageMultiplier = 1;
  spawnRateMultiplier = 1;
  potionRateMultiplier = 1;
  
  // Timer per aggiornamento
  updateInterval = 10000; // Aggiorna ogni 10 secondi
  lastUpdateTime = 0;
  
  // UI
  difficultyText;
  
  constructor(scene) {
    this.scene = scene;
    this.loadPlayerHistory();
    this.createUI();
    this.calculateInitialDifficulty();
  }
  
  /**
   * Carica lo storico del giocatore per calibrare la difficoltà
   */
  loadPlayerHistory() {
    const history = localStorage.getItem('player_history');
    if (history) {
      const data = JSON.parse(history);
      // Se il giocatore ha giocato molto, aumenta la sfida base
      this.baseDifficulty = Math.min(1 + (data.gamesPlayed || 0) * 0.1, 2);
      // Se ha un high score alto, aumenta ancora
      if (data.highScore > 50) this.baseDifficulty += 0.2;
      if (data.highScore > 100) this.baseDifficulty += 0.3;
    }
  }
  
  /**
   * Salva lo storico del giocatore
   */
  savePlayerHistory(kills) {
    const history = localStorage.getItem('player_history');
    let data = history ? JSON.parse(history) : { gamesPlayed: 0, highScore: 0 };
    
    data.gamesPlayed++;
    if (kills > data.highScore) {
      data.highScore = kills;
    }
    
    localStorage.setItem('player_history', JSON.stringify(data));
  }
  
  /**
   * Calcola la difficoltà iniziale
   */
  calculateInitialDifficulty() {
    this.currentDifficulty = this.baseDifficulty;
    this.updateMultipliers();
  }
  
  /**
   * Crea l'indicatore di difficoltà nell'UI
   */
  createUI() {
    this.difficultyText = this.scene.add.text(10, 85, '', {
      fontFamily: 'Arial',
      fontSize: '10px',
      color: '#ff6600'
    });
    this.difficultyText.setScrollFactor(0);
    this.difficultyText.setDepth(50);
    this.updateUI();
  }
  
  /**
   * Aggiorna l'UI della difficoltà
   */
  updateUI() {
    const diffName = this.getDifficultyName();
    this.difficultyText.setText(`⚔️ ${diffName}`);
  }
  
  /**
   * Ottieni il nome della difficoltà
   */
  getDifficultyName() {
    if (this.currentDifficulty < 1.5) return 'Facile';
    if (this.currentDifficulty < 2.0) return 'Normale';
    if (this.currentDifficulty < 3.0) return 'Difficile';
    if (this.currentDifficulty < 4.0) return 'Molto Difficile';
    return 'Incubo';
  }
  
  /**
   * Aggiorna i moltiplicatori in base alla difficoltà corrente
   */
  updateMultipliers() {
    const d = this.currentDifficulty;
    
    // Velocità nemici: +10% per ogni livello di difficoltà
    this.enemySpeedMultiplier = 1 + (d - 1) * 0.1;
    
    // HP nemici: +15% per ogni livello
    this.enemyHPMultiplier = 1 + (d - 1) * 0.15;
    
    // Danno nemici: +10% per ogni livello
    this.enemyDamageMultiplier = 1 + (d - 1) * 0.1;
    
    // Spawn rate: diminuisce il delay (più nemici)
    this.spawnRateMultiplier = Math.max(0.5, 1 - (d - 1) * 0.08);
    
    // Pozioni: leggermente meno frequenti a difficoltà alta
    this.potionRateMultiplier = 1 + (d - 1) * 0.1;
  }
  
  /**
   * Aggiorna la difficoltà (chiamare periodicamente)
   * @param {number} elapsedTime - Tempo trascorso in secondi
   * @param {number} kills - Nemici uccisi
   */
  update(elapsedTime, kills) {
    const now = this.scene.time.now;
    
    // Aggiorna solo ogni intervallo
    if (now - this.lastUpdateTime < this.updateInterval) return;
    this.lastUpdateTime = now;
    
    // Calcola fattori
    this.timeFactor = Math.min(elapsedTime / 180, 1); // Max dopo 3 minuti
    this.killFactor = Math.min(kills / 100, 1); // Max dopo 100 kill
    
    // Calcola nuova difficoltà
    const newDifficulty = this.baseDifficulty + 
      (this.timeFactor * 1.5) + 
      (this.killFactor * 1.5);
    
    // Aumenta gradualmente
    this.currentDifficulty = Math.min(
      this.currentDifficulty + (newDifficulty - this.currentDifficulty) * 0.3,
      this.maxDifficulty
    );
    
    this.updateMultipliers();
    this.updateUI();
    
    // Notifica cambio difficoltà significativo
    if (Math.floor(this.currentDifficulty) > Math.floor(this.currentDifficulty - 0.3)) {
      this.showDifficultyIncrease();
    }
  }
  
  /**
   * Mostra notifica aumento difficoltà
   */
  showDifficultyIncrease() {
    const text = this.scene.add.text(320, 280, '⚠️ Difficoltà Aumentata!', {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#ff8800',
      fontStyle: 'bold'
    });
    text.setOrigin(0.5);
    text.setScrollFactor(0);
    text.setDepth(100);
    
    this.scene.tweens.add({
      targets: text,
      alpha: 0,
      y: text.y - 20,
      duration: 2000,
      onComplete: () => text.destroy()
    });
  }
  
  /**
   * Applica modificatori a un nuovo nemico
   */
  applyToEnemy(enemy) {
    if (!enemy) return;
    
    // Modifica stats in base alla difficoltà
    if (enemy.moveSpeed !== undefined) {
      enemy.moveSpeed *= this.enemySpeedMultiplier;
    }
    if (enemy.maxHP !== undefined) {
      enemy.maxHP = Math.floor(enemy.maxHP * this.enemyHPMultiplier);
      enemy.currentHP = enemy.maxHP;
    }
    if (enemy.enemyDmg !== undefined) {
      enemy.enemyDmg = Math.floor(enemy.enemyDmg * this.enemyDamageMultiplier);
    }
  }
  
  /**
   * Ottieni il delay di spawn modificato
   */
  getModifiedSpawnDelay(baseDelay) {
    return Math.floor(baseDelay * this.spawnRateMultiplier);
  }
  
  /**
   * Ottieni il delay pozioni modificato
   */
  getModifiedPotionDelay(baseDelay) {
    return Math.floor(baseDelay * this.potionRateMultiplier);
  }
  
  /**
   * Ottieni statistiche
   */
  getStats() {
    return {
      difficulty: this.currentDifficulty,
      name: this.getDifficultyName(),
      enemySpeed: `${Math.round(this.enemySpeedMultiplier * 100)}%`,
      enemyHP: `${Math.round(this.enemyHPMultiplier * 100)}%`,
      enemyDamage: `${Math.round(this.enemyDamageMultiplier * 100)}%`,
      spawnRate: `${Math.round((2 - this.spawnRateMultiplier) * 100)}%`
    };
  }
}
