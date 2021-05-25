const fs = require('fs');
const Discord = require('discord.js');
const config = require('../config.json');
const path = require('path');
//const config = require(path.resolve('./', 'config.json'));

module.exports = {
	name: 'message',
	execute(eventName, message, client, ...args) {

		client.commands = new Discord.Collection();
		client.cooldowns = new Discord.Collection();

		console.log('Loading commands...');
		let commandsPath = path.resolve('./', 'commands');
		const commandFolders = fs.readdirSync(commandsPath);

		// Read all commands from commands folder
		for(const folder of commandFolders) {
			const commandFiles = fs.readdirSync(`${commandsPath}/${folder}`).filter(file => file.endsWith('.js'));
			for(const file of commandFiles) {
				const setCommand = require(`${commandsPath}/${folder}/${file}`);
				client.commands.set(setCommand.name, setCommand);
			}
		}
		
		// If the received message doesn't start with the prefix
		if(!message.content.startsWith(config.prefix) || args[0] === args[1]) {
			return;
		}
	
		console.log(message.content);
		args = message.content.slice(config.prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();
		console.log(message.content);
		
		// Check the command exists
		const command = client.commands.get(commandName)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		
		if(!command) {
			message.reply('That command doesn\'t exist!');
			return;
		}
	
		// Check commands cooldown
		const { cooldowns } = client;
	
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
			if(!authorPerms || authorPerms.has(command.permissions)) {
				return message.reply('You can\'t do this!');
			}
		}
	
		if(command.args && !args.length) {
			return message.channel.send(`You didn't provide any arguments, ${message.author}`);
		}
	
		try {
			console.log('Command executed!');
			command.execute(message, ...args);
		} catch(error) {
			console.error(error);
			message.reply('There was an error trying to execute that command!');
		}
	},
};