const insertUpdateDiscordServer = require('../../database/insertUpdateDiscordServer');
const insertUpdateUser = require('../../database/insertUpdateUser');
const Discord = require('discord.js');
const Canvas = require('canvas');
const path = require('path');

module.exports = async function guildMemberAdd(member, mongoClient) {
	await insertUpdateDiscordServer(member.guild, mongoClient);

	const collection = mongoClient.db('discordbot').collection('servers');

	try {
		// Find the welcomeChannelID field in the database
		let cursor = await collection.find( { id: member.guild.id } );
		let welcomeChannelID;
		
		await cursor.forEach(doc => {
			welcomeChannelID = doc.welcomeChannelID;
		});
		cursor.close();

		// Check if it was found
		if(welcomeChannelID !== null) {
			// Find the welcome channel in the guild/server
			let welcomeChannel = await member.guild.channels.cache.get(welcomeChannelID);

			// Create a 700x250 pixels canvas and get its context
			// The context will be used to modify the canvas
			const canvas = Canvas.createCanvas(768, 360);
			const context = canvas.getContext('2d');

			// Since the image takes time to load, you should await it
			const background = await Canvas.loadImage(path.resolve('./', 'images', 'wallpaper.jpg'));
			// This uses the canvas dimensions to stretch the image onto the entire canvas
			context.drawImage(background, 0, 0, canvas.width, canvas.height);

			// Place a border
			// Set the color of the stroke
			context.strokeStyle = '#74037b';
			// Draw a rectangle with the dimensions of the entire canvas
			context.strokeRect(0, 0, canvas.width, canvas.height);

			// Assign the decided font to the canvas
			context.font = applyText(canvas, member.displayName);
			context.fillStyle = '#ffffff';
			context.fillText(member.displayName, canvas.width / 2.5, canvas.height / 1.8);

			// Outline
			let text = 'Welcome to the creed, ';
			context.strokeStyle = 'black';
			context.lineWidth = 8;

			// Slightly smaller text placed above the member's display name
			context.font = '28px sans-serif';
			context.strokeText(text, canvas.width / 2.5, canvas.height / 3.5);
			context.fillStyle = 'white';
			context.fillText(text, canvas.width / 2.5, canvas.height / 3.5);

			// Add an exclamation point here and below
			context.font = applyText(canvas,`${member.displayName}`);
			let name = `${member.displayName}!`;
			context.strokeText(name, canvas.width / 2.5, canvas.height / 1.8);
			context.fillStyle = 'white';
			context.fillText(name, canvas.width / 2.5, canvas.height / 1.8);

			// Pick up the pen
			context.beginPath();
			// Start the arc to form a circle
			context.arc(125, 125, 100, 0, Math.PI * 2, true);
			// Put the pen down
			context.closePath();
			// Clip off the region you drew on
			context.clip();

			// Wait for Canvas to load the image
			const avatar = await Canvas.loadImage(member.user.displayAvatarURL( { format: 'jpg' } ));
			// Move the image downwards vertically and constrain its height to 200, so that it's square
			context.drawImage(avatar, 25, 25, 200, 200);

			// Use the helpful Attachment class structure to process the file for you
			const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.jpg');

			welcomeChannel.send(`Welcome to the server, ${member}!`, attachment);

			insertUpdateUser(member.id, mongoClient, member.user.username);
		} else {
			return;
		}
	} catch(err) {
		console.error(err);
	}
}

// Pass the entire Canvas object because you'll need access to its width and context
const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 70;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		context.font = `${fontSize -= 10}px sans-serif`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (context.measureText(text).width > canvas.width - 300);

	// Return the result to use in the actual canvas
	return context.font;
}