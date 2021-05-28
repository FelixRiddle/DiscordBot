const path = require('path');
const deleteUserById = require(path.resolve('./', 'database', 'deleteUserById'));

module.exports = {
  name: 'deleteById',
  description: 'Delete user/s by id.',
  permissions: 'ADMINISTRATOR',
  args: true,
  usage: '<User ID>',
  aliases: ['deletebyid'],
  execute(message, messageArgs, mongoClient) {
    deleteUserById(message, messageArgs, mongoClient);
  },
};