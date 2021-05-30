/** Insert or update a user in the database
 * 
 * @param {*} userID User ID
 * @param {*} mongoClient MongoDB Instance
 * @param {*} username (Optional) Optional but makes data more readable
 */
module.exports = async function insertUpdateUser(userID, mongoClient, username = '') {
	let userCollection = mongoClient.db('discordbot').collection('users');
	
	// Filter/query
	const filter = { id: userID };

	// Method
	const options = { upsert: true };

	// Sets
	const updateDoc = {
		$set: {
			id: userID,
			username: username,
		}
	};

	await userCollection.updateOne(filter, updateDoc, options);
}