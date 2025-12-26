/**
 * EventBus (Optional)
 * Central event management system
 * Alternative to using scene.events
 */
class EventBus extends Phaser.Events.EventEmitter {
  constructor() {
    super();
  }
}

// Singleton instance
export default new EventBus();
