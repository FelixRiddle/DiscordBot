module.exports = {
  name: 'beep',
  description: 'Beep',
  cooldown: 50,
  execute(message, messageArgs) {
    message.channel.send('boop')
  },
};