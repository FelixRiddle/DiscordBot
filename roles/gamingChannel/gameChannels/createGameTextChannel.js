/** Creates a text channel with a given name and
 * denies permissions for everyone without this role
 * to view the channel
 * @param {*} roles An existing game role.
 * @param {*} guild The server/guild.
 * @param {*} name Name for this text channel.
 * @param {*} category Category in which this text channel belongs.
 * @param {*} mongoClient A MongoDB Client.
 */
module.exports = async function createGameTextChannel(role, guild, name, category, mongoClient) {
	await guild.channels.create(name, {
		type: 'text',
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
					type: 'text',
					id: channel.id,
				},
			},
		};
		servers.updateOne(query, update);
	});
}