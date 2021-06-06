const createGameChannels = require('../../roles/gamingChannel/gameChannels/createGameChannels');
const insertUpdateDiscordServer = require('../../database/insertUpdateDiscordServer')

module.exports = {
  name: 'createGameChannels',
  description: 'Add game roles and channels to the server(Warning: Don\'t perform\n' +
  'this command ofte nas it is a very limited feature in discord).',
  permissions: 'ADMINISTRATOR',
  aliases: ['creategamechannels'],
  cooldown: 100,
  async execute(message, messageArgs, mongoClient) {

    // Check if the server exists or create it
    await insertUpdateDiscordServer(message.guild, mongoClient);

    // Verify if the role already exist
    let servers = mongoClient.db('discordbot').collection('servers');
    let cursor = await servers.find( { id: message.guild.id } );
    let end = false;

    await cursor.forEach(doc => {
      if(doc.gameRoles === undefined) {
        end = true;
      }
    });

    // If the roles already exists return
    if(end) {
      message.reply(`Create game roles first!`);
      return;
    }

		// Create the channels
    await createGameChannels(message, mongoClient);
    message.reply(`Game channels created.`)
	},
}