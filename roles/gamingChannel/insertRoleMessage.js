const insertUpdateRoleMessage = require('./insertUpdateRoleMessage');
const Discord = require('discord.js');

/**	Inserts a role selector message in the text channel
 * 
 * @param {*} message The command message
 * @param {*} messageArgs An array with the id of the textChannel
 * @param {*} mongoClient A MongoDB Client
 */
module.exports = async function insertRoleMessage(message, messageArgs, mongoClient) {
	let loc = '[addGamingRoleChannel.gamingRoleManager.insertRoleMessage]: ';

	// Find channel by id
	let channel = await message.guild.channels.cache.get(messageArgs[0]);
	
	// Retrieve the last message of the channel if it exists
	let lastMessage
	try {
		lastMessage = channel.lastMessage;

		// If the last message doesn't exist
		if(lastMessage === null) {
			// Send role message
			let data = [];

			data.push(`React to get the role.\n`);
			data.push(`Games list:\n`);
			data.push(`[🧱] Fortnite\n`);
			data.push(`[🤺] League of Legends\n`);
			data.push(`[🌎] Minecraft\n`);
			data.push(`[⛏️] Terraria\n`);
			data.push(`[💥] CS: GO\n`);
			data.push(`[🏹] Valorant\n`);
			
			// Send the embed
			await channel.send(new Discord.MessageEmbed()
				.setColor('#FF0000')
				.setTitle(' -- Gaming Roles -- ')
				.setDescription(data));
			
			lastMessage = await channel.lastMessage;
		}

		// Add the reactions
		await lastMessage.react('🧱')
			.then(() => lastMessage.react('🤺'))
			.then(() => lastMessage.react('🌎'))
			.then(() => lastMessage.react('⛏️'))
			.then(() => lastMessage.react('💥'))
			.then(() => lastMessage.react('🏹'))
			.catch(error => console.error(loc + 'One of the emojis failed to react:', error));
		
		// Insert or update the role message in the database
		await insertUpdateRoleMessage(lastMessage, lastMessage.guild.id, mongoClient);

	} catch(err) {
		console.log(`${loc}There was an error when trying to retrieve the last message:\n`);
		console.error(err);
	}
}