const insertUpdateDiscordServer = require('../database/insertUpdateDiscordServer');

module.exports = {
	name: 'guildCreate',
	execute(guild, mongoClient, ...args) {
		// Insert some data into the database
		insertUpdateDiscordServer(guild, mongoClient);
	}
}