/** Creates a category with a given name and
 * denies permissions for everyone without this role
 * to view this category.
 * @param {*} roles An existing game role.
 * @param {*} guild The server/guild.
 * @param {*} name Name for this category.
 */
module.exports = async function createGameCategory(role, guild, name) {
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
	});
}