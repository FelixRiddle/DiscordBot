/** Verifies if the command were sent in a command channel of the server
 * 
 * @param {*} message 
 * @param {*} mongoClient 
 */
module.exports = async function checkCommandChannels(message, mongoClient) {
	// TODO
	/* Check if the message was send in a command channel */
	try {
		let collection = mongoClient.db('discordbot').collection('servers');
		let amountOfCommandChannels;
		
	} catch(err) {

	}
}