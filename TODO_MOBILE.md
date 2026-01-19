# 📱 TODO MOBILE - Knight Shooter

> **Creato:** 2026-01-09
> **Obiettivo:** Ottimizzare l'esperienza di gioco su dispositivi mobile

---

## 🔴 PROBLEMI ATTUALI

### 1. **D-Pad Limitato a 4 Direzioni**
Il D-pad attuale supporta solo 4 direzioni cardinali (su, giù, sinistra, destra).
- In un top-down shooter servono **8+ direzioni** per movimento fluido
- Il giocatore non può muoversi in diagonale senza premere due bottoni

### 2. **Attacco Non Direzionale**
Il bottone attacco trigger `player.attack()` ma:
- Su desktop l'attacco va verso il cursore del mouse
- Su mobile **non c'è un modo per scegliere la direzione** dell'attacco
- Il giocatore attacca sempre nella direzione di movimento o fissa

### 3. **Area Touch Piccola**
- Bottoni da 40px sono **troppo piccoli** per dita umane
- Standard minimo touch target: **44-48px** (Apple HIG / Material Design)
- Alta probabilità di miss-tap durante gameplay intenso

### 4. **Nessun Feedback Tattile**
- Manca vibrazione su touch (Vibration API)
- Nessun feedback visivo chiaro quando si preme
- Difficile sapere se l'input è stato registrato

### 5. **UI Non Scalabile**
- Posizioni hardcoded per D-pad e Attack button
- Non si adatta a schermi diversi (tablet vs phone)
- In landscape i controlli potrebbero sovrapporsi al gameplay

### 6. **Performance Mobile**
- Particle effects pesanti su GPU mobile
- Screen shake può causare lag su dispositivi low-end
- Object pooling non ottimizzato per mobile

### 7. **Mancanza Auto-Attack/Auto-Aim**
- Su mobile è difficile mirare e muoversi contemporaneamente
- Serve assistenza al targeting

### 8. **Nessuna Gesture Support**
- Solo tap, niente swipe/pinch
- Potenziale non sfruttato

---

## 🟢 SOLUZIONI PROPOSTE

### 📍 Priorità ALTA

#### 1. **Virtual Joystick a 360° (16+ direzioni)**
```
Sostituire il D-pad con un joystick virtuale analogico:
- Tocco iniziale = centro joystick
- Drag = direzione e intensità movimento
- Zona morta centrale configurabile
- Visual feedback con cerchio esterno + knob interno
```

**File da creare:** `src/ui/VirtualJoystick.js`

**Implementazione:**
```javascript
// Esempio struttura
class VirtualJoystick {
  centerX, centerY;     // Centro quando tocchi
  currentX, currentY;   // Posizione attuale dito
  maxRadius = 50;       // Raggio massimo movimento
  deadzone = 10;        // Zona morta
  
  getDirection() {
    // Ritorna angolo 0-360 e intensità 0-1
    return { angle, force };
  }
}
```

#### 2. **Auto-Aim System**
```
Il giocatore attacca automaticamente il nemico più vicino
entro un certo raggio, oppure nella direzione di movimento.

Opzioni:
- Auto-aim completo (sempre verso nemico più vicino)
- Semi-auto (direzione movimento + snap su nemico vicino)
- Manuale con secondo joystick per mirare
```

**Configurazione:**
```javascript
mobileSettings: {
  autoAim: 'semi',        // 'full' | 'semi' | 'manual'
  autoAimRadius: 150,     // Pixel
  autoAimSnapAngle: 30    // Gradi di tolleranza
}
```

#### 3. **Dual Joystick (Twin-Stick Shooter)**
```
Layout classico twin-stick:
- Joystick SINISTRO: Movimento
- Joystick DESTRO: Direzione attacco/mira

Pro: Controllo totale
Contro: Richiede due pollici sempre impegnati
```

#### 4. **Touch Target Size Upgrade**
```
Aumentare dimensioni minime:
- Bottoni: 48px minimo
- Joystick area: 120px diametro
- Spaziatura tra elementi: 8px minimo
```

---

### 📍 Priorità MEDIA

#### 5. **Haptic Feedback (Vibrazione)**
```javascript
// Usa Vibration API
if (navigator.vibrate) {
  navigator.vibrate(50);  // 50ms su hit
  navigator.vibrate([100, 50, 100]); // Pattern su danno
}
```

**Trigger vibrazione:**
- Player prende danno: vibrazione forte
- Player attacca: vibrazione leggera
- Pickup pozione: vibrazione breve
- Boss appare: vibrazione lunga

#### 6. **Responsive Layout**
```javascript
// Calcola posizioni dinamiche
const joystickX = screenWidth * 0.15;  // 15% da sinistra
const joystickY = screenHeight * 0.75; // 75% dall'alto
const attackX = screenWidth * 0.85;    // 85% da sinistra
```

#### 7. **Performance Mode Mobile**
```javascript
mobilePerformance: {
  reduceParticles: true,      // Meno particelle
  disableScreenShake: false,  // Opzionale
  lowerEnemyCap: 15,          // Max nemici su schermo
  simplifyEffects: true       // Effetti semplificati
}
```

#### 8. **Gesture Controls**
| Gesture | Azione |
|---------|--------|
| Tap schermo | Attacco rapido verso punto |
| Swipe veloce | Dash/Roll (se implementato) |
| Long press | Attacco caricato |
| Pinch | Zoom minimap (opzionale) |
| Double tap | Usa power-up/abilità speciale |

---

### 📍 Priorità BASSA

#### 9. **Auto-Fire Mode**
```
Opzione per attacco automatico continuo:
- Player spara automaticamente verso nemico più vicino
- Giocatore si concentra solo sul movimento
- Ideale per casual players
```

#### 10. **Tilt Controls (Accelerometro)**
```javascript
// Movimento con inclinazione device
window.addEventListener('deviceorientation', (e) => {
  const tiltX = e.gamma; // -90 to 90
  const tiltY = e.beta;  // -180 to 180
  // Converti in movimento
});
```

#### 11. **One-Handed Mode**
```
Layout per giocare con una mano sola:
- Joystick movimento al centro-basso
- Auto-aim sempre attivo
- Tap qualsiasi punto = attacco
```

#### 12. **Control Customization**
```
Menu settings per:
- Posizione joystick (sinistra/destra)
- Dimensione controlli (piccolo/medio/grande)
- Opacità controlli
- Abilita/disabilita gesture
- Sensibilità joystick
```

#### 13. **Portrait Mode Support**
```
Layout verticale per gioco in portrait:
- Gamepad nella metà inferiore
- Vista gioco nella metà superiore
- UI compatta
```

---

## 📋 CHECKLIST IMPLEMENTAZIONE

### Fase 1: Controlli Base
- [ ] Creare `VirtualJoystick.js` con supporto 360°
- [ ] Integrare joystick in `MobileControls.js`
- [ ] Implementare auto-aim base
- [ ] Aumentare touch target a 48px

### Fase 2: Feedback & Polish
- [ ] Aggiungere Vibration API
- [ ] Migliorare visual feedback touch
- [ ] Layout responsive per diverse risoluzioni
- [ ] Test su device reali (Android + iOS)

### Fase 3: Advanced Controls
- [ ] Dual joystick option
- [ ] Gesture support (swipe, double tap)
- [ ] Control customization menu
- [ ] Performance mode toggle

### Fase 4: Accessibility
- [ ] One-handed mode
- [ ] Auto-fire option
- [ ] Larger UI option
- [ ] High contrast mode

---

## 🎮 RIFERIMENTI DESIGN

### Giochi con buoni controlli mobile:
1. **Brawl Stars** - Dual joystick perfetto
2. **Archero** - Auto-aim + movimento semplice
3. **Vampire Survivors** - Solo movimento, auto-attack
4. **Soul Knight** - Joystick + auto-aim opzionale

### Guidelines:
- [Apple HIG - Touch](https://developer.apple.com/design/human-interface-guidelines/inputs/touch)
- [Material Design - Touch Targets](https://m3.material.io/foundations/interaction/states)
- [Game UX Best Practices](https://www.gamedeveloper.com/design/mobile-game-ux-best-practices)

---

## 📊 PRIORITÀ FINALE

| # | Feature | Impatto | Effort | Priorità |
|---|---------|---------|--------|----------|
| 1 | Virtual Joystick 360° | 🔴 Alto | Medio | 🥇 |
| 2 | Auto-Aim System | 🔴 Alto | Medio | 🥇 |
| 3 | Touch Target Size | 🟡 Medio | Basso | 🥇 |
| 4 | Haptic Feedback | 🟡 Medio | Basso | 🥈 |
| 5 | Responsive Layout | 🟡 Medio | Medio | 🥈 |
| 6 | Dual Joystick | 🟡 Medio | Alto | 🥈 |
| 7 | Performance Mode | 🟢 Basso | Medio | 🥉 |
| 8 | Gesture Controls | 🟢 Basso | Alto | 🥉 |
| 9 | Control Customization | 🟢 Basso | Alto | 🥉 |

---

*Documento generato per migliorare l'esperienza mobile di Knight Shooter*
