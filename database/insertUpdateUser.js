// Insert a user to the collection
module.exports = async function insertUpdateUser(message, messageArgs, mongoClient) {
	let loc = '[inserUpdateUser]: ';

	try {
		console.log(loc + 'Connected successfully');

		// Get user fields
		let collection = mongoClient.db("discordbot").collection("usercollection");
		let newUserSchema = [];

		// Insert mentioned users
		// If the message doesn't contain any users mention
		if(!message.mentions.users.size) {
			console.log(loc + 'No users were mentioned.');
			message.reply(`You didn't mention any user.`);
			return;
		} else {
			console.log(loc + 'Mentioned users iteration');
			await message.mentions.users.map(user => {
				// Iterate through every mentioned user
				// Mentioned users schema
				userSchemaTemplate = {
					name: user.username,
					id: user.id,
				};

				newUserSchema.push(userSchemaTemplate);
			});
		}

		for(let i = 0; i < newUserSchema.length; i++) {
			let userSchemaTemplate = {
				name: newUserSchema[i].name,
				id: newUserSchema[i].id,
			};

			// Query the user in MongoDB
			projection = { _id: 0, name: 1, id: 1};
			query = { id: userSchemaTemplate.id };

			let lastUserSchema = [];

			let cursor = collection.find(query).project(projection);
			await cursor.forEach(doc => {
				lastUserSchema.push(doc.name);
				lastUserSchema.push(doc.id);
			});

			// Update the value
			var newvalues = { $set: { name: userSchemaTemplate.name } };
			updateDocument(query, newvalues, message, lastUserSchema, userSchemaTemplate, mongoClient);
		}

	} catch(err) {
		console.log(err);
		message.reply(`There was an internal error when trying to insert or update users in the database.`);
	}
}

// Update a document
function updateDocument(query, newvalues, message, lastUserSchema, user, mongoClient) {
	let loc = '[insertUpdateUser.updateDocument]: ';
	console.log(loc + 'About to insert: ' + user.name);

	// If the user is already in the database
	if(lastUserSchema[1] == user.id) {
		// If the names are different
		if(lastUserSchema[0] !== user.name) {
			// Then update the name
			mongoClient
				.db("discordbot")
				.collection("usercollection")
				.updateOne(query, newvalues, function(err, res) {

				if (err) {
					console.log(loc + 'User update error.');
					throw err;
				}
				console.log(loc + "1 document updated");
				message.reply(`${user.name} user updated successfully.`);
			});
		} else {
			console.log(loc + 'The user already exists.');
			message.reply(`${user.name} user already exists.`)
		}
	} else {
		// If the user doesn't exist, create one.
		mongoClient.db("discordbot").collection("usercollection").insertOne(user);
		console.log(loc + `${user.name} user inserted successfully.`);
		message.reply(`${user.name} user inserted successfully.`);
	}
}