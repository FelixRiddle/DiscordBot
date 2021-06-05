const insertUpdateDiscordServer = require('../../database/insertUpdateDiscordServer');

module.exports = {
  name: 'addGameRole',
  description: `Add a game role to the collection.`,
  permissions: 'ADMINISTRATOR',
  args: true,
  usage: '<Gamerole Name> or \n<Gamerole Name> <Textchannels amount> or\n<Gamerole Name> <Textchannels amount> <Voice amount>',
  aliases: ['addgamerole'],
  cooldown: 5,
  async execute(message, messageArgs, mongoClient) {
		await insertUpdateDiscordServer(message.guild, mongoClient);

		let servers = mongoClient.db('discordbot').collection('servers');
		let query = { id: message.guild.id };

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

		await servers.updateOne(query, update, { upsert: true });
		message.reply(`Game role ${messageArgs[0]} inserted!`);
	}
}