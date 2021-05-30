const config = require('../config.json');

module.exports = function rolesEmoji(message) {
	const msg = message.content.toLowerCase();
	
	// This methods require MANAGE_MESSAGES
	// To retrieve an emoji: Use .get() on the client.emojis.cache Collection.
	if(msg === `${config.reactions}factfile`) {
		// Get emoji by name
		const factFileEmoji = message.guild.emojis.cache.find(emoji => emoji.name === 'factfile');

		// Get emoji by id
		//const reactionEmoji = client.emojis.cache.get(config.factFileEmojiID);

		// React to the message
		message.react(factFileEmoji);
	} else if(msg === `${config.reactions}fruits`) {
		// The message.react is an asynchronous operation
		message.react('🍎');
		message.react('🍊');
		message.react('🍇');
	} else if(msg === `${config.reactions}fruitsinorder`) { 
		// Put reactions in order
		message.react('🍎')
			.then(() => message.react('🍊'))
			.then(() => message.react('🍇'))
			.catch(error => console.error('One of the emojis failed to react:', error));
	} else if(msg === `${config.reactions}fruitswithoutorder`) {
		Promise.all([
			message.react('🍎'),
			message.react('🍊'),
			message.react('🍇'),
		]).catch(error => console.error('One of the emojis failed to react:', error));
	} else if(msg === `${config.reactions}removeallreactions`) {
		// Remove all reactions
		Promise.all([
			message.react('🍎'),
			message.react('🍊'),
			message.react('🍇'),
		]).catch(error => console.error('One of the emojis failed to react:', error))
			.then(() => message.reactions.removeAll())
			.catch(error => console.error('Failed to clear reactions: ', error));
	} else if(msg === `${config.reactions}removebyemoji`) {
		// Remove reactions by emoji
		Promise.all([
			message.react('🍎'),
			message.react('🍊'),
			message.react('🍇'),
		]).catch(error => console.error('One of the emojis failed to react:', error))
			.then(() => message.reactions.cache.get(message.guild.emojis.cache.find(emoji => emoji.name === 'apple')))
			.remove()
			.then(() => message.reactions.cache.get(message.guild.emojis.cache.find(emoji => emoji.name === 'orange')))
			.remove()
			.then(() => message.reactions.cache.get(message.guild.emojis.cache.find(emoji => emoji.name === 'grapes')))
			.remove()
			.catch(error => console.error('Failed to remove reactions: ', error));
	}
}