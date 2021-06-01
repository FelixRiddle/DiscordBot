const createGameRoles = require('../../roles/gamingChannel/createGameRoles');

module.exports = {
  name: 'createGameRoles',
  description: 'Add game roles to the server.',
  permissions: 'ADMINISTRATOR',
  aliases: ['creategameroles'],
  cooldown: 5,
  execute(message, messageArgs, mongoClient) {
		// Create the roles
		createGameRoles(message, mongoClient);
	},
}