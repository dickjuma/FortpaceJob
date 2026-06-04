const UPSTASH_REDIS_REST_URL = process.env.REACT_APP_UPSTASH_REDIS_REST_URL || "https://ideal-honeybee-141520.upstash.io";
const UPSTASH_REDIS_TOKEN = process.env.REACT_APP_UPSTASH_REDIS_TOKEN || "gQAAAAAAAijQAAIgcDI5NWMxMTA2NDRiZTM0ZDQ1OGIzNDVlYTBkMzZiMmJlMQ";

const redisRESTRequest = async (command, ...args) => {
  const body = { command, args };
  const response = await fetch(`${UPSTASH_REDIS_REST_URL}/redis`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${UPSTASH_REDIS_TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Redis error: ${response.status} ${error}`);
  }

  const result = await response.json();
  return result.result;
};

export const redisService = {
  get: async (key) => {
    const result = await redisRESTRequest("GET", key);
    return result;
  },

  set: async (key, value) => {
    const result = await redisRESTRequest("SET", key, String(value));
    return result;
  },

  setex: async (key, seconds, value) => {
    const result = await redisRESTRequest("SETEX", key, String(seconds), String(value));
    return result;
  },

  del: async (key) => {
    const result = await redisRESTRequest("DEL", key);
    return result;
  },

  incr: async (key) => {
    const result = await redisRESTRequest("INCR", key);
    return result;
  },

  expire: async (key, seconds) => {
    const result = await redisRESTRequest("EXPIRE", key, String(seconds));
    return result;
  },

  ttl: async (key) => {
    const result = await redisRESTRequest("TTL", key);
    return result;
  },

  ping: async () => {
    const result = await redisRESTRequest("PING");
    return result;
  },
};

export default redisService;