// Minimal working example
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
let chainNumber = 0;
let queue = [];

const BOT_TOKEN = 'PASTE_YOUR_BOT_TOKEN_HERE';
client.login(BOT_TOKEN);

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const username = interaction.user.username;

  if (interaction.commandName === 'requesthit') {
    chainNumber++;
    queue.push(`${chainNumber} - ${username}`);
    await interaction.reply(`✅ Hit requested! Your chain number: ${chainNumber}`);
  }

  if (interaction.commandName === 'queue') {
    await interaction.reply(`📋 Queue:\n${queue.join('\n')}`);
  }
});
