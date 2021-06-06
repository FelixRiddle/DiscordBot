const deleteAllGameRoles = require('../../roles/gamingChannel/gameRoles/deleteAllGameRoles');

module.exports = {
  name: 'deleteAllGameRoles',
  description: 'Add game roles to the server.',
  permissions: 'ADMINISTRATOR',
  aliases: ['deleteallgameroles'],
  cooldown: 5,
  execute(message, messageArgs, mongoClient) {
		// Delete all game roles
		deleteAllGameRoles(message, mongoClient);
	},
};