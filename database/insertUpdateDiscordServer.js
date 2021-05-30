/** Inserts or updates a server/guild in the database
 * 
 * @param {*} message A message from the server
 * @param {*} mongoClient A MongoDB instance
 */
module.exports = async function insertUpdateDiscordServer(guild, mongoClient) {
	let loc = '[insertUpdateDiscordServer]: '
	const guildName = guild.name;
	const guildID = guild.id;
	const guildTotalMembers = guild.memberCount;

	const db = mongoClient.db('discordbot');
	const discordServers = db.collection('servers');

	try {
		// Create a filter
		const filter = { id: guildID };

		// Insert or update
		const options = { upsert: true };

		// Change the document
		const updateDoc = {
			$set: {
				name: guildName,
				id: guildID,
				totalMembers: guildTotalMembers,
			},
		};

		const result = await discordServers.updateOne(filter, updateDoc, options);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    );
	} catch(err) {
		console.log(loc + 'There was an error when trying to update or insert one document: ');
		console.log(err);
	}
}