const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();  // Add this package for env vars

const client = new Client({ 
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] 
});

let chainNumber = 0;
let queue = [];

const BOT_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;  // Your bot's Application ID from Discord Developer Portal

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Register slash commands (runs once on startup)
  const commands = [
    new SlashCommandBuilder()
      .setName('requesthit')
      .setDescription('Request a hit in the chain'),
    new SlashCommandBuilder()
      .setName('queue')
      .setDescription('Show current queue')
  ].map(command => command.toJSON());

  const rest = new REST().setToken(BOT_TOKEN);
  try {
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('Slash commands registered!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const username = interaction.user.username;

  if (interaction.commandName === 'requesthit') {
    chainNumber++;
    queue.push(`${chainNumber} - ${username}`);
    await interaction.reply(`✅ Hit requested! Your chain number: ${chainNumber}`);
  } else if (interaction.commandName === 'queue') {
    await interaction.reply(`📋 Queue:\n${queue.join('\n') || 'Empty'}`);
  }
});

client.login(BOT_TOKEN);  // Only once, at the end
