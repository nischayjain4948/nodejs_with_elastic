const redis = require("redis");
const redisclient = redis.createClient();

(async () => {
  await redisclient.connect();
})();

console.log("Connecting to the Redis");

redisclient.on("ready", () => {
  console.log("Connected!");
});

redisclient.on("error", (err) => {
  console.log("Error in the Connection");
});

module.exports = redisclient;
