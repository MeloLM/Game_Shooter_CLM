/**
 * ObjectPool - Sistema di Object Pooling per performance
 * Riutilizza oggetti invece di crearli/distruggerli continuamente
 */

export class ObjectPool {
  /**
   * @param {Function} createFn - Funzione per creare nuovi oggetti
   * @param {Function} resetFn - Funzione per resettare oggetti riutilizzati
   * @param {number} initialSize - Dimensione iniziale del pool
   */
  constructor(createFn, resetFn = null, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn || ((obj) => obj);
    this.pool = [];
    this.active = [];
    
    // Pre-popola il pool
    for (let i = 0; i < initialSize; i++) {
      const obj = this.createFn();
      if (obj.setActive) obj.setActive(false);
      if (obj.setVisible) obj.setVisible(false);
      this.pool.push(obj);
    }
  }
  
  /**
   * Ottieni un oggetto dal pool (o creane uno nuovo se vuoto)
   */
  get(...args) {
    let obj;
    
    if (this.pool.length > 0) {
      obj = this.pool.pop();
    } else {
      // Pool vuoto, crea nuovo oggetto
      obj = this.createFn();
    }
    
    // Resetta e attiva
    this.resetFn(obj, ...args);
    if (obj.setActive) obj.setActive(true);
    if (obj.setVisible) obj.setVisible(true);
    
    this.active.push(obj);
    return obj;
  }
  
  /**
   * Rilascia un oggetto nel pool
   */
  release(obj) {
    const index = this.active.indexOf(obj);
    if (index > -1) {
      this.active.splice(index, 1);
    }
    
    // Disattiva
    if (obj.setActive) obj.setActive(false);
    if (obj.setVisible) obj.setVisible(false);
    
    // Rimetti nel pool
    this.pool.push(obj);
  }
  
  /**
   * Rilascia tutti gli oggetti attivi
   */
  releaseAll() {
    while (this.active.length > 0) {
      this.release(this.active[0]);
    }
  }
  
  /**
   * Ottieni conteggio oggetti attivi
   */
  getActiveCount() {
    return this.active.length;
  }
  
  /**
   * Ottieni conteggio oggetti nel pool
   */
  getPoolCount() {
    return this.pool.length;
  }
  
  /**
   * Distruggi tutto
   */
  destroy() {
    this.active.forEach(obj => {
      if (obj.destroy) obj.destroy();
    });
    this.pool.forEach(obj => {
      if (obj.destroy) obj.destroy();
    });
    this.active = [];
    this.pool = [];
  }
}

/**
 * Pool Manager - Gestisce multipli pool per diversi tipi di oggetti
 */
export class PoolManager {
  constructor(scene) {
    this.scene = scene;
    this.pools = new Map();
  }
  
  /**
   * Crea un nuovo pool
   */
  createPool(key, createFn, resetFn = null, initialSize = 10) {
    const pool = new ObjectPool(createFn, resetFn, initialSize);
    this.pools.set(key, pool);
    return pool;
  }
  
  /**
   * Ottieni un pool esistente
   */
  getPool(key) {
    return this.pools.get(key);
  }
  
  /**
   * Ottieni un oggetto da un pool
   */
  spawn(key, ...args) {
    const pool = this.pools.get(key);
    if (!pool) {
      console.warn(`[PoolManager] Pool '${key}' non trovato`);
      return null;
    }
    return pool.get(...args);
  }
  
  /**
   * Rilascia un oggetto in un pool
   */
  despawn(key, obj) {
    const pool = this.pools.get(key);
    if (pool) {
      pool.release(obj);
    }
  }
  
  /**
   * Ottieni statistiche sui pool
   */
  getStats() {
    const stats = {};
    this.pools.forEach((pool, key) => {
      stats[key] = {
        active: pool.getActiveCount(),
        pooled: pool.getPoolCount(),
        total: pool.getActiveCount() + pool.getPoolCount()
      };
    });
    return stats;
  }
  
  /**
   * Distruggi tutti i pool
   */
  destroy() {
    this.pools.forEach(pool => pool.destroy());
    this.pools.clear();
  }
}

/**
 * Helper per creare pool comuni
 */
export function setupCommonPools(scene, poolManager) {
  // Pool per proiettili/sword
  poolManager.createPool('projectile', 
    () => {
      const proj = scene.add.circle(0, 0, 4, 0xffffff);
      proj.setDepth(10);
      scene.physics.add.existing(proj);
      return proj;
    },
    (proj, x, y, color = 0xffffff) => {
      proj.setPosition(x, y);
      proj.setFillStyle(color);
      proj.body.enable = true;
    },
    20
  );
  
  // Pool per particelle
  poolManager.createPool('particle',
    () => {
      const particle = scene.add.circle(0, 0, 2, 0xffffff);
      particle.setDepth(15);
      return particle;
    },
    (particle, x, y, color = 0xffffff, size = 2) => {
      particle.setPosition(x, y);
      particle.setFillStyle(color);
      particle.setRadius(size);
      particle.setAlpha(1);
      particle.setScale(1);
    },
    50
  );
  
  // Pool per damage text
  poolManager.createPool('damageText',
    () => {
      const text = scene.add.text(0, 0, '', {
        fontFamily: 'Arial',
        fontSize: '12px',
        color: '#ffffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2
      });
      text.setOrigin(0.5);
      text.setDepth(100);
      return text;
    },
    (text, x, y, damage, color = '#ffffff') => {
      text.setPosition(x, y);
      text.setText(damage.toString());
      text.setColor(color);
      text.setAlpha(1);
      text.setScale(1);
    },
    15
  );
  
  return poolManager;
}

/**
 * Esempio di utilizzo in Level.js:
 * 
 * // In create():
 * this.poolManager = new PoolManager(this);
 * setupCommonPools(this, this.poolManager);
 * 
 * // Per spaware un proiettile:
 * const proj = this.poolManager.spawn('projectile', x, y, 0xff0000);
 * 
 * // Per rilasciare:
 * this.poolManager.despawn('projectile', proj);
 * 
 * // In destroy/cleanup:
 * this.poolManager.destroy();
 */
