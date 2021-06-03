const sendRoleMessage = require('../roles/gamingChannel/sendRoleMessage');

module.exports = {
	name: 'ready',
	once: true,
	async execute(discordClient, mongoClient) {
		console.log(`Logged in as ${discordClient.user.tag}!`);
		
		try {
			let servers = mongoClient.db('discordbot').collection('servers');
			let cursor = await servers.find( { gamingRoleManagerChannelID: { $exists: true } } );

			await cursor.forEach(doc => {
				let channel = discordClient.channels.cache.get(doc.gamingRoleManagerChannelID);
				if(channel === undefined) {
					return;
				}

				// Delete older messages
				channel.bulkDelete(10, true).catch(err => {
					console.error(err);
					message.channel.send(`There was an error trying to prune messages in this channel!`);
				});

				// Send game role picker message
				sendRoleMessage(channel, mongoClient);
			});
			cursor.close();
			
			// Insert role message
			//insertRoleMessage(, 'foo', mongoClient);
		} catch(err) {
			console.log(`There was a little error, but it doesn't matter :D`);
		}//*/
	}
}