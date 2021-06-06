const insertUpdateDiscordServer = require('../../database/insertUpdateDiscordServer');
const insertUpdateRoleChannel = require('../../roles/gamingChannel/insertUpdateRoleChannel');
const insertRoleMessage = require('../../roles/gamingChannel/insertRoleMessage');

module.exports = {
  name: 'setGameRolePickeChannel',
  description: 'Add the channel used to give roles to people for gaming.',
  permissions: 'ADMINISTRATOR',
  args: true,
  usage: '<Channel ID>',
  aliases: ['setgamerolepickerchannel'],
  cooldown: 5,
  execute(message, messageArgs, mongoClient, args) {

    // First insert or update server
    insertUpdateDiscordServer(message.guild, mongoClient);

    // Insert or update the role picker channel
    insertUpdateRoleChannel(messageArgs, message.guild.id, mongoClient);

    // Insert the role picker message
    insertRoleMessage(message, messageArgs, mongoClient);
  },
};