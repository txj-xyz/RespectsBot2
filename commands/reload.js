module.exports = {
	name: 'reload',
	description: 'Reload all commands with this!',
	execute(client, msg, args) {
    console.logs
		if(args.length === 0) { 
		  const commandsReloaded = client.reloadCommands()
		  return msg.channel.send(`Reloaded Commands:\r\n\`\`\`\n${commandsReloaded.join('\n')}\`\`\``)
		} else { 
		  const commandsReloaded = client.reloadCommands(args[0]) 
		  console.log(commandsReloaded)
		  return msg.channel.send(`Reloaded Commands:\r\n\`\`\`\n${commandsReloaded.join('\n')}\`\`\``)
		}
	}
};