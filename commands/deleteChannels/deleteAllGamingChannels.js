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

      for(let i = 0; i < doc.gameRolesAndChannels.length; i++) {
        for(let j = 0; j < doc.gameRolesAndChannels[i].gameChannels.length; j++) {
          for(let k = 0; k < doc.gameRolesAndChannels[i].gameChannels[j].length; k++) {
            console.log(`ID: ${doc.gameRolesAndChannels[i].gameChannels[j][k].textChannel.id}`);
          }
        }
      }
    });
	},
};