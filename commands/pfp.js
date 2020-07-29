const Discord = require('discord.js');
const cfg = require("../config/config.json");

module.exports = {
  name: 'ping',
  description: 'Ping the websocket!',
  async execute(client, msg) {
    let user;
    if (!args.join(" ")) {
        user = msg.author;
    } else {
        if (args.join(" ").toLowerCase() === `owner`) {
          user = msg.guild.owner.user;
        } else {
          user = msg.mentions.users.first() || await client.util.getUser(args.join(" "));
        }
        if (!user) return msg.channel.send(`I was unable to get the user's information.`);
    }
    const embed = client.resource.embed()
      .setDescription(user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }))
      .setImage(user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }))
    msg.channel.send(embed)
  },
};