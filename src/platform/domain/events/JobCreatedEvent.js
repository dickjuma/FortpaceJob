// src/domain/events/JobCreatedEvent.js
module.exports = class JobCreatedEvent {
  /**
   * @param {object} payload - { jobId, clientId, title, description }
   */
  constructor(payload) {
    this.name = 'JobCreated';
    this.payload = payload;
  }
};
