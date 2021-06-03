/**
 * 
 * @param {*} message 
 * @param {*} mongoClient 
 */
module.exports = async function deleteAllGameRoles(message, mongoClient) {
	// This is for deleting roles in the SERVER and in the DATABASE

	let servers = mongoClient.db('discordbot').collection('servers');
	let cursor = await servers.find( { id: message.guild.id } );
	let amount = 0;

	await cursor.forEach(doc => {
		if(doc.gameRoles !== undefined) {
			amount = doc.gameRoles.length;
			const query = { id: message.guild.id };

			// Delete al game roles in the server
			for(let i = 0; i < doc.gameRoles.length; i++) {
				// Delete roles in the server
				message.guild.roles.cache.get(doc.gameRoles[i].id).delete();
			}

			// Delete all game roles from the database
			const update = {
				$unset: {
					gameRoles: "",
				},
			};
			servers.updateOne(query, update);
		} else {
			message.reply(`No game roles were found!`);
		}
	});

	cursor.close();
	message.reply(`${amount} game roles deleted successfully.`)
}