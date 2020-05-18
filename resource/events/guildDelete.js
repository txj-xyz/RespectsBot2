module.exports = (client, cfg) => {

    client.on("guildDelete", async (guild) => {
        client.channels.cache.get(cfg.botinfo.guild_log_channel).send(client.resource.leaveEmbed(guild));
        setTimeout(async () => {
            client.user.setPresence({ activity: { type: 'LISTENING', name: `${client.guilds.cache.size} servers. | rb!help` } })
        }, 2000)
    })
};