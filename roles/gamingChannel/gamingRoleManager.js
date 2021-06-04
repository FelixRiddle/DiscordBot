const insertUpdateRoleChannel = require('./insertUpdateRoleChannel');
const insertRoleMessage = require('./insertRoleMessage');
const insertUpdateDiscordServer = require('../../database/insertUpdateDiscordServer')
const createGameRoles = require('./createGameRoles');

/** Adds a gaming role manager channel and message role selector
 * 
 * @param {*} message Message that performed the command
 * @param {*} messageArgs Message arguments containing the TextChannel ID
 * @param {*} mongoClient A MongoDB Client
 */
module.exports = async function gamingRoleManager(message, messageArgs, mongoClient) {
	// Insert or update the server in the database
	await insertUpdateDiscordServer(message.member.guild, mongoClient);

	// Create the roles
	await createGameRoles(message, mongoClient);

	// Insert or update the role channel in the database
	await insertUpdateRoleChannel(messageArgs, message.guild.id, mongoClient);

	// Create the role message or get the id
	await insertRoleMessage(message, messageArgs, mongoClient);
}