/**
 * Sistema Achievement
 * Gestisce obiettivi e ricompense per le azioni del giocatore
 * I trofei si resettano ogni partita
 */
export class AchievementSystem {
  scene;
  achievements = [];
  unlockedAchievements = []; // Resettato ogni partita
  achievementQueue = []; // Coda per mostrare achievement
  isShowingAchievement = false;
  trophyText = null; // UI trofei durante il gioco
  
  constructor(scene) {
    this.scene = scene;
    // NON caricare da localStorage - resetta ogni partita
    this.unlockedAchievements = [];
    this.initAchievements();
    this.createTrophyUI();
  }
  
  /**
   * Crea l'UI dei trofei visibile durante il gameplay
   */
  createTrophyUI() {
    // Container per trofei con progressi
    this.trophyContainer = this.scene.add.container(10, 70);
    this.trophyContainer.setScrollFactor(0);
    this.trophyContainer.setDepth(50);
    
    // Testo principale trofei
    this.trophyText = this.scene.add.text(0, 0, '🏆 0/16', {
      fontFamily: 'Arial',
      fontSize: '10px',
      color: '#ffd700'
    });
    this.trophyContainer.add(this.trophyText);
    
    // Prossimo trofeo (progress)
    this.nextTrophyText = this.scene.add.text(0, 12, '', {
      fontFamily: 'Arial',
      fontSize: '8px',
      color: '#aaaaaa'
    });
    this.trophyContainer.add(this.nextTrophyText);
  }
  
  /**
   * Aggiorna l'UI dei trofei con progressi
   */
  updateTrophyUI() {
    if (this.trophyText) {
      const unlocked = this.getUnlockedCount();
      const total = this.getTotalCount();
      this.trophyText.setText(`🏆 ${unlocked}/${total}`);
    }
    
    // Mostra progresso verso prossimo trofeo
    if (this.nextTrophyText) {
      const nextAch = this.getNextAchievementProgress();
      if (nextAch) {
        this.nextTrophyText.setText(`${nextAch.icon} ${nextAch.progress}`);
      } else {
        this.nextTrophyText.setText('');
      }
    }
  }
  
  /**
   * Ottieni progresso verso il prossimo achievement non sbloccato
   */
  getNextAchievementProgress() {
    const stats = AchievementSystem.getStatsFromScene(this.scene);
    
    // Cerca primo achievement non sbloccato e mostra progresso
    for (const ach of this.achievements) {
      if (!this.isUnlocked(ach.id)) {
        let progress = '';
        
        if (ach.id.startsWith('kill_') && !ach.id.includes('slime')) {
          const target = parseInt(ach.id.split('_')[1]);
          progress = `${stats.totalKills}/${target}`;
        } else if (ach.id === 'kill_slime_25') {
          progress = `${stats.slimeKills}/25`;
        } else if (ach.id.startsWith('survive_')) {
          const target = parseInt(ach.id.split('_')[1]);
          progress = `${Math.floor(stats.survivalTime)}/${target}s`;
        } else if (ach.id.startsWith('wave_')) {
          const target = parseInt(ach.id.split('_')[1]);
          progress = `${stats.waveReached}/${target}`;
        } else if (ach.id.startsWith('combo_')) {
          const target = parseInt(ach.id.split('_')[1]);
          progress = `${stats.maxCombo}/${target}`;
        } else if (ach.id.startsWith('potions_')) {
          const target = parseInt(ach.id.split('_')[1]);
          progress = `${stats.potionsCollected}/${target}`;
        } else if (ach.id.startsWith('level_')) {
          const target = parseInt(ach.id.split('_')[1]);
          progress = `Lv ${stats.playerLevel}/${target}`;
        }
        
        return { icon: ach.icon, name: ach.name, progress };
      }
    }
    return null;
  }
  
  /**
   * Inizializza tutti gli achievement disponibili
   */
  initAchievements() {
    this.achievements = [
      // Kill achievements
      {
        id: 'kill_10',
        name: 'Primo Sangue',
        description: 'Uccidi 10 nemici',
        icon: '🗡️',
        condition: (stats) => stats.totalKills >= 10,
        reward: { xp: 50 }
      },
      {
        id: 'kill_50',
        name: 'Cacciatore',
        description: 'Uccidi 50 nemici',
        icon: '⚔️',
        condition: (stats) => stats.totalKills >= 50,
        reward: { xp: 100 }
      },
      {
        id: 'kill_100',
        name: 'Sterminatore',
        description: 'Uccidi 100 nemici',
        icon: '💀',
        condition: (stats) => stats.totalKills >= 100,
        reward: { xp: 200 }
      },
      {
        id: 'kill_slime_25',
        name: 'Slime Hunter',
        description: 'Uccidi 25 Slime',
        icon: '🟢',
        condition: (stats) => stats.slimeKills >= 25,
        reward: { xp: 75 }
      },
      
      // Survival achievements
      {
        id: 'survive_60',
        name: 'Sopravvissuto',
        description: 'Sopravvivi 1 minuto',
        icon: '⏱️',
        condition: (stats) => stats.survivalTime >= 60,
        reward: { xp: 50 }
      },
      {
        id: 'survive_180',
        name: 'Resistente',
        description: 'Sopravvivi 3 minuti',
        icon: '🛡️',
        condition: (stats) => stats.survivalTime >= 180,
        reward: { xp: 150 }
      },
      {
        id: 'survive_300',
        name: 'Leggenda',
        description: 'Sopravvivi 5 minuti',
        icon: '👑',
        condition: (stats) => stats.survivalTime >= 300,
        reward: { xp: 300 }
      },
      
      // Wave achievements
      {
        id: 'wave_5',
        name: 'Onda dopo Onda',
        description: 'Raggiungi wave 5',
        icon: '🌊',
        condition: (stats) => stats.waveReached >= 5,
        reward: { xp: 100 }
      },
      {
        id: 'wave_10',
        name: 'Veterano',
        description: 'Raggiungi wave 10',
        icon: '🏆',
        condition: (stats) => stats.waveReached >= 10,
        reward: { xp: 250 }
      },
      
      // Combo achievements
      {
        id: 'combo_5',
        name: 'Combo Iniziante',
        description: 'Ottieni un combo di 5',
        icon: '🔥',
        condition: (stats) => stats.maxCombo >= 5,
        reward: { xp: 50 }
      },
      {
        id: 'combo_10',
        name: 'Combo Master',
        description: 'Ottieni un combo di 10',
        icon: '💥',
        condition: (stats) => stats.maxCombo >= 10,
        reward: { xp: 100 }
      },
      {
        id: 'combo_25',
        name: 'Combo God',
        description: 'Ottieni un combo di 25',
        icon: '⚡',
        condition: (stats) => stats.maxCombo >= 25,
        reward: { xp: 200 }
      },
      
      // Potion achievements
      {
        id: 'potions_10',
        name: 'Alchimista',
        description: 'Raccogli 10 pozioni',
        icon: '🧪',
        condition: (stats) => stats.potionsCollected >= 10,
        reward: { xp: 50 }
      },
      {
        id: 'potions_50',
        name: 'Maestro Alchimista',
        description: 'Raccogli 50 pozioni',
        icon: '⚗️',
        condition: (stats) => stats.potionsCollected >= 50,
        reward: { xp: 150 }
      },
      
      // Level achievements
      {
        id: 'level_5',
        name: 'Apprendista',
        description: 'Raggiungi livello 5',
        icon: '📈',
        condition: (stats) => stats.playerLevel >= 5,
        reward: { xp: 100 }
      },
      {
        id: 'level_10',
        name: 'Esperto',
        description: 'Raggiungi livello 10',
        icon: '⭐',
        condition: (stats) => stats.playerLevel >= 10,
        reward: { xp: 250 }
      },
    ];
  }
  
  /**
   * NON usato - i trofei si resettano ogni partita
   */
  loadUnlocked() {
    // Disabilitato - reset ogni partita
  }
  
  /**
   * NON usato - i trofei si resettano ogni partita
   */
  saveUnlocked() {
    // Disabilitato - reset ogni partita
  }
  
  /**
   * Controlla se un achievement è già sbloccato
   */
  isUnlocked(achievementId) {
    return this.unlockedAchievements.includes(achievementId);
  }
  
  /**
   * Controlla tutti gli achievement con le stats correnti
   * @param {object} stats - Statistiche di gioco
   */
  checkAchievements(stats) {
    for (const achievement of this.achievements) {
      if (!this.isUnlocked(achievement.id) && achievement.condition(stats)) {
        this.unlockAchievement(achievement);
      }
    }
  }
  
  /**
   * Sblocca un achievement
   */
  unlockAchievement(achievement) {
    if (this.isUnlocked(achievement.id)) return;
    
    this.unlockedAchievements.push(achievement.id);
    
    // Aggiorna UI trofei (propria)
    this.updateTrophyUI();
    
    // Aggiungi alla coda di visualizzazione
    this.achievementQueue.push(achievement);
    this.processQueue();
    
    // Dai reward
    if (achievement.reward && achievement.reward.xp && this.scene.player) {
      this.scene.player.addXP(achievement.reward.xp);
    }
    
    console.log(`🏆 Achievement Unlocked: ${achievement.name}`);
  }
  
  /**
   * Processa la coda di achievement da mostrare
   */
  processQueue() {
    if (this.isShowingAchievement || this.achievementQueue.length === 0) return;
    
    this.isShowingAchievement = true;
    const achievement = this.achievementQueue.shift();
    this.showAchievementPopup(achievement);
  }
  
  /**
   * Mostra popup achievement - versione discreta in basso a destra
   */
  showAchievementPopup(achievement) {
    // Posizione: angolo in basso a destra, più discreto
    const x = 560;
    const y = 310;
    
    // Container sfondo più piccolo con trasparenza aumentata
    const bg = this.scene.add.rectangle(x, y, 150, 35, 0x000000, 0.5);
    bg.setStrokeStyle(1, 0xffd700, 0.7);
    bg.setScrollFactor(0);
    bg.setDepth(200);
    bg.setAlpha(0);
    
    // Testo combinato icona + nome (più compatto)
    const title = this.scene.add.text(x, y - 5, `${achievement.icon} ${achievement.name}`, {
      fontFamily: 'Arial',
      fontSize: '10px',
      color: '#ffd700',
      fontStyle: 'bold'
    });
    title.setOrigin(0.5);
    title.setScrollFactor(0);
    title.setDepth(201);
    title.setAlpha(0);
    
    // Descrizione più piccola
    const desc = this.scene.add.text(x, y + 8, achievement.description, {
      fontFamily: 'Arial',
      fontSize: '8px',
      color: '#cccccc'
    });
    desc.setOrigin(0.5);
    desc.setScrollFactor(0);
    desc.setDepth(201);
    desc.setAlpha(0);
    
    // Animazione entrata più veloce da destra
    bg.x = x + 50;
    title.x = x + 50;
    desc.x = x + 50;
    
    this.scene.tweens.add({
      targets: [bg, title, desc],
      alpha: { value: 0.85, duration: 300 }, // Fade in con trasparenza finale
      x: x,
      duration: 300,
      ease: 'Power2'
    });
    
    // Animazione uscita dopo 2 secondi (più veloce)
    this.scene.time.delayedCall(2000, () => {
      this.scene.tweens.add({
        targets: [bg, title, desc],
        alpha: 0,
        x: x + 50,
        duration: 200,
        onComplete: () => {
          bg.destroy();
          title.destroy();
          desc.destroy();
          
          this.isShowingAchievement = false;
          this.processQueue();
        }
      });
    });
  }
  
  /**
   * Ottieni statistiche per il check achievement
   */
  static getStatsFromScene(scene) {
    return {
      totalKills: scene.enemyCounter || 0,
      slimeKills: scene.slimeKills || 0, // Da implementare nel tracking
      survivalTime: scene.time ? (scene.time.now - scene.startTime) / 1000 : 0,
      waveReached: scene.waveManager ? scene.waveManager.currentWave : 0,
      maxCombo: scene.comboSystem ? scene.comboSystem.maxCombo : 0,
      potionsCollected: scene.potionsCollected || 0, // Da implementare nel tracking
      playerLevel: scene.player ? scene.player.level : 1
    };
  }
  
  /**
   * Ottieni lista achievement con stato
   */
  getAchievementsList() {
    return this.achievements.map(a => ({
      ...a,
      unlocked: this.isUnlocked(a.id)
    }));
  }
  
  /**
   * Conta achievement sbloccati
   */
  getUnlockedCount() {
    return this.unlockedAchievements.length;
  }
  
  /**
   * Conta totale achievement
   */
  getTotalCount() {
    return this.achievements.length;
  }
}
