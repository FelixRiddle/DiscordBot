module.exports = {
  name: 'kick',
  description: 'Kick a user from the server.',
  guildOnly: true,
  permissions: 'KICK_MEMBERS',
  cooldown: 5,
  execute(msg, args) {
    if(!msg.mentions.users.size) {
      return msg.reply(`You need to tag an user in order to kick them!`);
    }

    const taggedUser = msg.mentions.users.first();

    msg.channel.send(`You wanted to kick: ${taggedUser}`);
  },
};