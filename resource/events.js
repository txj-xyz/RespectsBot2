
module.exports = (client, cfg, dbl, mongo, util, blacklist) => {

    function connectDB() {
        return new Promise((resolve) => {
            mongo.connect(`mongodb://${cfg.database.host}:${cfg.database.port}`, async (err, data) => {
            if(err) return console.log('Error connecting to mongodb')
            resolve(data.db(cfg.database.db))
            })
        })
    }

    client.on('ready', async () => {
        //if(!client.database) return;
        client.database = await connectDB()
        await client.reloadCommands()
        setInterval(async () => {
            dbl.postStats(client.guilds.cache.size).catch(e => console.log(`Error posting stats: ${e}`))
        }, 1800000)
        client.user.setPresence({ activity: { type: 'LISTENING', name: `${client.guilds.cache.size} servers. | rb!help` } })
        console.log(`${client.user.username} has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds with ${client.commands.size} commands.`);
    })

    client.on("guildDelete", async (guild) => {
        gl.send(client.resource.leaveEmbed(guild));
        setTimeout(async () => {
            client.user.setPresence({ activity: { type: 'LISTENING', name: `${client.guilds.cache.size} servers. | rb!help` } })
        }, 2000)
    })

    client.on("guildCreate", async (guild) => {
        gl.send(client.resource.joinEmbed(guild));
        setTimeout(async () => {
            client.user.setPresence({ activity: { type: 'LISTENING', name: `${client.guilds.cache.size} servers. | rb!help` } })
        }, 2000)
    })

    client.on('message', async msg => {
        //if(!client.database) return; //hard stop all message events if the database is not connected
        await client.database;
        client.database.collection('messages').insertOne({guild_id: msg.guild.id, guild_name: msg.guild.name, username: msg.author.tag, userid: msg.author.id})
        
        if(msg.content.toLowerCase() === 'f' || msg.content.toLowerCase() === '🇫') return client.commands.get("f").execute(client, msg)
        
        const prefix = msg.content.substr(0, cfg.bot.prefix.length)
        if(prefix !== cfg.bot.prefix) return;
        const contentSplit = msg.content.substr(cfg.bot.prefix.length).replace(/[ ]/g, ' ').split(" ")
        const command = contentSplit[0].toLowerCase();
        const commandArgs = contentSplit.splice(1)
    
        try{
            client.resource.cmdUsedLogger(client, command, commandArgs, msg)
            const commandToRun = client.commands.get(command)
            if(!commandToRun) return
            else return commandToRun.execute(client, msg, commandArgs);
        }catch(e){
            msg.reply(`\`\`\`js\n${util.inspect(e)}\`\`\``)
            console.log(`Error with executing command:\n`, e)
            client.resource.cmdErrLogger(client, e, util);
        }
    })
};