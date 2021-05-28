module.exports = {
  name: 'avatar',
  description: 'Avatar command',
  aliases: ['icon', 'pfp'],
  execute(message, messageArgs) {
    // If the message doesn't contain any users mention
    if(!msg.mentions.users.size) {
      return message.channel.send(`Your avatar <${message.author.displayAvatarURL({ format: 'png',
        dynamic: true})}>`);
    }

    const avatarList = message.mentions.users.map(user => {
      return `${user.username}'s avatar: <${user.displayAvatarURL({ format: 'png', dynamic: 'true'})}`
    });

    const taggedUser = message.mentions.users.first();

    message.channel.send(`User: ${taggedUser}`);
    message.channel.send(avatarList);
  },
};