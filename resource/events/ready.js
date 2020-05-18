const Discord = require(`discord.js`);
const mongo = require("mongodb").MongoClient


module.exports = (client, cfg) => {
    function connectDB() {
        return new Promise((resolve) => {
            mongo.connect(`mongodb://${cfg.database.host}:${cfg.database.port}`, async (err, data) => {
            if(err) return console.log('Error connecting to mongodb')
            resolve(data.db(cfg.database.db))
            })
        })
    }

    client.on('ready', async () => {
        client.database = await connectDB()
        await loadCommands()
        console.log(`${client.user.username} has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds with ${client.commands.size} commands.`);
    })
};