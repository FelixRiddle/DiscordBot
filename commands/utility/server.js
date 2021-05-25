module.exports = {
  name: 'server',
  description: 'Server command',
  execute(msg, args) {
    msg.channel.send(`This server name is: ${msg.guild.name}
    Total members: ${msg.guild.memberCount}`);
  },
};