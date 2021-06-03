const config = require('../../config.json');

module.exports = async function createGameChannels(message, mongoClient) {
	let servers = mongoClient.db('discordbot').collection('servers');
	let guild = message.guild;

	const query = { id: guild.id };
	const options = { upsert: true };
	let time = 15000;
	let gameChannels = [];

	// Create with category
	// Create a new channel with permission overwrites
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

			let tempChannel = {
				textChannel: {
					name: channel.name,
					id: channel.id,
				},
			};

			// Push the text channel
			game.push(tempChannel);

			// For debug, auto delete channel
			// setTimeout(() => { channel.delete(); }, time);

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

				// setTimeout(() => { category.delete(); }, time);

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

						// setTimeout(() => { voice.delete(); }, time);
					});
				}

			});
		});
		gameChannels.push(game);
	}

	const update = {
		$push: {
			gameRolesAndChannels: {
				gameChannels,
			},
		},
	};
	servers.updateOne(query, update, options);
}