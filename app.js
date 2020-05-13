const Discord = require('discord.js')
const cfg = require("./config/config.json")
const DBL = require("dblapi.js")
const blacklist = require("./config/userblocklist.json")
const fs = require('fs');
const util = require('util');

const client = new Discord.Client()
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

client.on("guildCreate", guild => {
  console.log("Joined a new guild: " + guild.name);
})

client.on("guildDelete", guild => {
  console.log("Left a guild: " + guild.name);
})

client.on('ready', async () => {

  //set game for the bot so we can inform users of the help command :poggers:
  setInterval(async () => {
    await client.user.setPresence({ activity: { type: 'LISTENING', name: `${client.guilds.cache.size} servers. | rb!help` } })
  }, 1800000)
  

  //This really isn't needed if you are not using "top.gg" DBL.
  setInterval(async () => {
    dbl.postStats(client.guilds.cache.size)
    .catch(e => console.log(`Error posting stats: ${e}`))
  }, 1800000)

  client.database = await connectDB()

  //Load our commands into Discord.Client();
  loadCommands()

  console.log(`${client.user.username} has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds with ${client.commands.size} commands.`);
})



client.on('message', async msg => {

  //If the person asking for a command is banned, ignore them and or if the user is a bot.
  if(blacklist.bannedusers.includes(msg.author.id) || msg.author.bot) return;
  
  //Wait 2 seconds to start our stats collection
  setTimeout(async = () => {
    client.database.collection('messages').insertOne({
      guild_id: msg.guild.id,
      guild_name: msg.guild.name,
      username: msg.author.tag,
      userid: msg.author.id
    })
  }, 2000)




  if(msg.content.toLowerCase() === 'f') return client.commands.get("f").execute(client, msg)


  //Call command handler here
  const prefix = msg.content.substr(0, cfg.bot.prefix.length)
  if(prefix !== cfg.bot.prefix) return;
  const contentSplit = msg.content.substr(cfg.bot.prefix.length).replace(/[ ]/g, ' ').split(" ")
  const command = contentSplit[0].toLowerCase();
  const commandArgs = contentSplit.splice(1)
  console.log(prefix, command, commandArgs)

  try{
    //Log command to channel when used.
    client.channels.cache.get(cfg.botinfo.command_log_channel).send(
      new Discord.MessageEmbed()
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