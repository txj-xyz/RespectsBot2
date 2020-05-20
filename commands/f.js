const limiter = new Set();
const blacklist = require("../config/blacklist.json")

module.exports = {
	name: 'f',
	description: 'Pay your respects!',
	async execute(client, msg) {
        console.log(`Command: F\n`, `Guild ID: [${msg.guild.id}]\n`, `Guild Name: [${msg.guild.name}]\n`, `Username: ${msg.author.tag}`)
        if(!client.database) return msg.reply('Error: Database not connected! Please contact TXJ#0001')

        let guildEntry = await client.database.collection('guilds').findOne({guild_id: msg.guild.id})
        let fcount = 0
        if(!guildEntry) {
            await client.database.collection('guilds').insertOne({
                guild_id: msg.guild.id,
                guild_name: msg.guild.name,
                fcount: 1
            })
            fcount = 1
        } else {
            await client.database.collection('guilds').updateOne({
                guild_id: msg.guild.id
            }, {
                $set: {
                    guild_name: msg.guild.name,
                    fcount: guildEntry.fcount + 1
                }
            })
            fcount = guildEntry.fcount + 1
        }

        let allEntries = await client.database.collection('guilds').find({}).toArray()
        let total = 57548;
        allEntries.forEach(e => { total += e.fcount })

        if(blacklist.users.includes(msg.author.id) || blacklist.guilds.includes(msg.guild.id)) return;
        if(!msg.channel.permissionsFor(client.user.id).has("SEND_MESSAGES")) return;
        if(limiter.has(msg.author.id)) return;

        msg.channel.send(
            client.resource.embed()
            .setTitle('Respect Found')
            .setDescription(`<@${msg.author.id}> has paid their respects. :pray: :regional_indicator_f:`)
            .setColor('#003cff')
            .setTimestamp()
            .addField('Server Respects', `\`${fcount}\``, true)
            .addField('Total Respects', `\`${total}\``, true)
        )
        limiter.add(msg.author.id);
        setTimeout(() => { limiter.delete(msg.author.id); }, 1000);
	},
};