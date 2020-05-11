const Discord = require('discord.js')
const cfg = require("../config/config.json")

module.exports = {
	name: 'ping',
	description: 'Ping the websocket!',
	execute(client, msg) {
		msg.channel.send(`Pong! ${client.ws.ping}ms`)
	},
};