// Delete users by id
module.exports = async function deleteUserById(message, args, mongoClient) {
	let loc = '[deleteById]: ';

	try {
		if(args.length !== 0) {
			await deleteById(message, args, mongoClient);
		} else {
			console.log(loc + 'No IDs provided.');
			message.reply(`You didn't provide any user IDs`);
		}
	} catch(err) {
		console.log(err)
		message.reply(`There was an internal error when trying to delete the users.`);
	}
}

function deleteById(message, args, mongoClient) {
	let loc = '[deleteUserById.deleteById]: ';

	for(let i = 0; i < args.length; i++) {
		mongoClient.db('discordbot').collection('usercollection').deleteOne( { id: args[i] } );
	}
	console.log(loc + 'User/s deleted from the database.');
	message.reply(`User/s deleted from the database.`);
}