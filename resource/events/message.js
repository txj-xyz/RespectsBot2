const util = require('util');

module.exports = (client, cfg) => {
    client.on('message', async msg => {

        await client.database;
        client.database.collection('messages').insertOne({guild_id: msg.guild.id, guild_name: msg.guild.name, username: msg.author.tag, userid: msg.author.id})
    
        if(msg.content.toLowerCase() === 'f' || msg.content.toLowerCase() === '🇫') return client.commands.get("f").execute(client, msg)
    
        const prefix = msg.content.substr(0, cfg.bot.prefix.length)
        if(prefix !== cfg.bot.prefix) return;
        const contentSplit = msg.content.substr(cfg.bot.prefix.length).replace(/[ ]/g, ' ').split(" ")
        const command = contentSplit[0].toLowerCase();
        const commandArgs = contentSplit.splice(1)
    
        try{
            client.channels.cache.get(cfg.botinfo.command_log_channel).send(client.resource.cmdUsedEmbed(command, msg, commandArgs))
            const commandToRun = client.commands.get(command)
            if(!commandToRun) return
            else return commandToRun.execute(client, msg, commandArgs);
        }catch(e){
            msg.reply(`\`\`\`js\n${util.inspect(e)}\`\`\``)
            console.log(`Error with executing command:\n`, e)
            client.channels.cache.get(cfg.botinfo.error_channel).send(`\`\`\`js\n${util.inspect(e)}\`\`\``);
        }
    })
};