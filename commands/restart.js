const Discord = require('discord.js')
const util = require('util');

module.exports = {
	name: 'restart',
	description: 'Restart the bot with this command',
	execute(msg) {
		msg.reply("Shutting down, please wait.")
		.catch(e => msg.author.send(
			new Discord.MessageEmbed()
				.setColor('#ff0000')
				.setTimestamp()
				.addField('Error Dump', `\`\`\`${util.inspect(e)}\`\`\``, false)
				.addField('Channel ID', `\`${msg.channel.id}\``, false)
				.addField('Guild ID', `\`${msg.guild.id}\``, false)
				.addField('User Requested', `\`${msg.author.tag}\``, false)
				.addField('User ID', `\`${msg.author.id}\``, false)
		))
		setTimeout(async () => {
			process.exit(1)
		}, 1000);
	},
};