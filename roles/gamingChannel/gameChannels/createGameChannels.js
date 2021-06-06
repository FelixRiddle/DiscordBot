const createGameTextChannel = require('./createGameTextChannel');
const createGameCategory = require('./createGameCategory');
const createGameVoiceChannel = require('./createGameVoiceChannel');

module.exports = async function createGameChannels(message, mongoClient) {
	let servers = mongoClient.db('discordbot').collection('servers');
	let guild = message.guild;

	const query = { id: guild.id };
	//let time = 15000;

	let cursor = await servers.find(query);

	await cursor.forEach(async doc => {
		continueHere: for(let i = 0; i < doc.gameRoles.length; i++) {
			// Get the roles by name
			let role = await guild.roles.cache.find(role => role.name == doc.gameRoles[i].roleName);

			if(doc.channels && doc.channels[i].name && doc.channels.name === doc.gameRoles[i].name &&
				doc.channels.type == 'category') {
				console.log(`The category already exists!`);
				continue;
			}

			if(!doc.gameChannels) {
				await createGameCategory(role, guild, doc.gameRoles[i].roleName, mongoClient);

				await guild.channels.cache.find(channels => {
					if(channels.name === doc.gameRoles[i].roleName &&
							channels.type == 'category') {
						let category = channels;

						//setTimeout(() => { channel.delete(); }, time);
						
						// TODO: Check if the user provided an amount of textchannels
						// Create text channels
						if(doc.gameRoles[i].textChannels) {
							for(let j = 0; j < doc.gameRoles[i].textChannels; j++) {
								createGameTextChannel(role,
									guild,
									doc.gameRoles[i].roleName + " " + (j + 1),
									category,
									mongoClient);
								
								// For testing purposes
								//setTimeout(() => { channel.delete(); }, time);
							}
						}
			
						// Create voice channels
						if(doc.gameRoles[i].voiceChannels) {
							for(let j = 0; j < doc.gameRoles[i].voiceChannels; j++) {
								createGameVoiceChannel(
									role,
									guild,
									`${doc.gameRoles[i].roleName} voice ${j + 1}`,
									category,
									mongoClient);

								// For testing purposes
								//setTimeout(() => { channel.delete(); }, time);
							}
						}
					}
				});
			} else {
				// If the channels already exist proceed to the next
				for(let j = 0; j < doc.gameChannels.length; j++) {
					if(doc.gameChannels[j].name &&
						doc.gameChannels[j].name == doc.gameRoles[i].roleName) {
						continue continueHere;
					}
				}

				await createGameCategory(role, guild, doc.gameRoles[i].roleName, mongoClient);

				await guild.channels.cache.find(channels => {
					if(channels.name === doc.gameRoles[i].roleName &&
							channels.type == 'category') {
						let category = channels;

						//setTimeout(() => { channel.delete(); }, time);
						
						// TODO: Check if the user provided an amount of textchannels
						// Create text channels
						if(doc.gameRoles[i].textChannels) {
							for(let j = 0; j < doc.gameRoles[i].textChannels; j++) {
								createGameTextChannel(role,
									guild,
									doc.gameRoles[i].roleName + " " + (j + 1),
									category,
									mongoClient);
								
								// For testing purposes
								//setTimeout(() => { channel.delete(); }, time);
							}
						}
			
						// Create voice channels
						if(doc.gameRoles[i].voiceChannels) {
							for(let j = 0; j < doc.gameRoles[i].voiceChannels; j++) {
								createGameVoiceChannel(
									role,
									guild,
									`${doc.gameRoles[i].roleName} voice ${j + 1}`,
									category,
									mongoClient);

								// For testing purposes
								//setTimeout(() => { channel.delete(); }, time);
							}
						}
					}
				});
			}
		}
	});
	cursor.close();
}