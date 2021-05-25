module.exports = {
  name: 'user-info',
  description: 'User-info command',
  execute(msg, args) {
    msg.channel.send(`Your username: ${msg.author.username}
    Your ID: ${msg.author.id}`);
  },
};