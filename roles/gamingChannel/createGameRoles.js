const config = require('../../config.json');

/** Creates roles for games
 * 
 * @param {Message} message The command message 
 * @param {MongoClient} mongoClient MongoDB Client
 */
module.exports = async function createGameRoles(message, mongoClient) {
	let servers = mongoClient.db('discordbot').collection('servers');
	let cursor = servers.find( { id: message.guild.id } );
	console.log(`The guild id: ${message.guild.id}`);
	console.log(`The guild name: ${message.guild.name}`);

	try {
		cursor.forEach(async doc => {
			if(doc.gameRoles !== undefined) {
				console.log(`The game roles already exist!`);
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
				console.log(`Role created: ${role.name}`);
				
				const query = { id: message.guild.id };
				const update = {
					$push: {
						gameRoles: {
							name: role.name,
							id: role.id,
						},
					}
				};
				const options = { upsert: true };
				servers.updateOne(query, update, options);
			}
		});
		message.reply(`${config.gamingRoles.length} game roles created successfully.`);
	} catch(err) {
		console.log(err);
	}
}