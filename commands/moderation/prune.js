module.exports = {
  name: 'prune',
  description: 'Prune command',
  cooldown: 1,
  execute(msg, args) {
    const amount = parseInt(args[0]) + 1;

    // If the first argument doesn't contain a number
    if(isNaN(amount)) {
      return msg.reply(`${msg.author.username}, that doesn't seem to be a number`);
    } else if(amount < 2 || amount > 100) { // Default limit of .bulkDelete
      return msg.reply(`You need to put a number between 2 and 100!`);
    }

    msg.channel.bulkDelete(amount, true).catch(err => {
      console.error(err);
      msg.channel.send(`There was an error trying to prune messages in this channel!`);
    });
  },
};