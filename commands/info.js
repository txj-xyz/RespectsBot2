const humanizeDuration = require('humanize-duration')

//Formatting for bytes to KB/MB/GB
function formatBytes(bytes){
    if (bytes>=1000000000) {bytes=(bytes/1000000000).toFixed(2)+'GB';}
    else if (bytes>=1000000) {bytes=(bytes/1000000).toFixed(2)+'MB';}
    else if (bytes>=1000) {bytes=(bytes/1000).toFixed(2)+'KB';}
    else if (bytes>1) {bytes=bytes+' bytes';}
    else if (bytes==1) {bytes=bytes+' byte';}
    else {bytes='0 byte';}
    return bytes;
}

module.exports = {
	name: 'info',
	description: 'Returns process information on the bot like uptime, guilds etc.',
	async execute(client, msg) {
        let loading = await msg.channel.send(client.resource.loading())
        let msgCount = await client.database.collection('messages').countDocuments()
        
        //Get total respect count
        let allEntries = await client.database.collection('guilds').find({}).toArray()
        //Again set base total to the entry BEFORe I moved to a DB.
        let total = 57548;
        allEntries.forEach(e => { total += e.fcount })

        loading.edit(client.resource.embed()
        .setTitle('Statistics')
        .setColor('#fcebb3')
        .setTimestamp()
        .setFooter(`Uptime: ${humanizeDuration(client.uptime)}`)

        .addField('Users', `\`${client.guilds.cache.reduce((total,guild) => total + guild.memberCount, 0)}\``, true)
        .addField('Guilds', `\`${client.guilds.cache.size}\``, true)
        .addField('Language', '`NodeJS`', true)

        .addField('RAM Used', `\`${formatBytes(process.memoryUsage().rss)}\``, true)
        .addField('Ping', `\`${client.ws.ping}ms\``, true)
        .addField('Messages', `**${msgCount.toLocaleString()}**`, true)

        .addField('🇫 Ratelimit', `\`1000ms\``, true)
        .addField('Developer', '`TXJ#0001`', true)
        .addField('Total Respects', `**${total.toLocaleString()}**`, true)
        
        //.addField('Shards', `\`${parseInt(client.options.shards) + 1}\``, true)
        )
	},
};