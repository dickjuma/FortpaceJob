// src/domain/events/UserRegisteredEvent.js
module.exports = class UserRegisteredEvent {
  /**
   * @param {object} payload - { userId, email, name }
   */
  constructor(payload) {
    this.name = 'UserRegistered';
    this.payload = payload;
  }
};
