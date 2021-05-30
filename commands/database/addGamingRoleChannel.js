const path = require('path');
const gamingRoleManager = require(path.resolve('./', 'roles', 'gamingChannel', 'gamingRoleManager'));

module.exports = {
  name: 'addGamingRoleChannel',
  description: 'Add the channel used to give roles to people for gaming.',
  permissions: 'ADMINISTRATOR',
  args: true,
  usage: '<Channel ID>',
  aliases: ['addgamingrolechannel'],
  execute(message, messageArgs, mongoClient, args) {
    // Add gaming role manager
    gamingRoleManager(message, messageArgs, mongoClient);
  },
};