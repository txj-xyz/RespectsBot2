const Discord = require(`discord.js`);

module.exports = {
    //Setup embed structure here for base layout after edit.
    embed(color) {
        const embed = new Discord.MessageEmbed()
        if (color) {
            embed.setColor(`${color}`)
        }
        return embed;
    },
    loading(){
        const embed = new Discord.MessageEmbed().setTitle(`Loading...`);
        return embed
    },
    leaveEmbed(guild){
        const embed = new Discord.MessageEmbed()
        .setColor('#26ff00')
        .setTimestamp()
        .setTitle(`Left Guild!`)
        .addField(`Guild Name`, guild.name, false)
        .addField(`Guild ID`, guild.id, false)
        .addField(`Member Count`, guild.memberCount - 1, true)
        .addField("Humans", `${guild.members.cache.filter(member => !member.user.bot).size} `, true)
        .addField("Bots", `${guild.members.cache.filter(member => member.user.bot).size}` - 1, true)
        .addField(`Owner`, `${guild.owner.user.tag}[${guild.owner.id}]`, false)
        return embed
    },
    joinEmbed(guild){
        const embed = new Discord.MessageEmbed()
        .setColor('#26ff00')
        .setTimestamp()
        .setTitle(`Join Guild!`)
        .addField(`Guild Name`, guild.name, false)
        .addField(`Guild ID`, guild.id, false)
        .addField(`Member Count`, guild.memberCount - 1, true)
        .addField("Humans", `${guild.members.cache.filter(member => !member.user.bot).size} `, true)
        .addField("Bots", `${guild.members.cache.filter(member => member.user.bot).size}` - 1, true)
        .addField(`Owner`, `${guild.owner.user.tag}[${guild.owner.id}]`, false)
        return embed
    },
    cmdUsedEmbed(command, msg, commandArgs){
        const embed = new Discord.MessageEmbed()
        .setColor('#d2eb34')
        .setTimestamp()
        .setDescription(
        `**${command}** command used.\n\n`+
        //`**Args: \`${commandArgs}\`\n`+
        `**Command**: \`${command}\`\n`+
        `**User**: \`${msg.author.tag}\`\n`+
        `**User ID**: \`${msg.author.id}\`\n`+
        `**Channel ID**: \`${msg.channel.id}\``)
        return embed
    }
};