const insertUpdateDiscordServer = require('../../database/insertUpdateDiscordServer');
const config = require('../../config.json');
const fieldExists = require('../../database/commandChannels/commandChannelExists');

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

		// Select a collection and a database
		let serverCollection = mongoClient.db('discordbot').collection('servers');
		let guildID = message.member.guild.id;

		if(messageArgs.length > config.maxCommandChannels) {
			message.reply(`The maximum amount of arguments is ${config.maxCommandChannels}`)
			return;
		}

		// Check if the field exists
		await fieldExists(guildID, [], mongoClient);

		let cursor = await serverCollection.find( { id: guildID } );
		cursor.forEach(async doc => {
			// Analize each argument
			checki: for(let i = 0; i < messageArgs.length; i++) {
				console.log(`ID del canal: ${messageArgs[i]}`);
				console.log(`Iteracion: ${i}`);

				// Check if the channel already exists in the database
				for(let j = 0; j < doc.commandChannelID.length; j++) {
					// Only once
					if(j === doc.commandChannelID.length - 1) {
						// Create a filter
						const filter = { id: guildID };
						
						// Insert or update
						const options = { upsert: true };

						// Rapidly fix a random bug
						const commandChannelArgs = doc.commandChannelID[i].toString();

						// Sets
						const updateDoc = {
							$push: {
								commandChannelID: [ commandChannelArgs ]
							},
						};

						await serverCollection.updateOne(filter, updateDoc, options);
					}

					if(doc.commandChannelID[i] === messageArgs[j]) {
						message.reply(`The channel ${messageArgs[j]} already exists in the database.`);
						continue checki;
					}
					console.log(`	ID del canal: ${doc.commandChannelID[j]}`);
					console.log(`	Iteracion: ${j}`);
				}

				// Check if is in the guild/server
				let verifyCommandChannel = await message.client.channels.cache.get(messageArgs[i]);
				if(typeof(messageArgs[i]) !== "string" || verifyCommandChannel == null) {
					await message.reply(`You must provide the ID of the channel,\n
						the argument that produce this error is: ${i}, ${messageArgs[i]}`);
					continue checki;
				}

				try {
					if(doc.commandChannelID.length <= config.maxCommandChannels) {
						// Create a filter
						const filter = { id: guildID };
						
						// Insert or update
						const options = { upsert: true };

						// Sets
						// Note: Without to string, it will insert a new array inside the array.
						const updateDoc = {
							$push: {
								commandChannelID: [ messageArgs[i] ],
							},
						};

						await serverCollection.updateOne(filter, updateDoc, options);
						await message.reply(`The channel ${messageArgs[i]} was inserted successfully.`);
					} else {
						await message.reply(`The maximum amount of command channels is ${config.maxCommandChannels}`);
					}
				} catch(err) {
					console.log(err);
					await message.reply(`Either there was an internal error or the ID you provided is not from a channel.`);
					return;
				}
			}

			await message.reply(`Command channel/s set or updated successfully.`);
		});
	},
};