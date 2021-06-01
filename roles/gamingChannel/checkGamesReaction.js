const config = require('../../config.json');
/** Check message reaction for roles
 * 
 * @param {MessageReaction} reaction Message reaction 
 * @param {MongoClient} mongoClient MongoDB Client
 */
module.exports = function checkGamesReaction(reaction, mongoClient) {
	for(let i = 0; i < config.gamingRoles.length; i++) {
		// Is the reaction emoji one on the gaming roles config?
		if(reaction.emoji === config.gamingRoles[i].reaction) {
			// TODO: Add the role
		}
	}
}