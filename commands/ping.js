const Discord = require('discord.js');
const cfg = require("../config/config.json");

module.exports = {
    name: 'ping',
    description: 'Ping the websocket!',
    async execute(client, msg) {
		const embed = new Discord.MessageEmbed().setDescription(`Loading response...`).setTimestamp()
		let loading = await msg.channel.send(embed);
		embed.setDescription(`🏓 Pong! ${client.ws.ping}ms`)

		await loading.edit(embed);
    },
};