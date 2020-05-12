const Discord = require('discord.js')
const cfg = require("../config/config.json")

module.exports = {
	name: 'invite',
	description: `Invite the bot to your server with this command!`,
	execute(client, msg) {
		msg.reply(`${cfg.botinfo.invite_url}`)
	},
};