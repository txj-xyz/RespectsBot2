const Discord = require('discord.js')
const cfg = require("./config/config.json")
const fs = require('fs');
const DBL = require("dblapi.js")
const blacklist = require("./config/userblocklist.json")

const client = new Discord.Client()
const dbl = new DBL(cfg.bot.dblToken, client)

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.commands = new Discord.Collection();
client.resource = require("./resource/embeds.js")


require("./resource/events/ready.js")(client, cfg, dbl)
require("./resource/events/message.js")(client, cfg)
require("./resource/events/guildCreate.js")(client, cfg)
require("./resource/events/guildDelete.js")(client, cfg)
require("./resource/command/loadFunc.js")(client, commandFiles, blacklist)
require("./resource/command/reloadFunc.js")(client, commandFiles)

client.login(cfg.bot.token)