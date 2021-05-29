const path = require('path');
const roleManager = require(path.resolve('./', 'roles', 'roleManager.js'));
const addDiscordServer = require(path.resolve('./', 'database', 'discordServers', 'addDiscordServer'));

module.exports = {
  name: 'addRoleChannel',
  description: 'Add the channel used to give roles to people.',
  permissions: 'ADMINISTRATOR',
  args: true,
  usage: '<Channel ID>',
  aliases: ['adduser'],
  execute(message, messageArgs, mongoClient) {
    let loc = '[addGamingRoleChannel]';

		for(let i = 0; i < messageArgs.length; i++) {
			console.log(loc + 'Message args: ' + messageArgs[i]);
		}

    addDiscordServer(message, messageArgs, mongoClient);

    roleManager(message, messageArgs[0]);
  },
};