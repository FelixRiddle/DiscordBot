const insertUpdateUser = require('../database/insertUpdateUser');
const checkGamesReaction = require('../roles/gamingChannel/checkGamesReaction');

module.exports = {
	name: 'messageReactionAdd',
	async execute(reaction, user, mongoClient) {
		await insertUpdateUser(user.id, mongoClient, user.username);
		
		let message = reaction.message;
		let channel = reaction.message.channel;

		let collections = mongoClient.db('discordbot').collection('servers');
		let cursor = await collections.find( { id: message.guild.id } );
		
		await cursor.forEach(async doc => {
			if(doc.gamingRoleManagerChannelID === channel.id) {
				checkGamesReaction(reaction, mongoClient);
			} else {
				console.log(`The reaction wasn't in the gaming role channel!`);
			}
		});

		/*
		const filter = (reaction, user) => {
			return reaction.emoji.name === '👍' && user.id === reactionMessage.author.id;
		};
		
		const collector = reactionMessage.createReactionCollector(filter, { time: 15000 });
		
		collector.on('collect', (reaction, user) => {
			console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
		});
		
		collector.on('end', collected => {
			console.log(`Collected ${collected.size} items`);
		});*/
	}
}