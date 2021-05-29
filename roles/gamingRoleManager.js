module.exports = function gamingRoleManager(message, messageArgs, mongoClient) {

	// Create the role message or get the id
	let messageID = insertRoleMessage(messageArgs[0]);

	// Add the users reactions roles to the database
	insertUserRoles(message, mongoClient);

}

function insertRoleMessage(message, messageArgs) {

	// If the message doesn't exists
	let loc = '[addGamingRoleChannel.gamingRoleManager.insertRoleMessage]: ';
	// Find channel by id
	let channel = message.guild.channels.cache.get(messageArgs[0]);
	console.log(loc + channel.name);
	
	// The message exists
	// Code

	// Always return the message id
	return;
}

async function insertUserRoles(message, mongoClient) {
	// Insert the user and the role into the database
	// Create a collection for every server/guild

}