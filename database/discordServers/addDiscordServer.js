module.exports = function addDiscordServer(message, messageArgs, mongoClient, ...args) {
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
		if(await checkIfServerExists(mongoClient, guildSchema)) {
			// Has it changed the name?
			if(await checkNameChange(mongoClient, guildSchema)) {
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

/** Check if the name of the document has been changed
 * 
 * @param {*} mongoClient 
 * @param {*} guildSchema 
 * @returns false if not, true if it has been changed.
 */
async function checkNameChange(mongoClient, guildSchema) {
	const cursor = await mongoClient.db('discordbot').collection('servers').find( { id: guildSchema.id } );
	let result;

	await cursor.forEach(doc => {
		result = doc;
	});

	if(result.name == guildSchema.name) {
		return false;
	}

	return true;
}

/** Check if the server exists in the database
 * 
 * @param {*} mongoClient 
 * @param {*} guildSchema 
 * @returns Returns false if not, true if it has been found.
 */
async function checkIfServerExists(mongoClient, guildSchema) {
	const cursor = await mongoClient.db('discordbot').collection('servers').find( { id: guildSchema.id } );
	let result;

	await cursor.forEach(doc => {
		result = doc.id;
	});

	if(result != guildSchema.id) {
		return false;
	}

	return true;
}