const Discord = require('discord.js')
const util = require('util');
const cfg = require("../config/config.json")

module.exports = {
	name: 'restart',
	description: 'Restart the bot with this command',
	execute(_, msg) {
		msg.channel.send({ embed : { description: `Shutting down, please wait 2 seconds and retry your commands...` } })
		setTimeout(async () => {
			process.exit(1)
		}, 1000);
	},
};