const fs = require('fs');
const Discord = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');
const canvas = require('canvas');

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
const bot = new Discord.Client();

// For each event
for(const file of eventFiles) {
  const event = require(`./events/${file}`);
  const welcomeChannelID = '848189917519544370';

  if(event.once) {
    bot.once(event.name, () => {
      event.execute(bot.user.tag);
    });
  } if(event.name === 'guildMemberAdd') { // When a user joins the server
    bot.on(event.name, member => {
      const channel = bot.channels.cache.get(welcomeChannelID);

      channel.send(new Discord.MessageEmbed()
        .setColor('#00FF00')
        .setThumbnail(member.user.defaultAvatarURL)
        .setTitle('**' + member.user.username + '**, has joined the server!'))
        .catch(err => {
          console.log(err);
        });
    });
  } if(event.name === 'guildMemberRemove') { // When a user leaves the server
    bot.on(event.name, member => {
      const channel = bot.channels.cache.get(welcomeChannelID);

      channel.send(new Discord.MessageEmbed()
        .setColor('#FF0000')
        .setThumbnail(member.user.defaultAvatarURL)
        .setTitle('**' + member.user.username + '**, has left the server!'))
        .catch(err => {
          console.log(err);
        });
    });
  } else {
    bot.on(event.name, message => {
      event.execute(event.name, message, bot, mongoClient,
        'foo', // args[0]
        bot.id);
    });
  }
}

mongoClient.close();

bot.login(process.env.DISCORD_TOKEN);