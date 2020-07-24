const cfg = require("../config/config.json")
const helpList = [];

module.exports = {
	name: 'help',
	description: 'Shows all commands for the bot',
	async execute(client, msg) {
        if(helpList.length === 0) await client.commands.forEach(function(value, key) {
            helpList.push(`\`${cfg.bot.prefix}${key}\` - ${value.description}`)
        })
        
        let loading = await msg.channel.send(client.resource.loading())
        loading.edit(client.resource.embed()
        .setTitle('Respects Bot - Commands')
        .setColor('#ffff4f')
        .setTimestamp()
        .setDescription(
            `If you would like to pay your respects:tm: simply type **"f"** or type **"rb!f"**\n\n`
            + [...client.commands.keys()].join('**\n**')
            + `\n\n`
            +`**Need more help? Join the support server [here](https://discord.gg/CSJkCGx) or with this link\n<https://discord.gg/CSJkCGx>**`
        ))
	},
};