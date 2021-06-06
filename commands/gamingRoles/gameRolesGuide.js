const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
  name: 'gameRolesGuide',
  description: `Add a game role to the collection.`,
  permissions: 'ADMINISTRATOR',
  aliases: ['gamerolesguide', 'gameroleguide', 'gamerolehelp'],
  cooldown: 5,
  async execute(message, messageArgs, mongoClient) {
		if(!messageArgs.length) {
			let data = [];
			data.push('This is a short guide for creating and managing roles with this bot:');
			data.push('First you have to create the roles with one of the following commands');
			data.push('\`\`\`' + config.prefix + 'addGameRole <RoleName>\`\`\`');
			data.push('\`\`\`' + config.prefix + 'setGameRole <RoleName>\`\`\`');
			data.push('Note that "setGameRole" overrides all roles and creates a new.\n');
			data.push('Also you can add more arguments like amount of text channels and');
			data.push('amount of voice channels, these channels will be created automatically');
			data.push('later on with the command createGameChannels.\n');
			data.push('The first argument is a text channel and the second argument are voice');
			data.push('channels.\n');
			data.push('**Usage**: ' + config.prefix + 'addGameRole <RoleName> <Textchannels amount> <Voice amount>');
			data.push('Note: Don\'t put < or > in the arguments, do it like the example below.\n');
			data.push('**Example**: \`\`\`' + config.prefix + 'addGameRole Dota 1 3\`\`\`');
			data.push('In the example above, we create a role with the name "Dota" and we assign');
			data.push('1 text channels, and 3 voice channels.\n');
			data.push('When creating the channels they are assigned to a new category with the');
			data.push('name of the role by default.');

			let randomColor = Math.floor(Math.random()*16777215).toString(16);

			// inside a command, event listener, etc.
			const exampleEmbed = new Discord.MessageEmbed()
				.setColor('#' + randomColor)
				.setTitle('Roles guide(Page 1)')
				.setDescription(data)
				.setFooter(`Use ${config.prefix}gameRolesGuide 2 to read the next page.`);
			
			message.reply(exampleEmbed);
		} else if(messageArgs[0] == 2) {
			let data = [];
			data.push('Now that the roles are set up in the database is time to create them,');
			data.push('start by executing this command:');
			data.push(`\`\`\`${config.prefix}createGameRoles\`\`\``);
			data.push('This will create the roles in your server to use them later on.\n');
			data.push('Once your roles are created let\'s create the channels,');
			data.push('for that use this command:');
			data.push(`\`\`\`${config.prefix}createGameChannels\`\`\``);
			data.push(`That you obviously have guessed, it creates the channels for the roles.\n`);
			data.push(`Now only the people with those roles will be able to view the channels.`)

			let randomColor = Math.floor(Math.random()*16777215).toString(16);

			// inside a command, event listener, etc.
			const exampleEmbed = new Discord.MessageEmbed()
				.setColor('#' + randomColor)
				.setTitle('Roles guide(Page 2)')
				.setDescription(data);
			
			message.reply(exampleEmbed);
		}
	}
}