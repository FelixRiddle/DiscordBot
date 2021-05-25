const { MongoClient, Cursor } = require("mongodb");
const Discord = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const username = encodeURIComponent(process.env.MONGODB_USERNAME);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
const uri = `mongodb+srv://${username}:${password}@test.y6qzu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const bot = new Discord.Client();
let prefix = '$';

// Discord.js
bot.once('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  if(!msg.content.startsWith(prefix) || msg.author.bot) {
    return;
  }

  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === `ping`) {
    msg.reply('Pong!');
  } else if(command === `beep`) {
    msg.channel.send('boop');
  } else if(command === `server`) {
    msg.channel.send(`This server name is: ${msg.guild.name}
      Total members: ${msg.guild.memberCount}`);
  } else if(command === `user-info`) {
    msg.channel.send(`Your username: ${msg.author.username}
      Your ID: ${msg.author.id}`);
  } else if(command === 'kick') {
    if(!msg.mentions.users.size) {
      return msg.reply(`You need to tag an user in order to kick them!`);
    }

    const taggedUser = msg.mentions.users.first();

    msg.channel.send(`You wanted to kick: ${taggedUser}`);
  } else if(command === 'avatar') {
    // If the message doesn't contain any users mention
    if(!msg.mentions.users.size) {
      return msg.channel.send(`Your avatar <${msg.author.displayAvatarURL({ format: 'png',
        dynamic: true})}>`);
    }

    const avatarList = msg.mentions.users.map(user => {
      return `${user.username}'s avatar: <${user.displayAvatarURL({ format: 'png', dynamic: 'true'})}`
    });

    const taggedUser = msg.mentions.users.first();

    msg.channel.send(`User: ${taggedUser}`);
    msg.channel.send(avatarList);
  } else if(command === 'prune') {
    const amount = parseInt(args[0]) + 1;

    // If the first argument doesn't contain a number
    if(isNaN(amount)) {
      return msg.reply(`${msg.author.username}, that doesn't seem to be a number`);
    } else if(amount < 2 || amount > 100) { // Default limit of .bulkDelete
      return msg.reply(`You need to put a number between 2 and 100!`);
    }

    msg.channel.bulkDelete(amount, true).catch(err => {
      console.error(err);
      msg.channel.send(`There was an error trying to prune messages in this channel!`);
    });
  } else if(command === 'args-info') { // Arguments
    if(!args.length) {
      return msg.channel.send(`You didn't provide any arguments, ${msg.author}!`);
    } else if(args[0] === 'foo') {
      return msg.channel.send('bar');
    }

    msg.channel.send(`Command name: ${command}\nArguments: ${args}`);
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
    console.log("Connected successfully to server");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);

bot.login(process.env.DISCORD_TOKEN);