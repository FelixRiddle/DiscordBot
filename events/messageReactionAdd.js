const insertUpdateUser = require('../database/insertUpdateUser');
const checkGamesReaction = require('../roles/gamingChannel/checkGamesReaction');

module.exports = {
	name: 'messageReactionAdd',
	async execute(reaction, user, mongoClient, discordClient) {

		// If the reaction wasn't performed by the bot/discord client
		if(user.id !== discordClient.user.id) {
			// Insert or update the user in the database
			await insertUpdateUser(user.id, mongoClient, user.username);
			
			let message = reaction.message;
			let channel = reaction.message.channel;

			let servers = mongoClient.db('discordbot').collection('servers');
			cursor = servers.find( { id: message.guild.id } );
			
			await cursor.forEach(async doc => {
				if(doc.gamingRoleManagerChannelID === channel.id) {
					checkGamesReaction(reaction, user, mongoClient);
				} else {
					console.log(`The reaction wasn't in the gaming role channel!`);
				}
			});
		}//*/
	}
}