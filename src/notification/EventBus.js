// src/notification/EventBus.js
const mitt = require('mitt');
const emitter = mitt();

module.exports = {
  emit: (event, payload) => emitter.emit(event, payload),
  on: (event, handler) => emitter.on(event, handler),
  off: (event, handler) => emitter.off(event, handler),
};
