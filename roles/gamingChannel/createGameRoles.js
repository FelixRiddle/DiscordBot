const config = require('../../config.json');

/**
 * 
 * @param {Message} message 
 * @param {MongoClient} mongoClient 
 */
module.exports = async function createGameRoles(message, mongoClient) {
	let roles = [];
	servers = mongoClient.db('discordbot').collection('servers');

	for(let i = 0; i < config.gamingRoles.length; i++) {
		// Create the role with the name of the game
		let role = await message.guild.roles.create(
			{
				data: {
					name: config.gamingRoles[i].gameName,
					color: 'DEFAULT',
					/*
					permissions: {
						SEND_MESSAGES: true,
						ADD_REACTIONS: true,
						VIEW_CHANNEL: true,
						EMBED_LINKS: true,
						ATTACH_FILES: true,
						READ_MESSAGE_HISTORY: true,
						USE_EXTERNAL_EMOJIS: true,
						CONNECT: true,
						SPEAK: true,
					},*/
					mentionable: true,
				},
				reason: 'Roles for gamers',
			}).then()
				.catch(console.error);
			
		const query = { id: message.guild.id };
		const update = {
			$push: {
				gameRoles: {
					name: role.name,
					id: role.id,
				},
			},
		};
		const options = { upsert: true };
		await servers.updateOne(query, update, options);
	}

	console.log(`Roles inserted.`);
}