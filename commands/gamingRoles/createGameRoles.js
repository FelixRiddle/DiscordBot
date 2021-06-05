const createGameRoles = require('../../roles/gamingChannel/createGameRoles');
const insertUpdateDiscordServer = require('../../database/insertUpdateDiscordServer')

module.exports = {
  name: 'createGameRoles',
  description: 'Add game roles to the server(Warning: Don\'t perform this command often\n' +
  'as it is a very limited feature in discord).',
  permissions: 'ADMINISTRATOR',
  aliases: ['creategameroles'],
  cooldown: 3000,
  async execute(message, messageArgs, mongoClient) {

    // Check if the server exists or create it
    await insertUpdateDiscordServer(message.guild, mongoClient);

    // Verify if the role already exist
    let servers = mongoClient.db('discordbot').collection('servers');
    let cursor = await servers.find( { id: message.guild.id } );
    let end = false;

    await cursor.forEach(doc => {
      if(doc.gameRoles !== undefined) {
        end = true;
      }
    });

    // If the roles already exists return
    if(end) {
      message.reply(`The gameroles already exist!`);
      return;
    }

		// Create the roles
		await createGameRoles(message, mongoClient);
	},
}