module.exports = {
  name: 'user-info',
  description: 'User-info command',
  execute(message, messageArgs) {
    message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
  },
};