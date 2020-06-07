const Discord = require('discord.js')
const config = require("../config/config.json")
const util = require('util')

module.exports = {
	name: 'eval',
	description: 'Runs javascript as the discord bot client.',
	async execute(client, msg, args) {
		let code = args.join(" ");
        const embed = new Discord.MessageEmbed();
        if(msg.content === "rb!eval 9+10") return msg.channel.send("21")
        if (msg.author.id !== config.botinfo.ownerid) return;
        
        if (!code) {
            return msg.reply(`No input provided`);
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
        catch (e) {
            client.resource.cmdErrLogger(client, e, util);
            console.log(e.stack)
            embed
                .addField(`📥 Input`, `\`\`\`\n${code}\n\`\`\``)
                .addField(`📤 Output`, `\`\`\`js\n${e}\n\`\`\``)
                .addField(`Status`, `Failed`);
            return msg.channel.send(embed);
        }
        
        function clean(text) {
            if (typeof text !== `string`)
                text = require(`util`).inspect(text, { depth: 0 })
            let rege = new RegExp(config.token, "gi");
            if(text == client.token) return text = "Here is your token: [REDACTED]"
            return text;
        }
	},
};