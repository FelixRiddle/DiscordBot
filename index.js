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

// Discord.js
const bot = new Discord.Client();

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for(const file of eventFiles) {
  const event = require(`./events/${file}`);
  if(event.once) {
    bot.once(event.name, () => {
      event.execute(bot)
    });
  } else {
    bot.on(event.name, message => {
      event.execute(event.name, message, bot, mongoClient,
        mongoClient, // args[0]
        bot.id);
    });
  }
}

mongoClient.close();

bot.login(process.env.DISCORD_TOKEN);