module.exports = {
  name: 'pruneChannel',
  description: 'Prune command',
  cooldown: 20,
  usage: '<Amount> {<Channel ID> or <Channel Name>}...',
  aliases: ['deltemessages', 'prunechannel'],
  execute(message, messageArgs) {
    const amount = parseInt(messageArgs[0]) + 1;

    // If the first argument doesn't contain a number
    if(isNaN(amount)) {
      return message.reply(`${message.author.username}, that doesn't seem to be a number`);
    } else if(amount < 2 || amount > 100) { // Default limit of .bulkDelete
      return message.reply(`You need to put a number between 2 and 100!`);
    }

		for(let i = 1; i < messageArgs.length; i++) {
			console.log(`Channel mentioned: ${messageArgs[i]}`);
			const channelID = parseInt(messageArgs[i]);

			if(isNaN(channelID)) {
				// Find channel by name
				const channel = message.guild.channels.cache.find(channelName => channelName.name === messageArgs[i]);

				// Delete messages
				channel.bulkDelete(amount, true).catch(err => {
					console.error(err);
					message.channel.send(`There was an error trying to prune messages in this channel!`);
				});
			} else {
				// When converting an the argument to int, js changes its value
				// so, I had to do it without cache.get D:
				const channel = message.guild.channels.cache.find(channelName => channelName.id === messageArgs[i]);

				channel.bulkDelete(amount, true).catch(err => {
					console.error(err);
					message.channel.send(`There was an error trying to prune messages in this channel!`);
				});
			}
		}
  },
};