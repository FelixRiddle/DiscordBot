const path = require('path');
const deleteAllUsers = require(path.resolve('./', 'database', 'deleteAllUsers.js'));

module.exports = {
  name: 'deleteAllUsers',
  description: 'Delete all users from the database.',
  aliases: ['deleteallusers'],
  execute(message, args, mongoClient) {
    deleteAllUsers(message, args, mongoClient);
  },
};