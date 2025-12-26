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
    const title = this.add.text(320, 25, '🏆 TROFEI 🏆', {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#ffd700',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
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
      const bg = this.add.rectangle(x, y, 135, 58, isUnlocked ? 0x2a5a2a : 0x2a2a3a);
      bg.setStrokeStyle(2, isUnlocked ? 0x4aaa4a : 0x444466);

      // Icona
      const icon = this.add.text(x - 55, y - 15, ach.icon, {
        fontSize: '20px'
      });
      icon.setAlpha(isUnlocked ? 1 : 0.4);

      // Nome
      const name = this.add.text(x - 25, y - 18, ach.name, {
        fontFamily: 'Arial',
        fontSize: '10px',
        color: isUnlocked ? '#ffffff' : '#666666',
        fontStyle: 'bold'
      });

      // Descrizione
      const desc = this.add.text(x - 25, y - 3, ach.description, {
        fontFamily: 'Arial',
        fontSize: '8px',
        color: isUnlocked ? '#aaaaaa' : '#444444'
      });

      // Reward XP
      const reward = this.add.text(x - 25, y + 12, `+${ach.xp} XP`, {
        fontFamily: 'Arial',
        fontSize: '8px',
        color: isUnlocked ? '#ffd700' : '#333333'
      });

      // Stato
      const status = this.add.text(x + 45, y + 12, isUnlocked ? '✓' : '✗', {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: isUnlocked ? '#00ff00' : '#ff0000'
      });
    });

    // Contatore totale
    const unlockedCount = unlocked.length;
    const counter = this.add.text(320, 330, `Sbloccati: ${unlockedCount}/${achievements.length}`, {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffd700',
      fontStyle: 'bold'
    });
    counter.setOrigin(0.5);

    // Bottone INDIETRO
    const backBtn = this.add.rectangle(320, 350, 120, 30, 0x4a4a8a);
    backBtn.setInteractive({ useHandCursor: true });
    
    const backText = this.add.text(320, 350, '← INDIETRO', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff'
    });
    backText.setOrigin(0.5);

    backBtn.on('pointerover', () => {
      backBtn.setFillStyle(0x6a6aaa);
    });
    backBtn.on('pointerout', () => {
      backBtn.setFillStyle(0x4a4a8a);
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
   * Ottieni lista achievement sbloccati
   */
  getUnlockedAchievements() {
    // Per ora ritorna array vuoto (i trofei si resettano ogni partita)
    // Se vuoi persistenza, usa localStorage
    return [];
  }

  /**
   * Lista completa degli achievement
   */
  getAchievementsList() {
    return [
      { id: 'kill_10', name: 'Primo Sangue', description: 'Uccidi 10 nemici', icon: '🗡️', xp: 50 },
      { id: 'kill_50', name: 'Cacciatore', description: 'Uccidi 50 nemici', icon: '⚔️', xp: 100 },
      { id: 'kill_100', name: 'Sterminatore', description: 'Uccidi 100 nemici', icon: '💀', xp: 200 },
      { id: 'kill_slime_25', name: 'Slime Hunter', description: 'Uccidi 25 Slime', icon: '🟢', xp: 75 },
      { id: 'survive_60', name: 'Sopravvissuto', description: 'Sopravvivi 1 minuto', icon: '⏱️', xp: 50 },
      { id: 'survive_180', name: 'Resistente', description: 'Sopravvivi 3 minuti', icon: '🛡️', xp: 150 },
      { id: 'survive_300', name: 'Leggenda', description: 'Sopravvivi 5 minuti', icon: '👑', xp: 300 },
      { id: 'wave_5', name: 'Onda dopo Onda', description: 'Raggiungi wave 5', icon: '🌊', xp: 100 },
      { id: 'wave_10', name: 'Veterano', description: 'Raggiungi wave 10', icon: '🏆', xp: 250 },
      { id: 'combo_5', name: 'Combo Iniziante', description: 'Ottieni combo 5', icon: '🔥', xp: 50 },
      { id: 'combo_10', name: 'Combo Master', description: 'Ottieni combo 10', icon: '💥', xp: 100 },
      { id: 'combo_25', name: 'Combo God', description: 'Ottieni combo 25', icon: '⚡', xp: 200 },
      { id: 'potions_10', name: 'Alchimista', description: 'Raccogli 10 pozioni', icon: '🧪', xp: 50 },
      { id: 'potions_50', name: 'Maestro Alchimista', description: 'Raccogli 50 pozioni', icon: '⚗️', xp: 150 },
      { id: 'level_5', name: 'Apprendista', description: 'Raggiungi livello 5', icon: '📈', xp: 100 },
      { id: 'level_10', name: 'Esperto', description: 'Raggiungi livello 10', icon: '⭐', xp: 250 },
    ];
  }
}
