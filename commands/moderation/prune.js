module.exports = {
  name: 'prune',
  description: 'Prune command',
  cooldown: 1,
  execute(message, messageArgs) {
    const amount = parseInt(messageArgs[0]) + 1;

    // If the first argument doesn't contain a number
    if(isNaN(amount)) {
      return message.reply(`${message.author.username}, that doesn't seem to be a number`);
    } else if(amount < 2 || amount > 100) { // Default limit of .bulkDelete
      return message.reply(`You need to put a number between 2 and 100!`);
    }

    message.channel.bulkDelete(amount, true).catch(err => {
      console.error(err);
      message.channel.send(`There was an error trying to prune messages in this channel!`);
    });
  },
};