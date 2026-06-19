// src/queues/emailQueue.js
const { Queue } = require('bullmq');
const IORedis = require('ioredis');

// Reuse the same Redis connection settings as notificationQueue
const connection = new IORedis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

// Email queue – jobs contain { templateKey, to, data }
const emailQueue = new Queue('emailQueue', { connection });

module.exports = { emailQueue, connection };
