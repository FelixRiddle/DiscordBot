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
    
    // Add the server to the database
    addDiscordServer(message, messageArgs, mongoClient);

    // Now create roles, channels, etc.
    gamingRoleManager(message, messageArgs, mongoClient);
  },
};