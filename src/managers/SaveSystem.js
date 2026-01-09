/**
 * SaveSystem - Gestione salvataggi e highscores
 * Utilizza localStorage per persistenza dati
 */

const STORAGE_KEYS = {
  HIGHSCORES: 'knightShooter_highscores',
  SETTINGS: 'knightShooter_settings',
  ACHIEVEMENTS: 'knightShooter_achievements',
  STATISTICS: 'knightShooter_statistics',
  UNLOCKABLES: 'knightShooter_unlockables'
};

const MAX_HIGHSCORES = 10;

class SaveSystem {
  constructor() {
    this.isAvailable = this.checkLocalStorage();
  }

  /**
   * Verifica disponibilità localStorage
   */
  checkLocalStorage() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('[SaveSystem] localStorage non disponibile:', e);
      return false;
    }
  }

  // === HIGHSCORES ===

  /**
   * Ottiene tutti gli highscores
   * @returns {Array} Lista highscores ordinata
   */
  getHighscores() {
    if (!this.isAvailable) return [];
    
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HIGHSCORES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('[SaveSystem] Errore lettura highscores:', e);
      return [];
    }
  }

  /**
   * Aggiunge un nuovo highscore
   * @param {Object} scoreData - { score, wave, enemiesKilled, survivalTime, date }
   * @returns {number} Posizione in classifica (1-based) o -1 se non in classifica
   */
  addHighscore(scoreData) {
    if (!this.isAvailable) return -1;
    
    const highscores = this.getHighscores();
    
    const entry = {
      score: scoreData.score || 0,
      wave: scoreData.wave || 1,
      enemiesKilled: scoreData.enemiesKilled || 0,
      survivalTime: scoreData.survivalTime || 0,
      date: scoreData.date || new Date().toISOString(),
      playerName: scoreData.playerName || 'Player'
    };
    
    // Aggiungi e ordina
    highscores.push(entry);
    highscores.sort((a, b) => b.score - a.score);
    
    // Trova posizione
    const position = highscores.findIndex(
      h => h.score === entry.score && h.date === entry.date
    ) + 1;
    
    // Mantieni solo i top MAX_HIGHSCORES
    const trimmed = highscores.slice(0, MAX_HIGHSCORES);
    
    try {
      localStorage.setItem(STORAGE_KEYS.HIGHSCORES, JSON.stringify(trimmed));
    } catch (e) {
      console.error('[SaveSystem] Errore salvataggio highscore:', e);
      return -1;
    }
    
    // Ritorna posizione solo se è in classifica
    return position <= MAX_HIGHSCORES ? position : -1;
  }

  /**
   * Verifica se un punteggio entrerebbe in classifica
   */
  isHighscore(score) {
    const highscores = this.getHighscores();
    if (highscores.length < MAX_HIGHSCORES) return true;
    return score > highscores[highscores.length - 1].score;
  }

  /**
   * Ottiene il miglior highscore
   */
  getBestScore() {
    const highscores = this.getHighscores();
    return highscores.length > 0 ? highscores[0].score : 0;
  }

  /**
   * Cancella tutti gli highscores
   */
  clearHighscores() {
    if (!this.isAvailable) return;
    localStorage.removeItem(STORAGE_KEYS.HIGHSCORES);
  }

  // === SETTINGS ===

  /**
   * Salva le impostazioni
   */
  saveSettings(settings) {
    if (!this.isAvailable) return false;
    
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (e) {
      console.error('[SaveSystem] Errore salvataggio settings:', e);
      return false;
    }
  }

  /**
   * Carica le impostazioni
   */
  loadSettings() {
    if (!this.isAvailable) return this.getDefaultSettings();
    
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...this.getDefaultSettings(), ...JSON.parse(data) } : this.getDefaultSettings();
    } catch (e) {
      console.error('[SaveSystem] Errore lettura settings:', e);
      return this.getDefaultSettings();
    }
  }

  /**
   * Impostazioni di default
   */
  getDefaultSettings() {
    return {
      musicVolume: 0.5,
      sfxVolume: 0.7,
      particles: true,
      screenShake: true,
      showDamageNumbers: true,
      showMinimap: true,
      mobileControls: 'auto'
    };
  }

  // === ACHIEVEMENTS ===

  /**
   * Salva achievement sbloccati
   */
  saveAchievements(achievementIds) {
    if (!this.isAvailable) return false;
    
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievementIds));
      return true;
    } catch (e) {
      console.error('[SaveSystem] Errore salvataggio achievements:', e);
      return false;
    }
  }

  /**
   * Carica achievement sbloccati
   */
  loadAchievements() {
    if (!this.isAvailable) return [];
    
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('[SaveSystem] Errore lettura achievements:', e);
      return [];
    }
  }

  // === STATISTICS ===

  /**
   * Aggiorna statistiche globali
   */
  updateStatistics(sessionStats) {
    if (!this.isAvailable) return;
    
    const stats = this.loadStatistics();
    
    // Accumula statistiche
    stats.totalGames = (stats.totalGames || 0) + 1;
    stats.totalKills = (stats.totalKills || 0) + (sessionStats.kills || 0);
    stats.totalScore = (stats.totalScore || 0) + (sessionStats.score || 0);
    stats.totalPlayTime = (stats.totalPlayTime || 0) + (sessionStats.playTime || 0);
    stats.totalPotionsCollected = (stats.totalPotionsCollected || 0) + (sessionStats.potions || 0);
    stats.highestWave = Math.max(stats.highestWave || 0, sessionStats.wave || 1);
    stats.highestCombo = Math.max(stats.highestCombo || 0, sessionStats.maxCombo || 0);
    
    // Kill counts per tipo
    if (!stats.killsByType) stats.killsByType = {};
    if (sessionStats.killsByType) {
      Object.entries(sessionStats.killsByType).forEach(([type, count]) => {
        stats.killsByType[type] = (stats.killsByType[type] || 0) + count;
      });
    }
    
    try {
      localStorage.setItem(STORAGE_KEYS.STATISTICS, JSON.stringify(stats));
    } catch (e) {
      console.error('[SaveSystem] Errore salvataggio statistics:', e);
    }
  }

  /**
   * Carica statistiche globali
   */
  loadStatistics() {
    if (!this.isAvailable) return {};
    
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATISTICS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('[SaveSystem] Errore lettura statistics:', e);
      return {};
    }
  }

  // === UNLOCKABLES ===

  /**
   * Salva unlockables (skins, armi, etc.)
   */
  saveUnlockables(unlockables) {
    if (!this.isAvailable) return false;
    
    try {
      localStorage.setItem(STORAGE_KEYS.UNLOCKABLES, JSON.stringify(unlockables));
      return true;
    } catch (e) {
      console.error('[SaveSystem] Errore salvataggio unlockables:', e);
      return false;
    }
  }

  /**
   * Carica unlockables
   */
  loadUnlockables() {
    if (!this.isAvailable) return { skins: ['default'], weapons: ['sword'] };
    
    try {
      const data = localStorage.getItem(STORAGE_KEYS.UNLOCKABLES);
      return data ? JSON.parse(data) : { skins: ['default'], weapons: ['sword'] };
    } catch (e) {
      console.error('[SaveSystem] Errore lettura unlockables:', e);
      return { skins: ['default'], weapons: ['sword'] };
    }
  }

  /**
   * Sblocca un nuovo elemento
   */
  unlock(category, itemId) {
    const unlockables = this.loadUnlockables();
    
    if (!unlockables[category]) {
      unlockables[category] = [];
    }
    
    if (!unlockables[category].includes(itemId)) {
      unlockables[category].push(itemId);
      this.saveUnlockables(unlockables);
      return true;
    }
    
    return false; // Già sbloccato
  }

  /**
   * Verifica se un elemento è sbloccato
   */
  isUnlocked(category, itemId) {
    const unlockables = this.loadUnlockables();
    return unlockables[category]?.includes(itemId) || false;
  }

  // === EXPORT/IMPORT ===

  /**
   * Esporta tutti i dati salvati
   */
  exportAllData() {
    return {
      highscores: this.getHighscores(),
      settings: this.loadSettings(),
      achievements: this.loadAchievements(),
      statistics: this.loadStatistics(),
      unlockables: this.loadUnlockables(),
      exportDate: new Date().toISOString()
    };
  }

  /**
   * Importa dati salvati
   */
  importAllData(data) {
    if (!this.isAvailable || !data) return false;
    
    try {
      if (data.highscores) {
        localStorage.setItem(STORAGE_KEYS.HIGHSCORES, JSON.stringify(data.highscores));
      }
      if (data.settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      }
      if (data.achievements) {
        localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(data.achievements));
      }
      if (data.statistics) {
        localStorage.setItem(STORAGE_KEYS.STATISTICS, JSON.stringify(data.statistics));
      }
      if (data.unlockables) {
        localStorage.setItem(STORAGE_KEYS.UNLOCKABLES, JSON.stringify(data.unlockables));
      }
      return true;
    } catch (e) {
      console.error('[SaveSystem] Errore import data:', e);
      return false;
    }
  }

  /**
   * Cancella tutti i dati salvati
   */
  clearAllData() {
    if (!this.isAvailable) return;
    
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

// Singleton
const saveSystem = new SaveSystem();
export default saveSystem;

export { STORAGE_KEYS, MAX_HIGHSCORES };
