const { createClient } = require("redis");

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASS,
  socket: {
    host: 'redis-17770.c83.us-east-1-2.ec2.cloud.redislabs.com',
    port: process.env.REDIS_PORT
  }
});

// Connection logs (IMPORTANT)
redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

module.exports = redisClient;
