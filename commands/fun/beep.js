module.exports = {
  name: 'beep',
  description: 'Beep',
  execute(message, messageArgs) {
    message.channel.send('boop')
  },
};