const fs = require('fs');
const Discord = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

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
      event.execute(event.name, message, bot,
        message.author.id, // args[0]
        bot.id);
    });
  }
}

bot.login(process.env.DISCORD_TOKEN);