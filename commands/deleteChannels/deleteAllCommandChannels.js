module.exports = {
  name: 'deleteAllCommandChannels',
  description: `Deletes all command channels from the database.`,
  permissions: 'ADMINISTRATOR',
  aliases: ['deleteallcommandchannel', 'deleteallcommandchannels'],
  cooldown: 5,
  async execute(message, messageArgs, mongoClient) {
		
		// Servers collection
		let servers = mongoClient.db('discordbot').collection('servers');
		let guildID = message.member.guild.id;

		/*
		When used with $ to match an array element, $unset replaces the matching
		element with null rather than removing the matching element from the array.
		This behavior keeps consistent the array size and element positions. */
		// Create a filter
		const filter = { id: guildID };

		// Sets
		const updateDoc = {
			$unset: {
				commandChannelID: ""
			},
		};

		try {
			await servers.updateOne(filter, updateDoc);
			await message.reply(`All command channels deleted successfully!.`);
		} catch(err) {
			message.reply(`Either the server is down, or there is an internal error.`);
		}
	},
};