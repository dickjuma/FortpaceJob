// src/services/notification/NotificationService.js
const EventBus = require('./EventBus');
const TemplateRegistry = require('../../templates/registry');
const { notificationQueue } = require('../../queues/notificationQueue');

/**
 * NotificationService listens for domain events, resolves the appropriate email/template,
 * merges shared variables, and enqueues a job for processing.
 */
class NotificationService {
  constructor() {
    this.registerEventHandlers();
  }

  registerEventHandlers() {
    // Example: UserRegistered event
    EventBus.onEvent('UserRegistered', async (payload) => {
      await this.handleEvent('auth.welcome', payload);
    });
    // Additional domain events
EventBus.onEvent('JobCreated', async (payload) => {
  await this.handleEvent('jobs.created', payload);
});
EventBus.onEvent('JobCompleted', async (payload) => {
  await this.handleEvent('jobs.completed', payload);
});
EventBus.onEvent('WalletTopup', async (payload) => {
  await this.handleEvent('wallet.topup', payload);
});
EventBus.onEvent('WalletWithdrawal', async (payload) => {
  await this.handleEvent('wallet.withdrawal', payload);
});
// Add more event handlers as needed.
  }

  async handleEvent(templateKey, payload) {
    // Merge shared variables
    const shared = await TemplateRegistry.getSharedVariables(payload);
    const data = { ...shared, ...payload };
    // Enqueue job
    await notificationQueue.add('sendNotification', {
      templateKey,
      data,
    });
  }
}

module.exports = new NotificationService();
