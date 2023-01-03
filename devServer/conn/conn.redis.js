const { createClient } = require("redis");

const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));
(async () => {
  await client.connect();
  console.log("Connection with redis successfully");
})();

module.exports = client;
