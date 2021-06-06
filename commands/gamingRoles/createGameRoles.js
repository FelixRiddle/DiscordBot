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

    await cursor.forEach(async doc => {
      let skip = [];

      if(doc.gameRoles !== undefined) {
        // Which roles exist in the server?
        for(let i = 0; i < doc.gameRoles.length; i++) {
          await message.guild.roles.cache.find(role => {
            if(role.name == doc.gameRoles[i].roleName) {
              skip.push(doc.gameRoles[i].roleName);
            }
          });
        }

        continueHere: for(let i = 0; i < doc.gameRoles.length; i++) {

          // Skip the roles that are already created
          for(let j = 0; j < skip.length; j++) {
            // If the game roles are in the database
            if(doc.gameRoles !== undefined && doc.gameRoles[i].roleName == skip[j]) {
              continue continueHere;
            }
          }

          message.guild.roles.create({
            data: {
              name: doc.gameRoles[i].roleName,
              color: 'ORANGE',
            },
            reason: 'We needed a role for ' + doc.gameRoles[i].roleName,
          });
        }

        if(skip.length) {
          message.reply(`${skip.length} roles already exist, created ` + 
            `${doc.gameRoles.length - skip.length} game roles.`);
        } else {
          message.reply(`Gameroles created.`);
        }
      } else {
        message.reply(`You didn't insert any gameroles use the ${config.prefix}addGameRole` +
        `or ${config.prefix}setGameRole command!`);
      }
    });
	},
}