module.exports = {
  name: 'beep',
  description: 'Ping',
  execute(msg, args) {
    msg.channel.send('boop')
  },
};