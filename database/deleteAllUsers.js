// Delete all users in the collection
module.exports = async function deleteAllUsers(message, args, mongoClient) {
	let loc = '[deleteAllUsers]: ';

	try {
		await deleteAll(message, args, mongoClient);
	} catch(err) {
		console.log(err);
		message.reply();
	}
}

function deleteAll(message, args, mongoClient) {
	let loc = '[deleteAllUsers.deleteAll]: ';
	mongoClient.db('discordbot').collection('usercollection').deleteMany({});
	console.log(loc + 'All users deleted from the database!');
	message.reply(`All users deleted from the database!`);
}