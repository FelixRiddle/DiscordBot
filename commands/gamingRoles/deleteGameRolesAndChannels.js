const deleteAllGameRoles = require('../../roles/gamingChannel/gameRoles/deleteAllGameRoles');

module.exports = {
  name: 'deleteGameRolesAndChannels',
  description: `Deletes all gaming channels from the database.`,
  permissions: 'ADMINISTRATOR',
  aliases: ['deletegamerolesandchannels', 'deleteallgamerolesandchannels'],
  cooldown: 5,
  async execute(message, messageArgs, mongoClient) {
		// Servers collection
		let servers = mongoClient.db('discordbot').collection('servers');
    const query = { id: message.guild.id };
    let cursor = await servers.find(query);

    await cursor.forEach(doc => {
      if(doc.gameChannels === undefined) {
        message.reply(`No gaming channels created by this bot exists in this server.`);
        return;
      }

      for(let i = 0; i < doc.gameChannels.length; i++) {
        try {
          message.guild.channels.cache.get(doc.gameChannels[i].id).delete();
        } catch(err) {
          console.log(err);
        }
      }
      
      message.reply(`All gaming channels were deleted.`);
    });

    // Delete game roles
    deleteAllGameRoles(message, mongoClient);

    // Delete the stored data
    let update = {
      $unset: {
        gameChannels: "",
      },
    };

    servers.updateOne(query, update);
	},
};