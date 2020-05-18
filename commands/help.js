const Discord = require('discord.js')
const cfg = require("../config/config.json")

module.exports = {
	name: 'help',
	description: 'Shows all commands for the bot',
	execute(client, msg) {
                msg.reply(
                        new Discord.MessageEmbed()
                        .setTitle('Respects Bot - Commands')
                        .setColor('#ffff4f')
                        .setTimestamp()
                        .setDescription(
                        `If you would like to pay your respects:tm: simply type "f" or type "rb!f"\n\n`
                        +`\`${cfg.bot.prefix}ping\` - Ping the websocket!\n`
                        +`\`${cfg.bot.prefix}info\` - Returns process information on the bot like uptime, guilds etc.\n`
                        +`\`${cfg.bot.prefix}vote\` - Vote for the bot and support me!\n`
                        +`\`${cfg.bot.prefix}help\` - Shows this page!\n`
                        +`\`${cfg.bot.prefix}invite\` - Invite the bot to your server with this command, or [click here](\`${cfg.botinfo.invite_url}\`)\n\n`
                        +`**Music Commands** Enabled: ${cfg.botinfo.music_status}\n`
                        +`\`${cfg.bot.prefix}[play, p]\` - Play/Resume Music from Youtube.\n`
                        +`\`${cfg.bot.prefix}[queue, q]\` - Show the current music queue and what is currently playing.\n`
                        +`\`${cfg.bot.prefix}[skip, s]\` - Skip the current song.\n`
                        +`\`${cfg.bot.prefix}[volume, vol]\` - Change the volume of the bot on the fly.\n`
                        +`\`${cfg.bot.prefix}pause\` - Pause the current song.\n`
                        +`\`${cfg.bot.prefix}stop\` - Stop the current song.\n`
                        +`\`${cfg.bot.prefix}remove\` - Remove a song from the music queue.\n\n`
                        +`**Need more help? Join the support server [here](https://discord.gg/CSJkCGx) or with this link\n<https://discord.gg/CSJkCGx>**`
                        )
                        .setFooter(`Owner: ${cfg.botinfo.owner}`)
                )
	},
};