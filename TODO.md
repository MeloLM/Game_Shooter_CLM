# 📋 TODO LIST - Knight Shooter

*Aggiornato: 26 Dicembre 2025*  
*Versione: 1.6.1*

---

## 🔴 **CRITICI - DA FARE SUBITO**

### 1. **Fix Audio nel GameOver**
- [ ] **Problema**: GameOver avvia `playMenuBGM()` direttamente nel `create()`
- [ ] **Soluzione**: Applicare stesso fix del MainMenu (audio al primo click)
- [ ] **File**: `src/GameOver.js` linea 23
- [ ] **Priorità**: 🔥 ALTA

### 2. **Rimuovere console.log rimanenti**
- [ ] **File**: `src/AudioManager.js` linee 28 e 59
- [ ] **Problema**: Console.log ancora presenti in produzione
- [ ] **Priorità**: 🟡 MEDIA

---

## 🟡 **MIGLIORAMENTI UX/UI**

### 3. **Mobile Controls**
- [ ] Aggiungere joystick virtuale per mobile
- [ ] Bottone sparo touch per mobile
- [ ] Test touch responsiveness
- [ ] **File da creare**: `src/MobileControls.js`
- [ ] **Priorità**: 🟡 MEDIA

### 4. **Settings Menu**
- [ ] Creare schermata Settings accessibile dal MainMenu
- [ ] Slider volume BGM (separato da SFX)
- [ ] Slider volume SFX
- [ ] Toggle fullscreen
- [ ] Reset progress (cancella localStorage)
- [ ] **File da creare**: `src/Settings.js`
- [ ] **Priorità**: 🟢 BASSA

### 5. **Tutorial/Help Screen**
- [ ] Spiegare power-ups e pozioni
- [ ] Mostrare controlli dettagliati
- [ ] Tips per strategie di gioco
- [ ] Accessibile dal MainMenu
- [ ] **File da creare**: `src/Tutorial.js`
- [ ] **Priorità**: 🟢 BASSA

### 6. **Miglioramenti Visual Effects**
- [ ] Particelle esplosioni nemici più elaborate
- [ ] Screen shake quando player prende danno
- [ ] Flash effetto quando si sale di livello
- [ ] Trail arma laser più cool
- [ ] **File**: `src/VisualEffects.js`
- [ ] **Priorità**: 🟢 BASSA

---

## ⚡ **GAMEPLAY - NUOVE FEATURE**

### 7. **Sistema Potenziamenti Permanenti**
- [ ] Shop con coins collezionate in-game
- [ ] Upgrade permanenti: +HP max, +damage, +speed base
- [ ] Unlock armi alternative
- [ ] **File da creare**: `src/UpgradeShop.js`
- [ ] **Priorità**: 🟡 MEDIA

### 8. **Boss Waves Migliorati**
- [ ] Aggiungere 2-3 nuovi boss
- [ ] Pattern di attacco più complessi
- [ ] Fase 2 per boss esistenti (quando HP < 30%)
- [ ] Boss drops speciali (power-up rari)
- [ ] **File**: `src/Enemies/Bosses/`
- [ ] **Priorità**: 🟡 MEDIA

### 9. **Nuove Armi**
- [ ] Arco con frecce penetranti
- [ ] Granate ad area
- [ ] Scudo riflettente proiettili
- [ ] Spada vorticosa (danni ad area)
- [ ] **File da creare**: `src/Scene/Arrow.js`, `src/Scene/Grenade.js`, etc.
- [ ] **Priorità**: 🟢 BASSA

### 10. **Modalità Survival Endless**
- [ ] Wave infinite con difficoltà crescente infinita
- [ ] Classifica globale (se server)
- [ ] Power-up più rari e potenti
- [ ] **File da modificare**: `src/WaveManager.js`
- [ ] **Priorità**: 🟢 BASSA

---

## 🎨 **ASSET E GRAFICA**

### 11. **Sprite Animazioni Mancanti**
- [ ] Animazione player death (ora è istantanea)
- [ ] Animazioni idle per tutti i boss
- [ ] Particelle per power-up collection
- [ ] **Folder**: `public/assets/player/`
- [ ] **Priorità**: 🟡 MEDIA

### 12. **Background Parallax**
- [ ] Layer multipli per profondità
- [ ] Scrolling automatico lento
- [ ] Sky con nuvole/stelle
- [ ] **File da creare**: `src/Background.js`
- [ ] **Priorità**: 🟢 BASSA

### 13. **SFX Audio**
- [ ] Suono hit enemy
- [ ] Suono player hit
- [ ] Suono potion pickup
- [ ] Suono level up
- [ ] Suono achievement unlock
- [ ] **Folder**: `public/assets/audio/sfx/`
- [ ] **Priorità**: 🟡 MEDIA

---

## 🔧 **OTTIMIZZAZIONI PERFORMANCE**

### 14. **Object Pooling per Nemici**
- [ ] Ricicla nemici invece di distruggerli
- [ ] Pool per proiettili
- [ ] Pool per particelle
- [ ] **File da creare**: `src/ObjectPool.js`
- [ ] **Priorità**: 🟡 MEDIA

### 15. **Ridurre Garbage Collection**
- [ ] Evitare creazione oggetti temporanei in update()
- [ ] Reuse vettori per calcoli
- [ ] Cache riferimenti frequenti
- [ ] **File**: Tutti i file con loop update
- [ ] **Priorità**: 🟢 BASSA

### 16. **Ottimizzazione Minimap**
- [ ] Update minimap ogni N frame invece di ogni frame
- [ ] Limite max dots visualizzati
- [ ] Culling nemici fuori viewport
- [ ] **File**: `src/Minimap.js`
- [ ] **Priorità**: 🟢 BASSA

---

## 🐛 **BUG NOTI DA VERIFICARE**

### 17. **Collision Detection**
- [ ] Verificare hitbox slime (già fatto in v1.6.0 ma testare ulteriormente)
- [ ] Boss collision più precisa
- [ ] Player collision con pozioni più generosa
- [ ] **File**: `src/Level.js`, `src/Enemies/`
- [ ] **Priorità**: 🟡 MEDIA

### 18. **Spawn Nemici su Player**
- [ ] Verificare safe zone spawn (min distance da player)
- [ ] Evitare spawn su ostacoli/porte
- [ ] **File**: `src/WaveManager.js` metodo `spawnEnemy()`
- [ ] **Priorità**: 🟡 MEDIA

### 19. **HP Bar Overflow**
- [ ] HP bar a volte va oltre il 100% con regen
- [ ] Fix cap max HP display
- [ ] **File**: `src/Scene/Player.js` metodo `updateHPBar()`
- [ ] **Priorità**: 🟢 BASSA

---

## 📱 **DEPLOYMENT & BUILD**

### 20. **Progressive Web App (PWA)**
- [ ] Aggiungere manifest.json
- [ ] Service Worker per offline play
- [ ] Install prompt su mobile
- [ ] **File da creare**: `public/manifest.json`, `public/sw.js`
- [ ] **Priorità**: 🟢 BASSA

### 21. **Analytics**
- [ ] Tracciare gameplay metrics (tempo medio, kill rate, etc.)
- [ ] Heatmap posizioni morte player
- [ ] Pozioni più usate
- [ ] **Tool**: Google Analytics o Plausible
- [ ] **Priorità**: 🟢 BASSA

### 22. **SEO e Metadata**
- [ ] Aggiungere meta description
- [ ] Open Graph tags per social sharing
- [ ] Screenshot preview per share
- [ ] **File**: `index.html`
- [ ] **Priorità**: 🟢 BASSA

---

## 📊 **SISTEMI DA ESPANDERE**

### 23. **Achievement System - Nuovi Trofei**
- [ ] "Perfezionista" - Ottieni tutti i trofei
- [ ] "Veterano" - Gioca 50 partite
- [ ] "Indistruttibile" - Finisci partita senza prendere danno
- [ ] "Arsenal" - Usa tutte le armi in una partita
- [ ] **File**: `src/AchievementSystem.js`
- [ ] **Priorità**: 🟢 BASSA

### 24. **Difficulty Manager - Presets**
- [ ] Easy mode (nemici -30% stats)
- [ ] Hard mode (nemici +50% stats)
- [ ] Nightmare mode (nemici +100% stats, no regen)
- [ ] **File**: `src/DifficultyManager.js`
- [ ] **Priorità**: 🟢 BASSA

### 25. **Combo System - Chain Attacks**
- [ ] Combo x10+ attiva special attack temporaneo
- [ ] Combo diversi per armi diverse
- [ ] Visual feedback più appariscente
- [ ] **File**: `src/ComboSystem.js`
- [ ] **Priorità**: 🟢 BASSA

---

## 🧪 **TESTING**

### 26. **Unit Tests**
- [ ] Test enemy spawn logic
- [ ] Test difficulty scaling
- [ ] Test localStorage save/load
- [ ] **Tool**: Vitest o Jest
- [ ] **Folder da creare**: `tests/`
- [ ] **Priorità**: 🟢 BASSA

### 27. **Browser Compatibility**
- [ ] Test su Safari (iOS)
- [ ] Test su Firefox
- [ ] Test su Edge
- [ ] Test su Chrome Android
- [ ] **Priorità**: 🟡 MEDIA

### 28. **Performance Testing**
- [ ] FPS counter durante gameplay
- [ ] Memory leak detection
- [ ] Test con 100+ nemici simultanei
- [ ] **Priorità**: 🟢 BASSA

---

## 📝 **DOCUMENTAZIONE**

### 29. **Code Documentation**
- [ ] JSDoc per tutti i metodi pubblici
- [ ] Diagrammi architettura sistema
- [ ] Flow chart game loop
- [ ] **Priorità**: 🟢 BASSA

### 30. **Player Guide**
- [ ] Wiki con strategie avanzate
- [ ] Video tutorial gameplay
- [ ] FAQ sezione
- [ ] **Priorità**: 🟢 BASSA

---

## ✅ **COMPLETATI (v1.6.1)**

- ✅ Fix UI layout overflow
- ✅ Sistema trofei persistenti con localStorage
- ✅ Cleanup console.log (parziale - AudioManager ancora da fare)
- ✅ Hitbox slime corrette
- ✅ Assets spostati in public/ per Vercel
- ✅ AudioContext fix per browser policy
- ✅ Fix bug `tr is not defined` in MainMenu

---

## 🎯 **PROSSIMI STEP CONSIGLIATI**

1. **Priorità Immediata**:
   - Fix audio GameOver (stesso pattern del MainMenu)
   - Rimuovere ultimi 2 console.log

2. **Questa Settimana**:
   - Mobile controls touch
   - Nuovi SFX audio
   - Settings menu base

3. **Prossimo Mese**:
   - Sistema upgrade permanenti
   - 2 nuovi boss
   - PWA setup

---

## 📌 **NOTE SVILUPPO**

- **Build System**: Vite 5.2.0
- **Deploy**: Vercel (auto-deploy da GitHub)
- **Storage**: localStorage per save persistenti
- **Target**: Desktop + Mobile responsive
- **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+

---

*Per aggiungere task: fai fork, aggiungi task nella sezione appropriata, commit e push.*
