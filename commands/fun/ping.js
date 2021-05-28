module.exports = {
  name: 'ping',
  description: 'Ping',
  execute(message, messageArgs) {
    message.channel.send('Pong.')
  },
};