const fs = require('fs');
const Discord = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');
const config = require('./config.json');
const rolesEmoji = require('./roles/rolesEmojis');
const path = require('path');

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

// TODO: Make dynamic
const welcomeChannelID = '848189917519544370';

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

/*
embed.setAuthor(this.client.user.username, this.client.user.avatarURL());
embed.setFooter(`${message.author.username} mi prefix es: ${this.client.prefix}`, message.author.avatarURL({dynamic: true}));
if (!name) {
    let data = []
    data.push(`__**Estas son las categorias**__`)
    this.client.commands.map(commands => {
        if (data.some(a => a === `**${this.client.prefix}help** \`${commands.category}\``)) return;
        data.push(`**${this.client.prefix}help** \`${commands.category}\``);
    })
    embed.addField(`Tengo un total de ${this.client.commands.size} comandos`, data.join('\n'))
} else {
    const cmd = this.client.commands.get(name) || this.client.commands.get(this.client.aliases.get(name));
    if (cmd) {
        embed.setDescription([
            `__**Informacion del comando**__ \`${cmd.name}\``,
            `**Aliases:** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'No Aliases'}`,
            `**Description:** \`${cmd.description.length ? cmd.description : 'No Description'}\``,
            `**Category:** \`${cmd.category}\``,
            `**Usage:** \`${cmd.usage}\``
        ]);
    } else {
        let a = this.client.utils.removeDuplicates(this.client.commands.filter((cmd) => cmd.category === name).map((cmd) => `\`${cmd.name}\``));
        if (!a.length) return message.reply('no se encontro esta categoria o comando')
        embed.setDescription([`__**Todos los comandos ${name} para ${message.guild.name}**__`]);
        embed.addField(name, a.join(' | '));
    }
}
message.channel.send(embed);*/

// For each event
for(const file of eventFiles) {
  const event = require(`./events/${file}`);

  if(event.name === 'message') {
    discordClient.on(event.name, message => {
      //const { cooldowns } = discordClient;

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
      
      if(welcomeChannelID) {
        const channel = discordClient.channels.cache.get(welcomeChannelID);

        channel.send(new Discord.MessageEmbed()
          .setColor('#00FF00')
          .setThumbnail(member.user.defaultAvatarURL)
          .setTitle('**' + member.user.username + '**, has joined the server!'))
          .catch(err => {
            console.log(err);
          });
      }
    });
  } else if(event.name === 'guildMemberRemove') { // When a user leaves the server
    discordClient.on(event.name, member => {

      if(welcomeChannelID) {
        // If it's in the same server/guild
        const channel = discordClient.channels.cache.get(welcomeChannelID);

        channel.send(new Discord.MessageEmbed()
          .setColor('#FF0000')
          .setThumbnail(member.user.defaultAvatarURL)
          .setTitle('**' + member.user.username + '**, has left the server!'))
          .catch(err => {
            console.log(err);
          });
      }
    });
  } else if(event.name === 'guildCreate') { // When the client joins a server
    discordClient.on(event.name, () => {
      event.execute(discordClient);
    });
  } else if(event.name === 'messageReactionAdd') { // When a user reacts to a message
    discordClient.on(event.name, async (reaction, user) => {
      event.execute(reaction, user, mongoClient);
    });
  } else if(event.name === 'ready') {
    discordClient.once(event.name, () => {
      discordClient.user.setUsername('Epic bot');
      event.execute(discordClient);
    });
  }
}

mongoClient.close();

discordClient.login(process.env.DISCORD_TOKEN);