const insertUpdateDiscordServer = require('../../database/insertUpdateDiscordServer');
const config = require('../../config.json');

module.exports = {
  name: 'setCommandChannel',
  description: `Set the channel for commands(Warning: this will overwrite pre existing ones).`,
  permissions: 'ADMINISTRATOR',
  args: true,
  usage: `<Command channel ID>(Up to ${config.maxCommandChannels})`,
  aliases: ['setcommandchannel'],
  cooldown: 5,
  async execute(message, messageArgs, mongoClient) {
		insertUpdateDiscordServer(message.member.guild, mongoClient);

		let serverCollection = mongoClient.db('discordbot').collection('servers');
		let guildID = message.member.guild.id;

		if(messageArgs.length > 3) {
			message.reply(`The maximum amount of arguments is ${config.maxCommandChannels}`)
			return;
		}

		// TODO: Make it like, they can only have up to three command channels and
		// they can modify already existing ones.
		// TODO: Find the channel by name
		for(let i = 0; i < messageArgs.length; i++) {
			// Check if it is the id
			let verifyCommandChannel = await message.client.channels.cache.get(messageArgs[i]);

			if(typeof(messageArgs[i]) !== "string" || verifyCommandChannel == null) {
				message.reply(`You must provide the ID of the channel,\n
					the argument that produce this error is: ${messageArgs[i]}`);
				return;
			}

			try {
				let serverCommandChannelsArray = [];

				// Retrieve the document of the server/guild
				let cursor = serverCollection.find( { id: guildID } );
				console.log('Guild ID: ' + guildID);

				cursor.forEach(doc => {
					console.log(doc.commandChannelID);
					
					console.log('Array length: ' + doc.commandChannelID.length);
					serverCommandChannelsArray.push(doc.commandChannelID);
					console.log('Actualizado: ' + serverCommandChannelsArray);
					/*
					for(let j = 0; j < doc.commandChannelID.length; j++) {
						serverCommandChannelsArray.push(doc.commandChannelID[i]);
					}*/
				});
				console.log('Array fuera: ' + serverCommandChannelsArray);
				console.log('Array fuera: ' + serverCommandChannelsArray.length);

				/*
				if(serverCommandChannelsArray.length <= config.maxCommandChannels) {
					// Create a filter
					const filter = { id: guildID };
					
					// Insert or update
					const options = { upsert: true };
		
					// Sets
					const updateDoc = {
						$push: {
							commandChannelID: [ messageArgs[i] ],
						},
					};
		
					await serverCollection.updateOne(filter, updateDoc, options);
				}*/
			} catch(err) {
				console.log(err);
				message.reply(`Either there was an internal error or the ID you provided is not from a channel.`);
				return;
			}
		}

		message.reply(`Command channel/s set or updated successfully.`);
	},
};