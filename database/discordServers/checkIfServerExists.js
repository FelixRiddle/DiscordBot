/** Check if the server exists in the database
 * 
 * @param {*} mongoClient A MongoDB Client
 * @param {*} guildID The guild/server ID
 * @returns Returns false if not, true if it has been found.
 */
 module.exports = async function checkIfServerExists(mongoClient, guildID) {
	const cursor = await mongoClient.db('discordbot').collection('servers').find( { id: guildID } );
	let result;

	await cursor.forEach(doc => {
		result = doc.id;
	});

	if(result != guildID) {
		return false;
	}

	return true;
}