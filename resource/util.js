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
    }
};