const cfg = require('../config/config.json')

module.exports = {
	name: 'reload',
	description: 'Reload all commands with this!',
	execute(client, msg, args) {
		if(msg.author.id != cfg.botinfo.ownerid) return msg.reply("You are not authorized to use this command.")
		
		if(args.length === 0) { 
		  return msg.channel.send(`Reloaded Commands:\r\n\`\`\`\n${client.reloadCommands(args[0]).join('\n')}\`\`\``)
		} else { 
		  return msg.channel.send(`Reloaded Commands:\r\n\`\`\`\n${client.reloadCommands(args[0]).join('\n')}\`\`\``)
		}
	}
};