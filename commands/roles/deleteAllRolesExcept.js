const createGameRoles = require('../../roles/gamingChannel/createGameRoles');

module.exports = {
  name: 'deleteAllRolesExcept',
  description: 'Deletes all the roles in a server except those that were passed as arguments.',
  permissions: 'ADMINISTRATOR',
  aliases: ['deleteallrolesexcept'],
  usage: '<Role ID> {<Role ID>}...',
  cooldown: 5,
  execute(message, messageArgs, mongoClient) {
    let amount = 0;

    // If the user provided arguments
    if(messageArgs.length == null) {
      // If not, delete every role
      message.guild.roles.cache.forEach(roles => {
        amount++;
        roles.delete()
          .then(deleted => console.log(`Deleted role ${deleted.name}`))
          .catch(console.error);
      });
      message.reply(`Roles deleted ${amount}`);
      return;
    }

    message.guild.roles.cache.forEach(roles => {
        let result = true;
        for(let i = 0; i < messageArgs.length; i++) {
          // If the role is an exception, skip to the next iteration
          if(roles.id == messageArgs[i]) {
            result = false;
          }
        }

        if(result) {
          roles.delete()
            .then(deleted => console.log(`Deleted role ${deleted.name}`))
            .catch(console.error);
          amount++;
        }
    });

    message.reply(`Roles deleted: ${amount}\nRoles skipped: ${messageArgs.length}`);
	},
}