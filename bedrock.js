const bedrock = require('bedrock-protocol')
const client = bedrock.createClient({
  host: 'donutsmp.net',
  port: 19132,
  username: 'Alber5 abc',
})

let waitingForShards = false;
let shards = 0;

client.on('spawn', () => {
  console.log('✅ Bot Spawned');

  const checkShards = () => {
    client.queue("command_request", {
          command: "/shards",
          origin: {
            type: "player",
            uuid: require("uuid").v4(),
            request_id: "",
          },
          interval: false,
          version: 76,
        });
    waitingForShards = true;
    console.log('⌛ Asking for shards...');
  };

  setTimeout(checkShards, 2000);
      client.queue("command_request", {
          command: "/afk 50",
          origin: {
            type: "player",
            uuid: require("uuid").v4(),
            request_id: "",
          },
          interval: false,
          version: 76,
        });
  setInterval(checkShards, 5 * 60 * 1000);
});

client.on('text', (packet) => {
  if (!waitingForShards) return;

  // Remove Minecraft color codes
  const cleanText = packet.message.replace(/§[0-9a-fklmnor]/gi, '').trim();
  console.log('🔍 Cleaned:', cleanText);

  const match = cleanText.match(/Your shards:\s*(\d+)/i);
  if (match) {
    shards = parseInt(match[1], 10);
    console.log('💎 Shards:', shards);
    waitingForShards = false;
  }
});

client.on('error', (err) => {
  console.log('Error:', err);
});
client.on('disconnect', (packet) => {
  console.log('Disconnected:', packet);
});