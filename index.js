const { MongoClient, Cursor } = require("mongodb");
const fs = require('fs');
const Discord = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const config = require('./config.json');

const username = encodeURIComponent(process.env.MONGODB_USERNAME);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
const uri = `mongodb+srv://${username}:${password}@test.y6qzu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// Discord.js
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
bot.cooldowns = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');

for(const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
  for(const file of commandFiles) {
    const setCommand = require(`./commands/${folder}/${file}`);
    bot.commands.set(setCommand.name, setCommand);
  }
}

bot.once('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if(!msg.content.startsWith(config.prefix) || msg.author.bot) {
    return;
  }

  const args = msg.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  
  // Check the command exists
  const command = bot.commands.get(commandName)
    || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  
  if(!command) {
    return;
  }

  // Check commands cooldown
  const { cooldowns } = bot;

  if(!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 100;

  if(timestamps.has(msg.author.id)) {
    let expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if(now < expirationTime) {
      let timeLeft = (expirationTime - now) / 1000;
      return msg.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the\`${command.name}\` command.`)
    }
  }

  timestamps.set(msg.author.id, now);
  setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);

  if(command.guildOnly && message.channel.type == 'dm') {
    return messge.reply(`I can't execute that command inside DMs!`);
  }
  
  // Check for permissions
  if(command.permissions) {
    const authorPerms = msg.channel.permissionsFor(msg.author);
    if(!authorPerms || authorPerms.has(command.permissions)) {
      return msg.reply('You can\'t do this!');
    }
  }

  if(command.args && !args.length) {
    return msg.channel.send(`You didn't provide any arguments, ${message.author}`);
  }

  try {
    command.execute(msg, args);
  } catch(error) {
    console.error(error);
    msg.reply('There was an error trying to execute that command!');
  }
});

// MongoDB
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function run() {
  try {
    await client.connect();
    console.log('Connected successfully to server');
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);

bot.login(process.env.DISCORD_TOKEN);