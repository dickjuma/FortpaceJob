// src/workers/notificationProcessor.js
const { notificationQueue } = require('../queues/notificationQueue');
const EmailChannel = require('../channels/EmailChannel');
// Future: import other channels (InAppChannel, PushChannel, etc.)

/**
 * Simple BullMQ processor that receives a job with { templateKey, data } and
 * dispatches it via the appropriate channel. For now we only support email.
 */
notificationQueue.process('sendNotification', async (job) => {
  const { templateKey, data } = job.data;
  // Resolve recipient from data (convention: data.to contains { email, name })
  const to = data.to;
  if (!to || !to.email) {
    throw new Error('Recipient email address missing in job data');
  }
  // Send using EmailChannel
  await EmailChannel.send(templateKey, to, data);
  return { status: 'sent' };
});

console.log('🔔 Notification processor started – listening on notificationQueue');
