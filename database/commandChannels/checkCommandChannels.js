/** Verifies if the command were sent in a command channel of the server
 * 
 * @param {*} message 
 * @param {*} mongoClient 
 */
module.exports = async function checkCommandChannels(message, mongoClient) {

	let collection = mongoClient.db('discordbot').collection('servers');
	let cursor = await collection.find( { id: message.member.guild.id } );
	let result;

	try {
		await cursor.forEach(doc => {
			// Iterate through every command channel id in the database
			for(let i = 0; i < doc.commandChannelID.length; i++) {
				// This is a command channel
				if(parseInt(message.channel.id) == parseInt(doc.commandChannelID[i])) {
					result = true;
					return;
				}
			}

			// Return the result outside the foreach
			result = false;
		});
		cursor.close();

		return result;
	} catch(err) {
		console.error(err);
		return false;
	}
}