module.exports = {
  name: 'args-info',
  description: 'Information about the arguments provided.',
  args: true,
  execute(message, messageArgs) {
    if(messageArgs[0] === 'foo') {
      return message.channel.send('bar');
    }

    message.reply(`Arguments: ${messageArgs}`);
  },
};