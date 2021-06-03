const config = require('../../config.json');

/** Creates roles for games
 * 
 * @param {Message} message The command message 
 * @param {MongoClient} mongoClient MongoDB Client
 */
module.exports = async function createGameRoles(message, mongoClient) {
	let servers = mongoClient.db('discordbot').collection('servers');
	let cursor = servers.find(message.guild.id);

	try {
		cursor.forEach(async doc => {
			if(doc.gameRoles !== null) {
				return;
			}

			for(let i = 0; i < config.gamingRoles.length; i++) {
				
				// Create the role with the name of the game
				let role = await message.guild.roles.create(
					{
						data: {
							name: config.gamingRoles[i].gameName,
							color: '#e84a15',
							//mentionable: true,
						},
						reason: 'Roles for gamers',
					});
					
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
				servers.updateOne(query, update, options);
			}
		});
	} catch(err) {
		console.log(err);
	}

	message.reply(`${config.gamingRoles.length} game roles created successfully.`);
}