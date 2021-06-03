const Discord = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const config = require('../../config.json');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 3000, // 300 seconds
	execute(message, messageArgs) {
		const data = [];
		const { commands } = message.client;

		// This means, if the user didn't ask for help on a specific command
		if(!messageArgs.length) {
			// Create an array with all the commands and some info
			data.push(commands.map(command => ' **$' + command.name + '**: ' + command.description).join('\n'));
			data.push(`\nYou can send \`${config.prefix}help [command name]\` to get info on a specific command!`);
			
				// inside a command, event listener, etc.
			return message.member.send(new Discord.MessageEmbed()
				.setColor('#FF0000')
				.setTitle('Here\'s a list of all my commands:')
				.setDescription(data))
				.catch(err => {
					console.log(err);
					message.reply(`There was an error when trying to retrieve the commands.`);
				});
		} else {
			// If the user put a command as an argument
			const name = messageArgs[0].toLowerCase();
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

			if(!command) {
				return message.reply('That\'s not a valid command!');
			}

			data.push(`**Name:** ${command.name}`);

			if(command.aliases) {
				data.push(`**Aliases:** ${command.aliases.join(', ')}`);
			}
			if(command.description) {
				data.push(`**Description:** ${command.description}`);
			}
			if(command.usage) {
				data.push(`**Usage:** ${config.prefix}${command.name} ${command.usage}`);
			}

			data.push(`**Cooldown:** ${command.cooldown || 0} second(s)`);

			message.channel.send(new Discord.MessageEmbed()
				.setColor('#FF0000')
				.setTitle('Here\'s a list of all my commands:')
				.setDescription(data));
		}
	},
};