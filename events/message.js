const Discord = require('discord.js');
const config = require('../config.json');
const checkCommandChannels = require('../database/commandChannels/checkCommandChannels');

module.exports = {
	name: 'message',
	async execute(message, commands, cooldowns, mongoClient, ...args) {
		// Get args
		messageArgs = message.content.slice(config.prefix.length).trim().split(/ +/);
		const commandName = messageArgs.shift().toLowerCase();

		// Check if there are command channels in the database and if this command was sent in one of them
		let result = await checkCommandChannels(message, mongoClient);
		if(!result) {
			return;
		}

		// Check the command exists
		const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if(!command) {
			message.reply('That command doesn\'t exist!');
			return;
		}
		
		// If the received command wasn't send by the bot
		if(message.author.id === args[1]) {
			return;
		}
		
		// Check commands cooldown
		if(!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Discord.Collection());
		}
	
		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 100;
	
		if(timestamps.has(message.author.id)) {
			let expirationTime = timestamps.get(message.author.id) + cooldownAmount;
	
			if(now < expirationTime) {
				let timeLeft = (expirationTime - now) / 1000;
				return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the\`${command.name}\` command.`)
			}
		}
	
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		
		if(command.guildOnly && message.channel.type == 'dm') {
			return message.reply(`I can't execute that command inside DMs!`);
		}
		
		// Check for permissions
		if(command.permissions) {
			const authorPerms = message.channel.permissionsFor(message.author);
			if(!authorPerms || !authorPerms.has(command.permissions)) {
				return message.reply('You can\'t do this!');
			}
		}
		
		// Check if the command requires argument and they didn't provide any
		if(command.args && !messageArgs.length) {
			return message.channel.send(`You didn't provide any arguments, ${message.author}`);
		}

		try {
			command.execute(message, messageArgs, mongoClient, args);
		} catch(err) {
			console.log(err);
			message.reply('There was an error trying to execute that command!');
		}
	},
};