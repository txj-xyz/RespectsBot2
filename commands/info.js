const Discord = require('discord.js')
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
	execute(client, msg) {
        msg.channel.send(
            new Discord.MessageEmbed()
            .setTitle('Statistics')
            .setColor('#fcebb3')
            .setTimestamp()
            .setFooter(msg.author.tag)
            .addField('Users', `\`${client.users.cache.size}\``, true)
            .addField('Guilds', `\`${client.guilds.cache.size}\``, true)
            .addField('Language', '`NodeJS`', true)
            .addField('RAM', `\`${formatBytes(process.memoryUsage().rss)}\`/\`8GB\``, true)
            //.addField('Shards', `\`${parseInt(client.options.shards) + 1}\``, true)
            .addField('Ping', `\`${client.ws.ping}ms\``, true)
            .addField('Uptime', `\`${humanizeDuration(client.uptime)}\``, true)
            .addField('Developer', '`TXJ#0001`', true)
        )
	},
};