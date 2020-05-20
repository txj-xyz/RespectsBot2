const Discord = require(`discord.js`);
const cfg = require('../config/config.json')
module.exports = (client) = {
    
    embed(color) {
        const embed = new Discord.MessageEmbed()
        .setTimestamp()
        if (color) {
            embed
            .setColor(`${color}`)
        }
        return embed;
    },
    loading(){
        const embed = new Discord.MessageEmbed().setTitle(`Loading... <a:loading:712019804503933059>`);
        return embed
    },
    leaveEmbed(guild){
        const embed = new Discord.MessageEmbed()
        .setColor('#ff0000')
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
        .setDescription(
        `**${command}** command used.\n\n`+
        `**Args: \`${commandArgs}\`\n`+
        `**Command**: \`${command}\`\n`+
        `**User**: \`${msg.author.tag}\`\n`+
        `**User ID**: \`${msg.author.id}\`\n`+
        `**Channel ID**: \`${msg.channel.id}\``)
        return embed
    },
    cmdErrLogger(client, e, util){
        client.channels.cache.get(cfg.botinfo.error_channel).send(
            new Discord.MessageEmbed()
            .setColor('#d2eb34')
            .setTitle("Command Error")
            .setDescription(`\`\`\`js\n${util.inspect(e)}\`\`\``)
        );
    },
    cmdUsedLogger(client, command, commandArgs, msg){
        client.channels.cache.get(cfg.botinfo.command_log_channel).send(
            new Discord.MessageEmbed()
            .setColor('#d2eb34')
            .setDescription(
            `**${command}** command used.\n\n`+
            `**Args: \`${commandArgs}\`\n`+
            `**Command**: \`${command}\`\n`+
            `**User**: \`${msg.author.tag}\`\n`+
            `**User ID**: \`${msg.author.id}\`\n`+
            `**Channel ID**: \`${msg.channel.id}\``)
        );
    }
};