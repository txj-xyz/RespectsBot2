const Discord = require('discord.js')
const cfg = require("./config/config.json")
const blacklist = require("./config/userblocklist.json")
const fs = require('fs');
const util = require('util');
const DBL = require("dblapi.js")

const client = new Discord.Client()
const dbl = new DBL(cfg.bot.dblToken, client)

client.resource = require("./resource/embeds.js")
client.commands = new Discord.Collection();


//Mongo initilization
const mongo = require("mongodb").MongoClient

//connect over to mongo and fufil the Promise()
function connectDB() {
  return new Promise((resolve, reject) => {
    mongo.connect(`mongodb://${cfg.database.host}:${cfg.database.port}`, async (err, data) => {
      if(err) return console.log('Error connecting to mongodb')
      resolve(data.db(cfg.database.db))
    })
  })
}

//Load in <command>.js files and map to client.commands.
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Load command functions (run on start)
async function loadCommands () {
  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    console.log(`Loading command: ${command.name} - ${command.description}`)
    client.commands.set(command.name, command);
  }
}

// Reload commands
function reloadCommands (fileName) {
  const commandsReloaded = []
  for (const file of commandFiles) {
    // Check if the file name is correct regardless of extension.
    if (!fileName) {
      eval(`delete require.cache[require.resolve('${process.cwd().replace(/[\\]/g, '/')}/commands/${file}')]`)
      const command = require(`./commands/${file}`);
      console.log(`Reloading command: ${command.name}`)
      client.commands.set(command.name, command);
      commandsReloaded.push(command.name)
    } else if(fileName === file || `${fileName}.js` === file) {
      //reload command
      eval(`delete require.cache[require.resolve('${process.cwd().replace(/[\\]/g, '/')}/commands/${file}')]`)
      const command = require(`./commands/${file}`);
      console.log(`Reloading command: ${command.name}`)
      client.commands.set(command.name, command);
      commandsReloaded.push(command.name)
    }
  }
  return commandsReloaded
}
client.reloadCommands = reloadCommands

client.on("guildDelete", async (guild) => {
  //let loading = await client.channels.cache.get(cfg.botinfo.guild_log_channel).send(client.resource.loading())
  client.channels.cache.get(cfg.botinfo.guild_log_channel).send(client.resource.leaveEmbed(guild));

  setTimeout(async () => {
    client.user.setPresence({ activity: { type: 'LISTENING', name: `${client.guilds.cache.size} servers. | rb!help` } })
  }, 2000)
})
client.on("guildCreate", async (guild) => {
  //let loading = await client.channels.cache.get(cfg.botinfo.guild_log_channel).send(client.resource.loading())
  client.channels.cache.get(cfg.botinfo.guild_log_channel).send(client.resource.joinEmbed(guild));

  setTimeout(async () => {
    client.user.setPresence({ activity: { type: 'LISTENING', name: `${client.guilds.cache.size} servers. | rb!help` } })
  }, 2000)
  
})

client.on('ready', async () => {
  client.database = await connectDB()
  loadCommands()
  client.user.setPresence({ activity: { type: 'LISTENING', name: `${client.guilds.cache.size} servers. | rb!help` } })

  setInterval(async () => {
    dbl.postStats(client.guilds.cache.size).catch(e => console.log(`Error posting stats: ${e}`))
  }, 1800000)

  console.log(`${client.user.username} has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds with ${client.commands.size} commands.`);
})

client.on('message', async msg => {
  if(blacklist.bannedusers.includes(msg.author.id) || msg.author.bot) return;

  setTimeout(async = () => {
    client.database.collection('messages').insertOne({guild_id: msg.guild.id, guild_name: msg.guild.name, username: msg.author.tag, userid: msg.author.id})
  }, 2000)

  if(msg.content.toLowerCase() === 'f' || msg.content.toLowerCase() === '🇫') return client.commands.get("f").execute(client, msg)

  const prefix = msg.content.substr(0, cfg.bot.prefix.length)
  if(prefix !== cfg.bot.prefix) return;
  const contentSplit = msg.content.substr(cfg.bot.prefix.length).replace(/[ ]/g, ' ').split(" ")
  const command = contentSplit[0].toLowerCase();
  const commandArgs = contentSplit.splice(1)

  try{
    client.channels.cache.get(cfg.botinfo.command_log_channel).send(client.resource.cmdUsedEmbed(command, msg, commandArgs))
    const commandToRun = client.commands.get(command)
    if(!commandToRun) return
    else return commandToRun.execute(client, msg, commandArgs);
  }catch(e){
    msg.reply(`Error with executing command. Sent to debug channel.`)
    console.log(`Error with executing command:\n`, e)
    client.channels.cache.get(cfg.botinfo.error_channel).send(`\`\`\`js\n${util.inspect(e)}\`\`\``);
  }
})

client.login(cfg.bot.token)