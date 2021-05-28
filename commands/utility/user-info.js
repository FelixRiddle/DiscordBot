module.exports = {
  name: 'user-info',
  description: 'User-info command',
  execute(message, messageArgs) {
    message.channel.send(`Your username: ${message.author.username}
    Your ID: ${message.author.id}`);
  },
};