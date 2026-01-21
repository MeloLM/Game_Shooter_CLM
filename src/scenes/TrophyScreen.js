import { Scene } from "phaser";

/**
 * TrophyScreen - Schermata dedicata ai trofei
 * Mostra tutti i 16 achievement con stato e progressi
 */
export class TrophyScreen extends Scene {
  constructor() {
    super({ key: 'TrophyScreen' });
  }

  init(data) {
    // Dati passati dalla scena precedente (se presenti)
    this.lastStats = data.stats || null;
    this.fromScene = data.from || 'MainMenu';
  }

  create() {
    // Sfondo scuro
    this.add.rectangle(320, 180, 640, 360, 0x1a1a2e);

    // Titolo
    const title = this.add.text(320, 25, 'TROPHIES', {
      fontFamily: 'Verdana, sans-serif',
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    title.setOrigin(0.5);

    // Lista achievement
    const achievements = this.getAchievementsList();

    // Carica achievement sbloccati dalla sessione corrente o localStorage
    const unlocked = this.getUnlockedAchievements();

    // Griglia 4x4
    const startX = 85;
    const startY = 65;
    const cols = 4;
    const cellW = 145;
    const cellH = 65;

    achievements.forEach((ach, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * cellW;
      const y = startY + row * cellH;
      const isUnlocked = unlocked.includes(ach.id);

      // Sfondo achievement
      const bg = this.add.rectangle(x, y, 135, 58, isUnlocked ? 0x2a4a2a : 0x222233);
      bg.setStrokeStyle(2, isUnlocked ? 0x4a8a4a : 0x333344);

      // Icona
      const icon = this.add.text(x - 55, y - 15, ach.icon, {
        fontSize: '18px'
      });
      icon.setAlpha(isUnlocked ? 1 : 0.3);

      // Nome
      const name = this.add.text(x - 25, y - 18, ach.name, {
        fontFamily: 'Verdana',
        fontSize: '9px',
        color: isUnlocked ? '#ffffff' : '#555555',
        fontStyle: 'bold'
      });

      // Descrizione
      const desc = this.add.text(x - 25, y - 3, ach.description, {
        fontFamily: 'Verdana',
        fontSize: '7px',
        color: isUnlocked ? '#999999' : '#333333'
      });

      // Reward XP
      const reward = this.add.text(x - 25, y + 12, `+${ach.xp} XP`, {
        fontFamily: 'Verdana',
        fontSize: '7px',
        color: isUnlocked ? '#ffd700' : '#222222'
      });

      // Stato
      const status = this.add.text(x + 45, y + 12, isUnlocked ? '✓' : '✗', {
        fontFamily: 'Verdana',
        fontSize: '12px',
        color: isUnlocked ? '#44ff44' : '#ff4444'
      });
    });

    // Contatore totale
    const unlockedCount = unlocked.length;
    const counter = this.add.text(320, 330, `Unlocked: ${unlockedCount}/${achievements.length}`, {
      fontFamily: 'Verdana',
      fontSize: '14px',
      color: '#ffd700',
      fontStyle: 'bold'
    });
    counter.setOrigin(0.5);

    // Bottone INDIETRO (Minimalista)
    const backBtn = this.add.rectangle(320, 352, 120, 30, 0xffffff);
    backBtn.setStrokeStyle(2, 0x333333);
    backBtn.setInteractive({ useHandCursor: true });

    const backText = this.add.text(320, 352, 'BACK', {
      fontFamily: 'Verdana',
      fontSize: '14px',
      color: '#111111',
      fontStyle: 'bold'
    });
    backText.setOrigin(0.5);

    backBtn.on('pointerover', () => {
      backBtn.setFillStyle(0xdddddd);
    });
    backBtn.on('pointerout', () => {
      backBtn.setFillStyle(0xffffff);
    });
    backBtn.on('pointerdown', () => {
      this.scene.start(this.fromScene);
    });

    // Input ESC per tornare indietro
    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start(this.fromScene);
    });
  }

  /**
   * Ottieni lista achievement sbloccati da localStorage
   */
  getUnlockedAchievements() {
    const saved = localStorage.getItem('achievements_unlocked');
    return saved ? JSON.parse(saved) : [];
  }

  /**
   * Lista completa degli achievement
   */
  getAchievementsList() {
    return [
      { id: 'kill_10', name: 'First Blood', description: 'Kill 10 enemies', icon: '🗡️', xp: 50 },
      { id: 'kill_50', name: 'Hunter', description: 'Kill 50 enemies', icon: '⚔️', xp: 100 },
      { id: 'kill_100', name: 'Exterminator', description: 'Kill 100 enemies', icon: '💀', xp: 200 },
      { id: 'kill_slime_25', name: 'Slime Hunter', description: 'Kill 25 Slimes', icon: '🟢', xp: 75 },
      { id: 'survive_60', name: 'Survivor', description: 'Survive 1 minute', icon: '⏱️', xp: 50 },
      { id: 'survive_180', name: 'Endurance', description: 'Survive 3 minutes', icon: '🛡️', xp: 150 },
      { id: 'survive_300', name: 'Legend', description: 'Survive 5 minutes', icon: '👑', xp: 300 },
      { id: 'wave_5', name: 'Wave Rider', description: 'Reach wave 5', icon: '🌊', xp: 100 },
      { id: 'wave_10', name: 'Veteran', description: 'Reach wave 10', icon: '🏆', xp: 250 },
      { id: 'combo_5', name: 'Combo Starter', description: 'Get combo 5', icon: '🔥', xp: 50 },
      { id: 'combo_10', name: 'Combo Master', description: 'Get combo 10', icon: '💥', xp: 100 },
      { id: 'combo_25', name: 'Combo God', description: 'Get combo 25', icon: '⚡', xp: 200 },
      { id: 'potions_10', name: 'Alchemist', description: 'Collect 10 potions', icon: '🧪', xp: 50 },
      { id: 'potions_50', name: 'Master Alchemist', description: 'Collect 50 potions', icon: '⚗️', xp: 150 },
      { id: 'level_5', name: 'Apprentice', description: 'Reach level 5', icon: '📈', xp: 100 },
      { id: 'level_10', name: 'Expert', description: 'Reach level 10', icon: '⭐', xp: 250 },
    ];
  }
}
