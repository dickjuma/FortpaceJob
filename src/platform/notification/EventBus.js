// src/notification/EventBus.js
const emitter = {
  listeners: new Map(),
  emit(event, payload) {
    const handlers = this.listeners.get(event) || [];
    handlers.slice().forEach((handler) => handler(payload));
  },
  on(event, handler) {
    const handlers = this.listeners.get(event) || [];
    this.listeners.set(event, [...handlers, handler]);
  },
  off(event, handler) {
    const handlers = this.listeners.get(event) || [];
    this.listeners.set(event, handlers.filter((item) => item !== handler));
  },
};

module.exports = emitter;
module.exports.default = emitter;
