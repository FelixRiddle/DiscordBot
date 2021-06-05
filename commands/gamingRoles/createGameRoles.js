const insertUpdateDiscordServer = require('../../database/insertUpdateDiscordServer')
const config = require('../../config.json');

module.exports = {
  name: 'createGameRoles',
  description: 'Add game roles to the server.',
  permissions: 'ADMINISTRATOR',
  aliases: ['creategameroles'],
  cooldown: 100,
  async execute(message, messageArgs, mongoClient) {

    // Check if the server exists or create it
    await insertUpdateDiscordServer(message.guild, mongoClient);

    // Verify if the role already exist
    let servers = mongoClient.db('discordbot').collection('servers');
    let cursor = await servers.find( { id: message.guild.id } );

    await cursor.forEach(doc => {
      if(doc.gameRoles !== undefined) {
        for(let i = 0; i < doc.gameRoles.length; i++) {
          message.guild.roles.create({
            data: {
              name: doc.gameRoles[i].roleName,
              color: 'ORANGE',
            },
            reason: 'We needed a role for ' + doc.gameRoles[i].roleName,
          });
        }
        message.reply(`Gameroles created.`);
      } else {
        message.reply(`You didn't insert any gameroles use the ${config.prefix}addGameRole or
        ${config.prefix}setGameRole command!`);
      }
    });
	},
}