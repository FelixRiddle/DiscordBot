const insertUpdateDiscordServer = require('../../database/insertUpdateDiscordServer');

module.exports = {
  name: 'setGameRole',
  description: `Deletes previous game roles and set a new one.`,
  permissions: 'ADMINISTRATOR',
  args: true,
  usage: '<Gamerole Name> or \n<Gamerole Name> <Textchannels amount> or\n<Gamerole Name> <Textchannels amount> <Voice amount>',
  aliases: ['setgamerole'],
  cooldown: 5,
  async execute(message, messageArgs, mongoClient) {
		await insertUpdateDiscordServer(message.guild, mongoClient);

		let servers = mongoClient.db('discordbot').collection('servers');
		let query = { id: message.guild.id };
		let cursor = await servers.find(query);

		await cursor.forEach(doc => {
			// Check if game roles already exists
			if(doc.gameRoles !== undefined) {
				// First delete game roles in the server
				for(let i = 0; i < doc.gameRoles.length; i++) {
					let role = message.guild.roles.cache.find(role => role.name == doc.gameRoles[i].roleName);
					role.delete('Goodbye')
						.catch(console.error);
				}

				// Then update
				let update = { $unset: { gameRoles: "" } };
				servers.updateOne(query, update);
			}
		});
		cursor.close();

		let update;
		if(messageArgs[2] !== null) {
			// Set gameroles
			update = {
				$push: {
					gameRoles: {
						roleName: messageArgs[0],
						textChannels: parseInt(messageArgs[1]),
						voiceChannels: parseInt(messageArgs[2]),
					},
				},
			};
		} else if(messageArgs[1] !== null) {
			// Set gameroles
			update = {
				$push: {
					gameRoles: {
						roleName: messageArgs[0],
						textChannels: parseInt(messageArgs[1]),
					},
				},
			};
		} else {
			// Set gameroles
			update = {
				$push: {
					gameRoles: {
						roleName: messageArgs[0],
					},
				},
			};
		}

		servers.updateOne(query, update, { upsert: true });
		message.reply(`Game role set successfully.`);
	}
}