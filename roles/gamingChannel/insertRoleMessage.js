const insertUpdateRoleMessage = require('./insertUpdateRoleMessage');
const Discord = require('discord.js');
const config = require('../../config.json');

/**	Inserts a role selector message in the text channel
 * 
 * @param {Message} message The command message
 * @param {*} messageArgs An array with the id of the textChannel
 * @param {MongoClient} mongoClient A MongoDB Client
 */
module.exports = async function insertRoleMessage(message, messageArgs, mongoClient) {
	// Find channel by id
	let channel = await message.guild.channels.cache.get(messageArgs[0]);
	
	// Retrieve the last message of the channel if it exists
	let lastMessage;
	try {
		lastMessage = channel.lastMessage;

		// If the last message doesn't exist
		if(lastMessage === null) {
			// Send role message
			let data = [];

			data.push(`React to get the role.\n`);
			data.push(`Games list:`);
			for(let i = 0; i < config.gamingRoles.length; i++) {
				data.push(`〖${config.gamingRoles[i].reaction}〗 ${config.gamingRoles[i].gameName}`);
			}
			
			// Send the embed
			lastMessage = await channel.send(new Discord.MessageEmbed()
				.setColor('#FF0000')
				.setTitle(' -- Gaming Roles -- ')
				.setDescription(data));
		}

		// Add the reactions
		for(let i = 0; i < config.gamingRoles.length; i++) {
			await lastMessage.react(config.gamingRoles[i].reaction)
				.catch(error => console.error(loc + 'One of the emojis failed to react:', error));
		}
		
		// Insert or update the role message in the database
		await insertUpdateRoleMessage(lastMessage, lastMessage.guild.id, mongoClient);
	} catch(err) {
		console.log(`${loc}There was an error when trying to retrieve the last message:\n`);
		console.error(err);
	}
}