const fs = require('fs');
const Discord = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');

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

let data;

// Discord.js
const discordClient = new Discord.Client();

// TODO: Make dynamic
const welcomeChannelID = '848189917519544370';

// For each event
for(const file of eventFiles) {
  const event = require(`./events/${file}`);
  
  if(event.name === 'ready') {
    discordClient.once(event.name, () => {
      event.execute(discordClient);
    });
  } else if(event.name === 'guildCreate') { // When the client joins a server
    discordClient.on(event.name, () => {
      event.execute(discordClient);
    });
  }else if(event.name === 'guildMemberAdd') { // When a user joins the server
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
  } else if(event.name === 'message') {
    discordClient.on(event.name, message => {
      event.execute(event.name, message, discordClient, mongoClient,
        'foo', // args[0]
        discordClient.id);
    });
  }
}

mongoClient.close();

discordClient.login(process.env.DISCORD_TOKEN);