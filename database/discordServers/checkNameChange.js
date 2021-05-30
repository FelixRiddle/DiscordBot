/** Check if the name of the document has been changed
 * 
 * @param {*} mongoClient A MongoDB Client
 * @param {*} guildID The ID of the guild/server
 * @param {*} guildName The name of the guild/server
 * @returns false if not, true if it has been changed.
 */
 async function checkNameChange(mongoClient, guildID, guildName) {
	const cursor = await mongoClient.db('discordbot').collection('servers').find( { id: guildID } );
	let result;

	await cursor.forEach(doc => {
		result = doc;
	});

	if(result.name == guildName) {
		return false;
	}

	return true;
}