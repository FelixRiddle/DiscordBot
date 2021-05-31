const insertUpdateDiscordServer = require('../../database/insertUpdateDiscordServer');

module.exports = {
  name: 'setwelcomeChannel',
  description: 'Set the channel for welcome messages.',
  permissions: 'ADMINISTRATOR',
  args: true,
  usage: '<Channel ID>',
  aliases: ['setwelcomechannel'],
  cooldown: 5,
  async execute(message, messageArgs, mongoClient) {
		insertUpdateDiscordServer(message.member.guild, mongoClient);

		// TODO: Find the channel by name
    let channelID = messageArgs[0];

    if(typeof(channelID) !== "string") {
      message.reply(`You must provide the ID of the channel.`);
      return;
    }

    try {
      let serverCollection = mongoClient.db('discordbot').collection('servers');
      let guildID = message.member.guild.id;
      
      // Create a filter
      const filter = { id: guildID };
      
      // Insert or update
      const options = { upsert: true };

      // Sets
      const updateDoc = {
        $set: {
          welcomeChannelID: channelID,
        },
      };

      await serverCollection.updateOne(filter, updateDoc, options);
      message.reply(`Welcome channel set or updated successfully.`);
    } catch(err) {
      message.reply(`Either there was an internal error or the ID you provided is not from a channel.`);
    }
  },
};