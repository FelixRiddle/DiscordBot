const deleteAllGameRoles = require('../../roles/gamingChannel/deleteAllGameRoles');
const deleteAllGameChannels = require('../../roles/gamingChannel/deleteAllGameChannels');

module.exports = {
  name: 'deleteAllGameRolesAndChannels',
  description: 'Add game roles to the server.',
  permissions: 'ADMINISTRATOR',
  aliases: ['deleteAllGameRolesAndChannels', 'dagrac'],
  cooldown: 1000,
  execute(message, messageArgs, mongoClient) {
		// Delete all game roles
		deleteAllGameRoles(message, mongoClient);

    // Delete all game channel
    deleteAllGameChannels(message, mongoClient);
	},
};