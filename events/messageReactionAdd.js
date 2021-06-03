const insertUpdateUser = require('../database/insertUpdateUser');
const checkGamesReaction = require('../roles/gamingChannel/checkGamesReaction');

module.exports = {
	name: 'messageReactionAdd',
	async execute(reaction, user, mongoClient, ...args) {
		/*
		if(user.id !== args[0]) {
			// Insert or update the user in the database
			await insertUpdateUser(user.id, mongoClient, user.username);
			
			let message = reaction.message;
			let channel = reaction.message.channel;

			let collections = mongoClient.db('discordbot').collection('servers');

			
			await cursor.forEach(async doc => {
				if(doc.gamingRoleManagerChannelID === channel.id) {
					checkGamesReaction(reaction, mongoClient);
				} else {
					console.log(`The reaction wasn't in the gaming role channel!`);
				}
			});
		}*/

		// do stuff
	}
}