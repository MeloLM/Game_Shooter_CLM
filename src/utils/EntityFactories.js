/**
 * EntityFactories.js
 * Factory functions per creare entità di gioco
 * Separato da Level.js per mantenere l'orchestrator snello
 */

// Importa tutte le entità necessarie
import { SlimeGreen } from "../entities/enemies/SlimeGreen.js";
import { SlimeBlue } from "../entities/enemies/SlimeBlue.js";
import { SlimeRed } from "../entities/enemies/SlimeRed.js";
import { Goblin } from "../entities/enemies/Goblin.js";
import { Fly } from "../entities/enemies/Fly.js";
import { TankEnemy } from "../entities/enemies/TankEnemy.js";
import { SpeedEnemy } from "../entities/enemies/SpeedEnemy.js";
import { RangedEnemy } from "../entities/enemies/RangedEnemy.js";
import { RedBottle } from "../entities/items/RedBottle.js";
import { YellowBottle } from "../entities/items/YellowBottle.js";
import { BlueBottle } from "../entities/items/BlueBottle.js";
import { GreenBottle } from "../entities/items/GreenBottle.js";
import { PurpleBottle } from "../entities/items/PurpleBottle.js";
import { OrangeBottle } from "../entities/items/OrangeBottle.js";
import { CyanBottle } from "../entities/items/CyanBottle.js";

/**
 * Crea la lista di factory per i nemici
 * @param {Phaser.Scene} scene - la scena corrente
 * @returns {Array} array di factory functions
 */
export function createEnemyFactories(scene) {
  return [
    (x, y) => new SlimeGreen(scene, x, y),
    (x, y) => new Goblin(scene, x, y),
    (x, y) => new Fly(scene, x, y),
    (x, y) => new TankEnemy(scene, x, y),
    (x, y) => new SpeedEnemy(scene, x, y),
    (x, y) => new RangedEnemy(scene, x, y),
    (x, y) => new SlimeBlue(scene, x, y),
    (x, y) => new SlimeRed(scene, x, y),
  ];
}

/**
 * Crea la lista pesata per spawn bottiglie
 * @param {Phaser.Scene} scene - la scena corrente
 * @returns {Array} array di oggetti {weight, create}
 */
export function createBottleFactories(scene) {
  return [
    { weight: 25, create: (x, y) => new RedBottle(scene, x, y) },      // Heal - comune
    { weight: 15, create: (x, y) => new YellowBottle(scene, x, y) },   // Laser - medio
    { weight: 20, create: (x, y) => new BlueBottle(scene, x, y) },     // Shield - comune
    { weight: 20, create: (x, y) => new GreenBottle(scene, x, y) },    // Speed - comune
    { weight: 10, create: (x, y) => new PurpleBottle(scene, x, y, scene.enemies) }, // Thunder - raro
    { weight: 5, create: (x, y) => new OrangeBottle(scene, x, y) },    // Shotgun - molto raro
    { weight: 5, create: (x, y) => new CyanBottle(scene, x, y) },      // Boomerang - molto raro
  ];
}
