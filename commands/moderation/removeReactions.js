module.exports = {
  name: 'removeReactions',
  description: 'Remove reactions from a specific user or users.',
  permissions: 'ADMINISTRATOR',
  args: true,
  usage: '<User ID> [<User ID>...]',
  aliases: ['removereactions'],
  async execute(message, messageArgs) {
		// Iterate through every user
		for(let i = 0; i < messageArgs.length; i++) {
			const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(messageArgs[i]));

			try {
				// Search the reactions
				for(const reaction of userReactions.values()) {
					// Remove reaction
					await reaction.users.remove(messageArgs[i]);
				}
			} catch(err) {
				console.error('Failed to remove reactions.');
				message.reply(`Sorry, there was an internal error.`);
			}
		}
  },
};