const mineflayer = require('mineflayer')
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

function startBot() {
  const bot = mineflayer.createBot({
    host: 'donutsmp.net',
    username: 'Pinkkiledi',
    auth: 'microsoft',
  });

  let waitingForShards = false;
  let shards = 0;

  bot.once('spawn', () => {
    console.log('✅ Bot Spawned');

    const checkShards = () => {
      bot.chat('/shards');
      waitingForShards = true;
      console.log('⌛ Asking for shards...');
    };

    setTimeout(checkShards, 2000);
    bot.chat('/afk 50');
    setInterval(checkShards, 5 * 60 * 1000);
  });

  bot.on('message', (jsonMsg) => {
    if (!waitingForShards) return;

    const text = jsonMsg.toString().trim();
    console.log('🔍 Received:', text);

    const match = text.match(/(\d+)/);
    if (match) {
      shards = parseInt(match[1]);
      console.log(`✅ Shards found: ${shards}`);
      waitingForShards = false;

      const channel = client.channels.cache.get('1379162863075201024');
      const status = bot.player ? '✅ Online' : '❌ Offline';

      const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('STATS OF')
        .addFields(
          { name: `Status: ${status}`, value: '\u200B' },
          { name: `Shards: ${shards}`, value: '\u200B' }
        )
        .setTimestamp()
        .setFooter({ text: 'Dr.diddy yessir' });

      if (channel) {
        channel.send({ embeds: [exampleEmbed] }).catch(console.error);
      } else {
        console.log('⚠️ Discord channel not found');
      }
    } else {
      console.log('❌ No number found in message.');
    }
  });

  bot.on('end', () => {
    console.log('🚪 Bot disconnected, reconnecting in 5 seconds...');
    setTimeout(startBot, 50000); // <== FIXED: no () here!
  });

  bot.on('kicked', console.log);
  bot.on('error', console.log);
}

// Start the bot
client.once('ready', () => {
  console.log('🤖 Discord bot ready!');
  startBot();
});

module.exports = { startBot };
client.login(process.env.DISCORD_TOKEN);