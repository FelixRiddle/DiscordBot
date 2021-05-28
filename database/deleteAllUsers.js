const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const username = encodeURIComponent(process.env.MONGODB_USERNAME);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
const uri = `mongodb+srv://${username}:${password}@test.y6qzu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

module.exports = async function deleteAllUsers(message, args) {
	let loc = '[deleteAllUsers]: ';

	try {
		mongoClient.connect(err => {
			deleteAll(message, args, mongoClient);
		});
	} catch(err) {
		console.log(err);
	}
}

async function deleteAll(message, args, mongoClient) {
	let loc = '[deleteAllUsers.deleteAll]: ';
	console.log(loc + 'Connected successfully');
	await mongoClient.db('discordbot').collection('usercollection').deleteMany({});
	console.log(loc + 'All users deleted from the database!');
	message.reply(`All users deleted from the database!`);
}