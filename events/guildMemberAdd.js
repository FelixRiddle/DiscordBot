const guildMemberAdd = require('../utility/guild/guildMemberAdd');

module.exports = {
	name: 'guildMemberAdd',
	execute(member, mongoClient) {
		guildMemberAdd();
	}
}