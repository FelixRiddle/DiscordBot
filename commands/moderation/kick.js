module.exports = {
  name: 'kick',
  description: 'Kick a user from the server.',
  guildOnly: true,
  permissions: 'KICK_MEMBERS',
  cooldown: 5,
  execute(message, messageArgs) {
    if(!message.mentions.users.size) {
      return message.reply(`You need to tag an user in order to kick them!`);
    }

    const taggedUser = message.mentions.users.first();

    message.channel.send(`You wanted to kick: ${taggedUser}`);
  },
};