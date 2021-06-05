module.exports = {
  name: 'server',
  description: 'Server command',
  execute(message, messageArgs) {
    message.channel.send(`This server name is: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
  },
};