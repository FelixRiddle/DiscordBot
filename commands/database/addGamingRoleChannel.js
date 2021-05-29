const path = require('path');
const gamingRoleManager = require(path.resolve('./', 'roles', 'gamingRoleManager'));
const addDiscordServer = require(path.resolve('./', 'database', 'discordServers', 'addDiscordServer'));

module.exports = {
  name: 'addGamingRoleChannel',
  description: 'Add the channel used to give roles to people for gaming.',
  permissions: 'ADMINISTRATOR',
  args: true,
  usage: '<Channel ID>',
  aliases: ['addgamingrolechannel'],
  execute(message, messageArgs, mongoClient, args) {

    addDiscordServer(message, messageArgs, mongoClient);

    gamingRoleManager(message, messageArgs, mongoClient);
  },
};