/** Creates a category with a given name and
 * denies permissions for everyone without this role
 * to view this category.
 * @param {*} roles An existing game role.
 * @param {*} guild The server/guild.
 * @param {*} name Name for this category.
 * @param {*} mongoClient A MongoDB client.
 */
module.exports = async function createGameCategory(role, guild, name, mongoClient) {
	await guild.channels.create(name, {
		type: 'category',
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
	}).then(category => {
		let servers = mongoClient.db('discordbot').collection('servers');
		let query = { id: guild.id };
		let update = {
			$push: {
				gameChannels: {
					name: category.name,
					type: 'category',
					id: category.id,
				},
			},
		};
		servers.updateOne(query, update);
	});
}