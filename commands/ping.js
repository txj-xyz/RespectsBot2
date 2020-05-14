const Discord = require('discord.js');
const cfg = require("../config/config.json");

module.exports = {
  name: 'ping',
  description: 'Ping the websocket!',
  async execute(client, msg) {
    let loading = await msg.channel.send(client.resource.loading())
    
    loading.edit(client.resource.embed()
      .setTitle(`Success`)
      .setDescription(`🏓 Pong! ${client.ws.ping}ms`)
    );
  },
};