module.exports = function deleteAllChannels(message, mongoClient) {
	let servers = mongoClient.db('discordbot').collection('servers');

	const query = { id: message.guild.id };
	let cursor = servers.find(query);

	cursor.forEach(doc => {
		
	});

	// Delete all game roles from the database
	const update = {
		$unset: {
			gameRolesAndChannels: "",
		},
	};

	servers.updateOne(query, update);
}