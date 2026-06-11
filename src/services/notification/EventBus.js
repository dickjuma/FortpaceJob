// src/services/notification/EventBus.js
const EventEmitter = require('events');

class EventBus extends EventEmitter {
  constructor() {
    super();
  }

  /**
   * Emit an event with payload.
   * @param {string} eventName
   * @param {object} payload
   */
  emitEvent(eventName, payload) {
    this.emit(eventName, payload);
  }

  /**
   * Register a handler for an event.
   * @param {string} eventName
   * @param {function} handler
   */
  onEvent(eventName, handler) {
    this.on(eventName, handler);
  }
}

module.exports = new EventBus();
