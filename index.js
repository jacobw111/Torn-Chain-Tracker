require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

const client = new Client({ 
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] 
});

let chainNumber = 0;
let queue = [];

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  const commands = [
    new SlashCommandBuilder().setName('requesthit').setDescription('Request a hit'),
    new SlashCommandBuilder().setName('queue').setDescription('Show queue')
  ].map(command => command.toJSON());

  const rest = new REST().setToken(TOKEN);
  try {
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('✅ Commands registered!');
  } catch (error) {
    console.log('Command registration failed (normal first run)');
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'requesthit') {
    chainNumber++;
    queue.push(`${chainNumber} - ${interaction.user.username}`);
    await interaction.reply(`✅ Hit #${chainNumber} assigned to you!`);
  } 
  else if (interaction.commandName === 'queue') {
    const queueText = queue.length ? queue.join('\n') : 'Empty';
    await interaction.reply(`📋 Current Chain:\n${queueText}`);
  }
});

client.login(TOKEN);
