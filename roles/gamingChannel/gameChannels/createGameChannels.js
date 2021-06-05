const config = require('../../../config.json');
const createGameTextChannel = require('./createGameTextChannel');
const createGameCategory = require('./createGameCategory');
const createGameVoiceChannel = require('./createGameVoiceChannel');

module.exports = async function createGameChannels(message, mongoClient) {
	let servers = mongoClient.db('discordbot').collection('servers');
	let guild = message.guild;

	const query = { id: guild.id };
	const options = { upsert: true };
	let time = 15000;
	let gameChannels = [];

	let cursor = await servers.find(query);

	await cursor.forEach(async doc => {
		for(let i = 0; i < doc.gameRoles.length; i++) {
			// Get the roles by name
			let role = await guild.roles.cache.find(role => role.name == doc.gameRoles[i].roleName);

			await createGameCategory(role, guild, doc.gameRoles[i].roleName);

			await guild.channels.cache.find(channels => {
				if(channels.name === doc.gameRoles[i].roleName &&
						channels.type == 'category') {
					let category = channels;

					// Create text channels
					for(let j = 0; j < doc.gameRoles[i].textChannels; j++) {
						createGameTextChannel(role,
							guild,
							doc.gameRoles[i].roleName + " " + (j + 1),
							category);
						// For testing purposes
						//setTimeout(() => { channel.delete(); }, time);
					}
		
					// Create voice channels
					for(let j = 0; j < doc.gameRoles[i].voiceChannels; j++) {
						createGameVoiceChannel(
							role,
							guild,
							`${doc.gameRoles[i].roleName} voice ${j + 1}`,
							category);
						// For testing purposes
						//setTimeout(() => { channel.delete(); }, time);
					}
				}
			});
		}
	});

	// Create with category
	// Create a new channel with permission overwrites
	/*
	for(let i = 0; i < config.gamingRoles.length; i++) {
		let game = [];
		let roles = await guild.roles.cache.find(role => role.name == config.gamingRoles[i].gameName);

		await guild.channels.create(config.gamingRoles[i].gameName, {
			type: 'text',
			permissionOverwrites: [
				{
					id: roles.id,
					allow: ['VIEW_CHANNEL'],
				},
				{
					id: guild.roles.everyone.id,
					deny: ['VIEW_CHANNEL'],
				}
			],
		}).then(async channel => {
			game.push({
				textChannel: {
					name: channel.name,
					id: channel.id,
				},
			});

			// For debug, auto delete channel

			await guild.channels.create(config.gamingRoles[i].gameName, {
				type: 'category',
				permissionOverwrites: [
					{
						id: roles.id,
						allow: ['VIEW_CHANNEL'],
					},
					{
						id: guild.roles.everyone.id,
						deny: ['VIEW_CHANNEL'],
					}
				],
			}).then(async category => {
				channel.setParent(category.id);

				game.push({
					category: {
						name: category.name,
						id: category.id,
					},
				});

				//setTimeout(() => { category.delete(); }, time);

				for(let i = 0; i < 3; i++) {
					// Create a new channel with permission overwrites
					await guild.channels.create('Voice ' + i, {
						type: 'voice',
						permissionOverwrites: [
							{
								id: roles.id,
								allow: ['VIEW_CHANNEL'],
							},
							{
								id: guild.roles.everyone.id,
								deny: ['VIEW_CHANNEL'],
							}
						],
					}).then(voice => {
						voice.setParent(category.id);

						game.push({
							voice: {
								name: voice.name,
								id: voice.id,
							},
						});

						//setTimeout(() => { voice.delete(); }, time);
					});
				}

			});
		});
	}*/
}