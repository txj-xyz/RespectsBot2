const cfg = require("../config/config.json")
const helpList = [];
const paginationEmbed = require('discord.js-pagination');

module.exports = {
	name: 'help',
	description: 'Shows all commands for the bot',
	async execute(client, msg) {
        if(helpList.length === 0) await client.commands.forEach(function(value, key) {
            helpList.push(`\`${cfg.bot.prefix}${key}\` - ${value.description}`)
        })
        

        const help1 = client.resource.embed()
            .setTitle('Respects Bot - Commands')
            .setColor('#ffff4f')
            .setTimestamp()
            .setDescription(
                `If you would like to pay your respects:tm: simply type "f" or type "rb!f"\n\n`
                + helpList.join('\n') + `\n\n`
                +`**Need more help? Join the support server [here](https://discord.gg/CSJkCGx) or with this link\n<https://discord.gg/CSJkCGx>**`
            )
        const help2 = client.resource.embed()
            .setTitle('Respects Bot - Commands')
            .setColor('#ffff4f')
            .setTimestamp()
            .setDescription(
                `**Music Commands** Enabled: ${cfg.botinfo.music_status}\n`
                +`\`${cfg.bot.prefix}[play, p]\` - Play/Resume Music from Youtube.\n`
                +`\`${cfg.bot.prefix}[queue, q]\` - Show the current music queue and what is currently playing.\n`
                +`\`${cfg.bot.prefix}[skip, s]\` - Skip the current song.\n`
                +`\`${cfg.bot.prefix}[volume, vol]\` - Change the volume of the bot on the fly.\n`
                +`\`${cfg.bot.prefix}pause\` - Pause the current song.\n`
                +`\`${cfg.bot.prefix}stop\` - Stop the current song.\n`
                +`\`${cfg.bot.prefix}remove\` - Remove a song from the music queue.\n\n`
                +`\`${cfg.bot.prefix}search\` - Search for a song on Youtube and click the reactions for the list!\n`
                +`**Need more help? Join the support server [here](https://discord.gg/CSJkCGx) or with this link\n<https://discord.gg/CSJkCGx>**`
            )
                
        pages = [
            help1,
            help2
        ];
        client.resource.embed(
            paginationEmbed(msg, pages)
        )
	},
};