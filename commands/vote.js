const Discord = require('discord.js')
const cfg = require("../config/config.json")
const DBL = require("dblapi.js")
const util = require('util')
module.exports = {
	name: 'vote',
	description: 'Vote for the bot and support me!',
	execute(client, msg) {
		const dbl = new DBL(cfg.bot.dblToken, client)
		dbl.getBot("468171246018756609").then(bot => {
			msg.channel.send({ embed : { description: `Total Votes: ${bot.points}\nMonthly Votes: ${bot.monthlyPoints}\n\nVote here: https://top.gg/bot/468171246018756609/vote` } })
		});
		//msg.reply(`https://top.gg/bot/468171246018756609/vote`)
	},
};