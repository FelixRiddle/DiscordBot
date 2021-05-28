const { MongoClient } = require("mongodb");
const dotenv = require('dotenv');
dotenv.config();

const username = encodeURIComponent(process.env.MONGODB_USERNAME);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
const uri = `mongodb+srv://${username}:${password}@test.y6qzu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// MongoDB
const mongoClient = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// Insert a user to the collection
module.exports = async function insertUpdateUser(message, args) {
	let loc = '[inserUpdateUser]: ';

	try {
		// Connect to MongoDB
		mongoClient.connect(err => {
			console.log(loc + 'Connected successfully');
			
			// Insert the author of the message
			// Perform actions on the collection object
			async function insertMessageAuthor() {
				// Message author schema
				let user = {
					name: message.author.username,
					id: message.author.id,
				};

				let projection = { _id: 0, name: 1, id: 1 };
				let query = { id: user.id };

				// Update the value
				var newvalues = { $set: { name: user.name } };

				let userFields = await getUserFields(query, projection, mongoClient);

				// Update the document if needed
				await updateDocument(query, newvalues, message, userFields, user, mongoClient);
			}

			insertMessageAuthor();
			
			// Insert mentioned users
			// If the message doesn't contain any users mention
			if(!message.mentions.users.size) {
				return;
			}

			// Iterate through every mentioned user
			(async() => await message.mentions.users.map(user => {
				async function insertMentionedUsers() {
					// Mentioned users schema
					let userSchema = {
						name: user.username,
						id: user.id,
					};

					// Query the user in MongoDB
					let projection = { _id: 0, name: 1, id: 1};
					let query = { id: user.id };
					let userFields = await getUserFields(query, projection, mongoClient);

					// Update the value
					var newvalues = { $set: { name: user.username } };
					await updateDocument(query, newvalues, message, userFields, userSchema, mongoClient);
				}

				insertMentionedUsers();
			}))();

			// Close the mongo client
			//mongoClient.close();
		});
	} catch(err) {
		console.log(err);
		message.reply(`There was an internal error when trying to connect to the database.`);
	}
}

// Get user fields
async function getUserFields(query, projection, mongoClient) {
	let loc = '[insertUpdateUser.userFields]: ';
	let collection = await mongoClient.db("discordbot").collection("usercollection");
	let userFields = [];
	
	let cursor = await collection.find(query).project(projection);
	
	for await(const doc of cursor) {
		userFields.push(doc.name);
		userFields.push(doc.id);
	}

	return userFields;
}

// Update a document
async function updateDocument(query, newvalues, message, userFields, user, mongoClient) {
	let loc = '[insertUpdateUser.updateDocument]: ';

	// If the user is already in the database
	if(userFields[1] == user.id) {
		// If the names are different
		if(userFields[0] !== user.name) {
			// Then update the name
			(async() => await mongoClient
				.db("discordbot")
				.collection("usercollection")
				.updateOne(query, newvalues, function(err, res) {

				if (err) {
					console.log(loc + 'User update error.');
					throw err;
				}
				console.log(loc + "1 document updated");
				message.reply(`${user.name} user updated successfully.`);
			}))();
		} else {
			console.log(loc + 'The user already exists.');
			message.reply(`${user.name} user already exists.`)
		}
	} else {
		// If the user doesn't exist, create one.
		//(async() => await mongoClient.db("discordbot").collection("usercollection").insertOne(user))();
		await mongoClient.db("discordbot").collection("usercollection").insertOne(user);
		message.reply(`${user.name} user inserted successfully.`);
	}
}