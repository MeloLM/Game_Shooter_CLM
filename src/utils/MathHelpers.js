/**
 * MathHelpers - Utility Math Functions
 * Reusable mathematical operations
 */

/**
 * Calculate distance between two objects
 */
export function getDistance(obj1, obj2) {
  const dx = obj1.x - obj2.x;
  const dy = obj1.y - obj2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate angle between two objects
 * @returns angle in radians
 */
export function getAngle(obj1, obj2) {
  return Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
}

/**
 * Generate random number in range
 */
export function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Generate random integer in range (inclusive)
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Clamp value between min and max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 */
export function lerp(start, end, t) {
  return start + (end - start) * t;
}

/**
 * Check if point is in circle
 */
export function pointInCircle(px, py, cx, cy, radius) {
  const dx = px - cx;
  const dy = py - cy;
  return (dx * dx + dy * dy) <= (radius * radius);
}

/**
 * Normalize vector
 */
export function normalize(x, y) {
  const length = Math.sqrt(x * x + y * y);
  if (length === 0) return { x: 0, y: 0 };
  return {
    x: x / length,
    y: y / length
  };
}

export default {
  getDistance,
  getAngle,
  randomRange,
  randomInt,
  clamp,
  lerp,
  pointInCircle,
  normalize
};
