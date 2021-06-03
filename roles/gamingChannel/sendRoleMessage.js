const config = require('../../config.json');
const Discord = require('discord.js');

/** Inserts a games role message in the channel
 * 
 * @param {Discord.Channel} channel A discord.js channel
 * @param {MongoClient} mongoClient A MongoDB Client 
 */
module.exports = async function sendRoleMessage(channel, mongoClient) {
	try {
		// Send role message
		let data = [];

		data.push(`React to get the role.\n`);
		data.push(`Games list:`);
		for(let i = 0; i < config.gamingRoles.length; i++) {
			data.push(`〖${config.gamingRoles[i].reaction}〗 ${config.gamingRoles[i].gameName}`);
		}
		
		// Send the embed
		let lastMessage = await channel.send(new Discord.MessageEmbed()
			.setColor('#FF0000')
			.setTitle(' -- Gaming Roles -- ')
			.setDescription(data));

		// Add the reactions
		for(let i = 0; i < config.gamingRoles.length; i++) {
			await lastMessage.react(config.gamingRoles[i].reaction)
				.catch(error => console.error(loc + 'One of the emojis failed to react:', error));
		}
	} catch(err) {
		console.error(err);
	}
}