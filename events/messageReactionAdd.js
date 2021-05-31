const insertUpdateUser = require('../database/insertUpdateUser');

module.exports = {
	name: 'messageReactionAdd',
	async execute(reaction, user, mongoClient) {
		await insertUpdateUser(user.id, mongoClient, user.username);

		const filter = (reaction, user) => {
			return reaction.emoji.name === '👍' && user.id === message.author.id;
		};
		
		const collector = message.createReactionCollector(filter, { time: 15000 });
		
		collector.on('collect', (reaction, user) => {
			console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
		});
		
		collector.on('end', collected => {
			console.log(`Collected ${collected.size} items`);
		});
		
	}
}