/** Inserts or updates a server/guild in the database
 * 
 * @param {*} guild Guild where the message was sent
 * @param {*} mongoClient A MongoDB instance
 */
module.exports = async function insertUpdateDiscordServer(guild, mongoClient) {
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

		await discordServers.updateOne(filter, updateDoc, options);
	} catch(err) {
		console.log(err);
	}
}