const fs = require('fs');
const Discord = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');
const config = require('./config.json');
const rolesEmoji = require('./roles/rolesEmojis');
const path = require('path');
const guildMemberAdd = require('./utility/guild/guildMemberAdd');
const guildMemberRemove = require('./utility/guild/guildMemberRemove');

const username = encodeURIComponent(process.env.MONGODB_USERNAME);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
const uri = `mongodb+srv://${username}:${password}@test.y6qzu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// MongoDB
const mongoClient = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
mongoClient.connect();

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

// Discord.js
const discordClient = new Discord.Client();

// Create a collection for commands and cooldowns
discordClient.commands = new Discord.Collection();
discordClient.cooldowns = new Discord.Collection();

// Commands path
let commandsPath = path.resolve('./', 'commands');
const commandFolders = fs.readdirSync(commandsPath);

// Read all commands from commands folder
for(const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`${commandsPath}/${folder}`).filter(file => file.endsWith('.js'));
  for(const file of commandFiles) {
    const setCommand = require(`${commandsPath}/${folder}/${file}`);
    discordClient.commands.set(setCommand.name, setCommand);
  }
}

// For each event
for(const file of eventFiles) {
  const event = require(`./events/${file}`);

  if(event.name === 'message') {
    discordClient.on(event.name, message => {
      // Commands
      if(message.content.startsWith(config.prefix)) {
        event.execute(message, discordClient.commands, discordClient.cooldowns, mongoClient,
          'foo', // args[0]
          discordClient.id,
          discordClient);
      } else if(message.content.startsWith(config.reactions)) {
        rolesEmoji(message);
      }
    });
  } else if(event.name === 'guildMemberAdd') { // When a user joins the server
    discordClient.on(event.name, member => {
      guildMemberAdd(member, mongoClient);
    });
  } else if(event.name === 'guildMemberRemove') { // When a user leaves the server
    discordClient.on(event.name, member => {
      guildMemberRemove(member, mongoClient);
    });
  } else if(event.name === 'guildCreate') { // When the client joins a server
    discordClient.on(event.name, guild => {
      event.execute(guild, mongoClient);
    });
  } else if(event.name === 'messageReactionAdd') { // When a user reacts to a message
    discordClient.on(event.name, async (reaction, user) => {
      event.execute(reaction, user, mongoClient);
    });
  } else if(event.name === 'ready') {
    discordClient.once(event.name, () => {
      discordClient.user.setUsername(config.botName);
      event.execute(discordClient);
    });
  }
}

mongoClient.close();

discordClient.login(process.env.DISCORD_TOKEN);