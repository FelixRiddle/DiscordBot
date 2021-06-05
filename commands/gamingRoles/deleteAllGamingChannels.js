module.exports = {
  name: 'deleteAllGamingChannels',
  description: `Deletes all gaming channels from the database.`,
  permissions: 'ADMINISTRATOR',
  aliases: ['deleteallgamingchannels'],
  cooldown: 5,
  async execute(message, messageArgs, mongoClient) {
		// Servers collection
		let servers = mongoClient.db('discordbot').collection('servers');
    let cursor = servers.find( { id: message.guild.id } );

    cursor.forEach(doc => {
      if(doc.gameRolesAndChannels === undefined) {
        message.reply(`No gaming channels created by this bot exists in this server.`);
        return;
      }

      for(let i = 0; i < doc.gameRolesAndChannels.length; i++) {
        for(let j = 0; j < doc.gameRolesAndChannels[i].gameChannels.length; j++) {
          for(let k = 0; k < doc.gameRolesAndChannels[i].gameChannels[j].length; k++) {
            // Delete all gaming channels
            if(doc.gameRolesAndChannels[i].gameChannels[j][k].textChannel !== undefined) {
              message.guild.client.channels.cache.get(doc.gameRolesAndChannels[i].gameChannels[j][k].textChannel.id).delete();
            } else if(doc.gameRolesAndChannels[i].gameChannels[j][k].category !== undefined) {
              message.guild.client.channels.cache.get(doc.gameRolesAndChannels[i].gameChannels[j][k].category.id).delete();
            } else if(doc.gameRolesAndChannels[i].gameChannels[j][k].voice !== undefined) {
              message.guild.client.channels.cache.get(doc.gameRolesAndChannels[i].gameChannels[j][k].voice.id).delete();
            }
          }
        }
      }
      message.reply(`All gaming channels were deleted.`);
    });
	},
};