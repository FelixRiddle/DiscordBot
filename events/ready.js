module.exports = {
	name: 'ready',
	once: true,
	execute(discordClient) {
		try {
			console.log(`Logged in as ${discordClient.user.tag}!`);
		} catch(err) {
			console.log(`There was a little error, but it doesn't matter :D`);
		}
	}
}