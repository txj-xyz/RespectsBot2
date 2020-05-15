const Discord = require('discord.js')
const cfg = require("../config/config.json")
const util = require("util")

module.exports = {
	name: 'f',
	description: 'Pay your respects!',
	async execute(client, msg) {
        if(!client.database) return msg.reply('Error: Database not connected! Please contact TXJ#0001')
        let guildEntry = await client.database.collection('guilds').findOne({guild_id: msg.guild.id})
        let fcount = 0
        if(!guildEntry) {
            await client.database.collection('guilds').insertOne({ guild_id: msg.guild.id, fcount: 1 })
            fcount = 1
        } else {
            await client.database.collection('guilds').updateOne({
                guild_id: msg.guild.id
            }, {
                $set: { fcount: guildEntry.fcount + 1 }
            })
            fcount = guildEntry.fcount + 1
        }

        let allEntries = await client.database.collection('guilds').find({}).toArray()
        let total = 0;
        allEntries.forEach(e => { total += e.fcount })
        let loading = await msg.channel.send(client.resource.loading())
        loading.edit(client.resource.embed()
            .setTitle('Respect Found')
            .setDescription(`<@${msg.author.id}> has paid their respects. :pray: :regional_indicator_f:`)
            .setColor('#003cff')
            .setTimestamp()
            .addField('Server Respects', `\`${fcount}\``, true)
            .addField('Total Respects', `\`${total}\``, true)
        );
        // msg.channel.send(
        //     client.resource.embed()
        //         .setTitle('Respect Found')
        //         .setDescription(`<@${msg.author.id}> has paid their respects. :pray: :regional_indicator_f:`)
        //         .setColor('#003cff')
        //         .setTimestamp()
        //         .addField('Server Respects', `\`${fcount}\``, true)
        //         .addField('Total Respects', `\`${total}\``, true)
        // ).catch(e => client.channels.cache.get(cfg.botinfo.error_channel).send( 
        //     client.resource.embed()
        //         .setColor('#ff0000')
        //         .setTimestamp()
        //         .addField('Error Dump', `\`\`\`${util.inspect(e)}\`\`\``, false)
        //         .addField('Channel ID', `\`${msg.channel.id}\``, false)
        //         .addField('Guild ID', `\`${msg.guild.id}\``, false)
        //         .addField('User Requested', `\`${msg.author.tag}\``, false)
        //         .addField('User ID', `\`${msg.author.id}\``, false)
        // ))
	},
};