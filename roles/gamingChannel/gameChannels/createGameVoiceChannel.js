/** Creates a voice with a given name and
 * denies permissions for everyone without this role
 * to view this voice channel
 * @param {*} roles An existing game role.
 * @param {*} guild The server/guild.
 * @param {*} name Name for this voice channel.
 * @param {*} category Category in which this voice channel belongs.
 * @param {*} mongoClient A MongoDB client..
 */
module.exports = async function createGameVoiceChannel(role, guild, name, category, mongoClient) {
	await guild.channels.create(name, {
		type: 'voice',
		permissionOverwrites: [
			{
				id: role.id,
				allow: ['VIEW_CHANNEL'],
			},
			{
				id: guild.roles.everyone.id,
				deny: ['VIEW_CHANNEL'],
			}
		],
	}).then(channel => {
		channel.setParent(category);

		let servers = mongoClient.db('discordbot').collection('servers');
		let query = { id: guild.id };
		let update = {
			$push: {
				channels: {
					name: channel.name,
					type: 'voice',
					id: channel.id,
				},
			},
		};
		servers.updateOne(query, update);
	});
}