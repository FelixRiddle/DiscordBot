const checkIfServerExists = require('./checkIfServerExists');
const checkNameChange = require('./checkNameChange');

/** Inserts or updates a server/guild in the database
 * 
 * @param {*A discord Message} message 
 * @param {*A MongoDB Client} mongoClient 
 */
module.exports = function addDiscordServer(message, mongoClient) {
	const guildName = message.member.guild.name;
	const guildID = message.member.guild.id;
	const guildTotalMembers = message.member.guild.memberCount;

	// If the name changes, use: db.collection.renameCollection()
	let guildSchema = {
		name: guildName,
		id: guildID,
		totalMembers: guildTotalMembers, 
	};

	add(mongoClient, guildSchema);
}

/** Adds or updates a server/guild in the database.
 * 
 * @param {*} mongoClient 
 * @param {*} schema 
 */
async function add(mongoClient, guildSchema) {
	const db = mongoClient.db('discordbot');
	const discordServers = db.collection('servers');

	try {
		// Check if the server/guild exists
		if(await checkIfServerExists(mongoClient, guildSchema.id)) {
			// Has it changed the name?
			if(await checkNameChange(mongoClient, guildSchema.id, guildSchema.name)) {
				// Filter
				const filter = {
					id: guildSchema.id,
				};

				// Update the name
				const updateDoc = {
					$set: {
						name: guildSchema.name,
					},
				};

				await discordServers.updateOne(filter, updateDoc);
			}
		} else {
			// The server/guild doesn't exists
			await discordServers.insertOne(guildSchema);
		}
	} catch(err) {
		console.log(loc + 'There was an error when trying to update or insert one document: ');
		console.log(err);
	}
}