const path = require('path');
const deleteAllUsers = require(path.resolve('./', 'database', 'deleteAllUsers.js'));

module.exports = {
  name: 'deleteAllUsers',
  description: 'Delete all users from the database.',
  permissions: 'ADMINISTRATOR',
  aliases: ['deleteallusers'],
  execute(message, messageArgs, mongoClient) {
    deleteAllUsers(message, messageArgs, mongoClient);
  },
};