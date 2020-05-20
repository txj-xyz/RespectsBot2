const Discord = require('discord.js'),
cfg = require("./config/config.json"),
fs = require('fs'),
DBL = require("dblapi.js"),
blacklist = require("./config/blacklist.json"),
mongo = require("mongodb").MongoClient,
client = new Discord.Client(),
dbl = new DBL(cfg.bot.dblToken, client),
util = require('util'),
commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.commands = new Discord.Collection();
client.resource = require("./resource/embeds.js")

require("./resource/events.js")(client, cfg, dbl, mongo, util, blacklist)
require("./resource/reloadcmd.js")(client, commandFiles)

client.login(cfg.bot.token)