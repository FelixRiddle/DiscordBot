module.exports = {
	name: 'ready',
	once: true,
	execute(botName) {
		console.log(`Logged in as ${botName}!`);
		return;
	}
}