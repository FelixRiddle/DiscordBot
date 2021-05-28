const path = require('path');
const deleteUserById = require(path.resolve('./', 'database', 'deleteUserById'));

module.exports = {
  name: 'deleteById',
  description: 'Delete user/s by id.',
  aliases: ['deletebyid'],
  execute(message, args, mongoClient) {
    deleteUserById(message, args, mongoClient);
  },
};