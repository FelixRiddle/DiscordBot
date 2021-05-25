module.exports = {
  name: 'avatar',
  description: 'Avatar command',
  aliases: ['icon', 'pfp'],
  execute(msg, args) {
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
  },
};