/** Check if the field of a guild/server document, exists or not,
 * if it doesn't exist, then create it.
 * @param {*} guildID The id of the guild/server.
 * @param {*} commandChannelID Field to create
 * @param {*} mongoClient A MongoDB instance.
 */
module.exports = async function fieldExists(guildID, commandChannelID, mongoClient) {
	let serverCollection = mongoClient.db('discordbot').collection('servers');

	// Retrieve the document of the server/guild
	let cursor = await serverCollection.find( { id: guildID } );

	await cursor.forEach(doc => {
		// If the field doesn't exist	
		if(doc.commandChannelID === undefined) {
			// The field doesn't exist
			const query = { id: guildID };
			const update = { $set: { commandChannelID }};
			const options = { upsert: true };

			serverCollection.updateOne(query, update, options);
		} else {
			// The field already exists
			return;
		}
	});

	cursor.close();
}