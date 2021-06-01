/** Verifies if the command were sent in a command channel of the server
 * 
 * @param {*} message 
 * @param {*} mongoClient 
 */
module.exports = async function verifyCommandChannel(message, mongoClient) {
	// First, verify if the server/guild has command channels in the database
	try {
		let collection = mongoClient.db('discordbot').collection('servers');
		let amountOfCommandChannels;
		
	} catch(err) {

	}
}