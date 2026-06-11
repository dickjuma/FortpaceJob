const { Queue } = require('bullmq');
const IORedis = require('ioredis');

// Redis connection (adjust host/port as needed)
const connection = new IORedis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

// Notification queue – jobs contain { type, payload, template, data }
const notificationQueue = new Queue('notificationQueue', { connection });

module.exports = { notificationQueue, connection };
