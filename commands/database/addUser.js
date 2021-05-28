const path = require('path');
const insertUpdateUser = require(path.resolve('./', 'database', 'insertUpdateUser'));

module.exports = {
  name: 'addUser',
  description: 'Add a user to the database',
  permissions: 'ADMINISTRATOR',
  args: true,
  usage: '<Mentioned User>',
  aliases: ['adduser'],
  execute(message, messageArgs, mongoClient) {
    insertUpdateUser(message, messageArgs, mongoClient);
  },
};