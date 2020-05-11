const Discord = require('discord.js')
const cfg = require("../config/config.json")

module.exports = {
	name: 'restart',
	description: 'Restart the bot with this command',
	execute(msg) {
        msg.channel.send(`Restarting, please wait`)
        process.exit(1);
	},
};