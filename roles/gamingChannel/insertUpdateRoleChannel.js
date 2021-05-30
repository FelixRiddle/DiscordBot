/** Inserts or updates a role text channel
 * 
 * @param {*} messageArgs 
 * @param {*} guildID 
 * @param {*} mongoClient 
 */
module.exports = async function insertUpdateRoleChannel(messageArgs, guildID, mongoClient) {
	let loc = '[addGamingRoleChannel.gamingRoleManager.insertUpdateRoleChannel]: ';
	console.log(loc + `Channel ID: ${messageArgs[0]}`);

	// Find by the guild/server ID
	const query = {
		id: guildID
	};

	// Insert or update the channelID
	const options = { upsert: true };

	// Field to update
	const updateDoc = {
		$set: {
			gamingRoleManagerChannelID: messageArgs[0],
		}
	};
	
	let servers = mongoClient.db('discordbot').collection('servers');
	const result = await servers.updateOne(query, updateDoc, options);
	console.log(
		`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
	);
}