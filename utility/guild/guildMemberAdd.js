const insertUpdateDiscordServer = require('../../database/insertUpdateDiscordServer');
const insertUpdateUser = require('../../database/insertUpdateUser');
const Discord = require('discord.js');

module.exports = async function guildMemberAdd(member, mongoClient) {
	await insertUpdateDiscordServer(member.guild, mongoClient);
	const collection = mongoClient.db('discordbot').collection('servers');

	try {
		// Find the welcomeChannelID field in the database
		let welcomeChannelID;
		let cursor = await collection.find( { id: member.guild.id } );
		await cursor.forEach(doc => {
			welcomeChannelID = doc.welcomeChannelID;
		});

		// Check if it was found
		if(welcomeChannelID !== null) {
			// Find the welcome channel in the guild/server
			let welcomeChannel = await member.guild.channels.cache.get(welcomeChannelID);

			await welcomeChannel.send(new Discord.MessageEmbed()
				.setColor('#00FF00')
				.setThumbnail(member.user.displayAvatarURL())
				.setTitle('**' + member.user.username + '**, has joined the server!'))
				.catch(err => {
					console.log(err);
				});
			
			await insertUpdateUser(member.id, mongoClient, member.user.username);
		} else {
			console.log(`Could not retrieve the guild id from the database.`)
		}
	} catch(err) {
		console.error(err);
	}
}