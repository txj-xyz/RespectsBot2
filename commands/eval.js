const Discord = require('discord.js')
const config = require("../config/config.json")

module.exports = {
	name: 'eval',
	description: 'Runs javascript as the discord bot client.',
	async execute(client, msg, args) {
		console.log(msg)
		let code = args.join(" ");
        const embed = new Discord.MessageEmbed();
        if (msg.author.id !== `189238841054461952`) {
            return msg.reply(`You are not approved to use this`)
        }
        
        if (!code) {
            return msg.reply(`No input provided`);
        }

        if (code.toLowerCase().includes(`api`) || code.toLowerCase().includes(`config`)) {
            return msg.reply(`You do not want to do this!\nA word has triggered the eval command to terminate!`)
        }

        try {
            let evaled = clean(await eval(code)),
                output;
            if (evaled.constructor.name === `Promise`) {
                output = `📤 Output (Promise)`;
            } else {
                output = `📤 Output`;
            }
            if (evaled.length > 800) {
                evaled = evaled.substring(0, 800) + `...`;
            }
            embed
                .addField(`📥 Input`, `\`\`\`\n${code}\n\`\`\``)
                .addField(output, `\`\`\`js\n${evaled}\n\`\`\``)
                .addField(`Status`, `Success`);
            return msg.channel.send(embed);
        }
        catch (err) {
            console.log(err.stack)
            embed
                .addField(`📥 Input`, `\`\`\`\n${code}\n\`\`\``)
                .addField(`📤 Output`, `\`\`\`js\n${err}\n\`\`\``)
                .addField(`Status`, `Failed`);
            return msg.channel.send(embed);
        }
        
        function clean(text) {
            if (typeof text !== `string`)
                text = require(`util`).inspect(text)
            let rege = new RegExp(config.token, "gi");
            // text = text
            //     .replace(/`/g, `\`` + String.fromCharCode(8203))
            //     .replace(/@/g, `@` + String.fromCharCode(8203))
            //     .replace(rege, `For security reasons I cannot show this.`)
            return text;
        }
	},
};