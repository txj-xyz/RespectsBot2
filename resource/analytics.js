module.exports = (client) = {
    async msgLogger(client, msg){
        client.database.collection('messages').insertOne({
            guild_id: msg.guild.id,
            guild_name: msg.guild.name,
            username: msg.author.tag,
            userid: msg.author.id
        })
    },
    async analyticsQuery(client, commandToRun){
        const commandStats = await client.database.collection('analytics').findOne({command: commandToRun.name})
        if(!commandStats) {
            await client.database.collection('analytics').insertOne({
                command: commandToRun.name,
                commandCount: 1
            })
        } else {
            await client.database.collection('analytics').updateOne({
                command: commandToRun.name
            }, {
                $set: {
                    commandCount: commandStats.commandCount + 1
                }
            })
        }
    }
};