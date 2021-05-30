const insertUpdateUser = require('../../database/insertUpdateUser');

module.exports = {
  name: 'addUser',
  description: 'Add a user to the database',
  permissions: 'ADMINISTRATOR',
  args: true,
  usage: '<Mentioned User> {<Mentioned User>...}',
  aliases: ['adduser'],
  async execute(message, messageArgs, mongoClient) {
		let newUserSchema = [];

		await message.mentions.users.map(user => {
			// Iterate through every mentioned user
			// Mentioned users schema
			userSchemaTemplate = {
				name: user.username,
				id: user.id,
			};
			
			newUserSchema.push(userSchemaTemplate);
		});

		for(let i = 0; i <= newUserSchema.length - 1; i++) {
			let userID = newUserSchema[i].id;
			let username = newUserSchema[i].name;
			await insertUpdateUser(userID, mongoClient, username);
		}
  },
};