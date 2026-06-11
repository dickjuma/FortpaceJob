// src/channels/InAppChannel.js
/**
 * Placeholder for in‑app notification channel.
 * In a real implementation this would persist a notification record to the database
 * and emit a websocket/push event to the client.
 */
class InAppChannel {
  async send(templateKey, userId, data) {
    // TODO: integrate with your in‑app notification storage and real‑time delivery.
    console.log(`[InAppChannel] Would send ${templateKey} to user ${userId}`);
    return { status: 'queued' };
  }
}

module.exports = new InAppChannel();
