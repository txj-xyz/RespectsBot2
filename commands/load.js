const cfg = require('../config/config.json')

module.exports = {
	name: 'load',
	description: 'Load up commands with this!',
	async execute(client, msg, args) {
		if(msg.author.id != cfg.botinfo.ownerid) return msg.reply("You are not authorized to use this command.")
        
        let loading = await msg.channel.send(client.resource.loading())
        await client.loadCommands();

		loading.edit(client.resource.embed()
            .setTitle(`Success Loaded`)
            .setDescription(`Loaded all commands.`)
        );
	}
};