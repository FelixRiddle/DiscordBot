/**
 * 
 * @param {*} message 
 * @param {*} mongoClient 
 */
module.exports = async function deleteAllGameRoles(message, mongoClient) {
	let servers = mongoClient.db('discordbot').collection('servers');
	let cursor = await servers.find( { id: message.guild.id } );
	let amount;

	await cursor.forEach(async doc => {
		if(doc.gameRoles !== undefined) {
			amount = doc.gameRoles.length;
			const query = { id: message.guild.id };

			// Delete al game roles in the server
			for(let i = 0; i < doc.gameRoles.length; i++) {
				await message.guild.roles.cache.get(doc.gameRoles[i].id).delete();
			}

			// Delete all game roles from the database
			const update = {
				$unset: {
					gameRoles: "",
				},
			};
			await servers.updateOne(query, update);
		}
	});
	cursor.close();
	message.reply(`${amount} game roles deleted successfully.`)
}