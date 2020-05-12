const Discord = require('discord.js')
const cfg = require("../config/config.json")

module.exports = {
	name: 'vote',
	description: 'Vote for the bot and support me!',
	execute(client, msg) {
		msg.reply(`https://top.gg/bot/468171246018756609/vote`)
	},
};