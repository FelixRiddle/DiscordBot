const sendRoleMessage = require('./sendRoleMessage');
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

	sendRoleMessage(channel, mongoClient);
}