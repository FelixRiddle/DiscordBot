const config = require('../../config.json');
/** Check message reaction for roles
 * 
 * @param {MessageReaction} reaction Message reaction 
 * @param {MongoClient} mongoClient MongoDB Client
 */
module.exports = function checkGamesReaction(reaction, user, mongoClient) {
	for(let i = 0; i < config.gamingRoles.length; i++) {
		// Is the reaction emoji one on the gaming roles config?
		if(reaction.emoji.name == config.gamingRoles[i].reaction) {

			let role = reaction.message.guild.roles.cache.find(role => {
				if(role.name == config.gamingRoles[i].gameName) {
					return role;
				}
			});

			let member = reaction.message.guild.members.cache.get(user.id);
			member.roles.add(role);

			return;
		}
	}//*/
}