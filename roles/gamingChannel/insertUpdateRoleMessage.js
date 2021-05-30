/** Insert or update the role message id into the database
 * 
 * @param {*} lastMessage The last message in the role text channel
 * @param {*} guildID ID of the guild
 * @param {*} mongoClient MongoDB Client
 */
module.exports = async function insertUpdateRoleMessage(lastMessage, guildID, mongoClient) {
	// Find by the guild/server ID
	const query = {
		id: guildID
	};

	// Insert or update the channelID
	const options = { upsert: true };

	// Field to update
	const updateDoc = {
		$set: {
			gamingRoleSelectorMessageID: lastMessage.id,
		}
	};

	let servers = mongoClient.db('discordbot').collection('servers');
	const result = await servers.updateOne(query, updateDoc, options);
	console.log(
		`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
	);
}