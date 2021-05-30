module.exports = function gamingRoleManager(message, messageArgs, mongoClient) {

	// Create the role message or get the id
	let messageID = insertRoleMessage(message, messageArgs);

	// Add the users reactions roles to the database

}

function insertRoleMessage(message, messageArgs) {

	// If the message doesn't exists
	let loc = '[addGamingRoleChannel.gamingRoleManager.insertRoleMessage]: ';
	// Find channel by id
	console.log(loc + `Channel ID: ${messageArgs[0]}`);
	let channel = message.guild.channels.cache.get(messageArgs[0]);
	console.log(loc + `Channel name: ${channel.name}`);
	
	// The message exists
	// Code

	// Always return the message id
	return;
}

async function insertUserRoles(message, mongoClient) {
	// Insert the user and the role into the database
	// Create a collection for every server/guild

}