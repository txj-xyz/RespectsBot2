const Discord = require('discord.js')
const cfg = require("./config/config.json")
const DBL = require("dblapi.js")
const blacklist = require("./config/userblocklist.json")
const fs = require('fs');
const util = require('util');
const client = new Discord.Client()

client.resource = require("./resource/util.js")

//Create DBL API Post, This is not needed if you do not use top.gg
const dbl = new DBL(cfg.bot.dblToken, client)

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

//Create command object structure
client.commands = new Discord.Collection();

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

client.on("guildCreate", async (guild) => {
  client.channels.cache.get("710275684794236964").send(
    client.resource.embed()
    .setColor('#26ff00')
    .setTimestamp()
    .setTitle(`Joined Guild!`)
    .addField(`Guild Name`, guild.name, false)
    .addField(`Guild ID`, guild.id, false)
    .addField(`Member Count`, guild.memberCount - 1, true)
    .addField("Humans", `${guild.members.cache.filter(member => !member.user.bot).size} `, true)
    .addField("Bots", `${guild.members.cache.filter(member => member.user.bot).size}` - 1, true)
    .addField(`Owner`, `${guild.owner.user.tag}[${guild.owner.id}]`, false)
  );
  console.log("Joined a new guild: " + guild.name);
})

client.on("guildDelete", async (guild) => {
  client.channels.cache.get("710275684794236964").send(
    client.resource.embed()
    .setColor('#ff0000')
    .setTimestamp()
    .setTitle(`Left Guild!`)
    .addField(`Guild Name`, guild.name, false)
    .addField(`Guild ID`, guild.id, false)
    .addField(`Member Count`, guild.memberCount - 1, true)
    .addField("Humans", `${guild.members.cache.filter(member => !member.user.bot).size} `, true)
    .addField("Bots", `${guild.members.cache.filter(member => member.user.bot).size}` - 1, true)
    .addField(`Owner`, `${guild.owner.user.tag}[${guild.owner.id}]`, false)
  );
  console.log("Left a guild: " + guild.name);
})

client.on('ready', async () => {
  client.database = await connectDB()
  loadCommands()
  console.log(`${client.user.username} has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds with ${client.commands.size} commands.`);
})

client.on('ready', async () => {
  setInterval(async () => {
    await client.user.setPresence({ activity: { type: 'LISTENING', name: `${client.guilds.cache.size} servers. | rb!help` } })
  }, 1800000)
  setInterval(async () => {
    await dbl.postStats(client.guilds.cache.size).catch(e => console.log(`Error posting stats: ${e}`))
  }, 1800000)
})



client.on('message', async msg => {
  if(blacklist.bannedusers.includes(msg.author.id) || msg.author.bot) return;

  setTimeout(async = () => {
    client.database.collection('messages').insertOne({
      guild_id: msg.guild.id,
      guild_name: msg.guild.name,
      username: msg.author.tag,
      userid: msg.author.id
    })
  }, 2000)

  if(msg.content.toLowerCase() === 'f') return client.commands.get("f").execute(client, msg)

  const prefix = msg.content.substr(0, cfg.bot.prefix.length)
  if(prefix !== cfg.bot.prefix) return;
  const contentSplit = msg.content.substr(cfg.bot.prefix.length).replace(/[ ]/g, ' ').split(" ")
  const command = contentSplit[0].toLowerCase();
  const commandArgs = contentSplit.splice(1)
  console.log(prefix, command, commandArgs)

  try{
    client.channels.cache.get(cfg.botinfo.command_log_channel).send(
      client.resource.embed()
      .setColor('#d2eb34')
      .setTimestamp()
      .setDescription(`*${command}* command used.\n\n`+
        `**Command**: \`${command}\`\n`+
        `**User**: \`${msg.author.tag}\`\n`+
        `**User ID**: \`${msg.author.id}\`\n`+
        `**Channel ID**: \`${msg.channel.id}\``
      )
    )
    const commandToRun = client.commands.get(command)
    if(!commandToRun) return
    else return commandToRun.execute(client, msg, commandArgs);
  }catch(e){
    msg.reply("Sorry about that, there was an error sending the message, I will report this to my owner and this should be fixed shortly. I apologize.")
    console.log(`Error with executing command:\n`, e)
    msg.guild.channels.cache.get(cfg.botinfo.error_channel).send(`\`\`\`javascript\n${require('util').inspect(e)}\`\`\``);
  }
})

client.login(cfg.bot.token)