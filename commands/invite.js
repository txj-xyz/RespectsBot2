const Discord = require('discord.js')
const cfg = require("../config/config.json")

module.exports = {
	name: 'invite',
	description: `Invite the bot to your server with this command!`,
	async execute(client, msg) {
			let loading = await msg.channel.send(client.resource.loading())
			loading.edit(client.resource.embed()
			.setDescription(`Invite the bot to your server with this link!\n<${cfg.botinfo.invite_url}>`)
		);
	},
};