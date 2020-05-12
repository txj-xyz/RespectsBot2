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

// can you see the console window at the bottom?
client.reloadCommands = reloadCommands

//More Logging for the Discord.JS Client
client.on("warn", info => console.log(info));
client.on("error", console.error);


client.on('ready', async () => {

  //set game for the bot so we can inform users of the help command :poggers:
  client.user.setPresence({ activity: { type: 'LISTENING', name: `${client.guilds.cache.size} servers. | rb!help` } })

  //This really isn't needed if you are not using "top.gg" DBL.
  setInterval(async () => {
    dbl.postStats(client.guilds.cache.size)
    .catch(e => console.log(`Error posting stats: ${e}`))
  }, 1800000)

  //assign mongodb cursor to client.database for use elsewhere
  client.database = await connectDB()

  console.log(`${client.user.username} has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
  loadCommands()
})



client.on('message', async msg => {
  //check blacklist first and ignore things if they are blocked, this will be way better in the future
  if(blacklist.bannedusers.includes(msg.author.id)) return;
  
  setTimeout(async = () => {
    client.database.collection('messages').insertOne({
      guild_id: msg.guild.id,
      username: msg.author.tag,
      userid: msg.author.id
    })
  }, 2000)

  if(msg.content.toLowerCase() === 'f' && !msg.author.bot){
    //If client.database doesnt exist that means our database isnt connected
    if(!client.database) return msg.reply('Error: Database not connected! Please contact TXJ#0001')

    //Check to make sure they exist in the database
    let guildEntry = await client.database.collection('guilds').findOne({guild_id: msg.guild.id})
    let fcount = 0

    //If the guild doesn't exist dont make them a new object and assign fcount to 1
    if(!guildEntry) {
      await client.database.collection('guilds').insertOne({
        guild_id: msg.guild.id,
        fcount: 1
      })
      fcount = 1
    }

    //If they do modify the object fcount++
    else {
      await client.database.collection('guilds').updateOne({
        guild_id: msg.guild.id
      }, {
        $set: { fcount: guildEntry.fcount + 1 }
      })
      
      fcount = guildEntry.fcount + 1
    }
  
    let allEntries = await client.database.collection('guilds').find({}).toArray()
    let total = 0;
    allEntries.forEach(e => {
      total += e.fcount
    })
    console.log(`Guild - ${msg.guild.name} : user - ${msg.author.tag} : fcount - ${fcount}`)

    msg.channel.send(new Discord.MessageEmbed()
    .setTitle('Respect Found')
    .setDescription(`<@${msg.author.id}> has paid their respects. :pray: :regional_indicator_f:`)
    .setColor('#003cff')
    .setTimestamp()
    .addField('Server Respects', `\`${fcount}\``, true)
    .addField('Total Respects', `\`${total}\``, true)
    ).catch(e => client.channels.cache.get(cfg.botinfo.error_channel).send(
      new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTimestamp()
      .addField('Error Dump', `\`\`\`${util.inspect(e)}\`\`\``, false)
      .addField('Channel ID', `\`${msg.channel.id}\``, false)
      .addField('Guild ID', `\`${msg.guild.id}\``, false)
      .addField('User Requested', `\`${msg.author.tag}\``, false)
      .addField('User ID', `\`${msg.author.id}\``, false)
    ))
  }

  //Call commands here
  const prefix = msg.content.substr(0, cfg.bot.prefix.length)
  if(prefix !== cfg.bot.prefix) return;
  const contentSplit = msg.content.substr(cfg.bot.prefix.length).replace(/[ ]/g, ' ').split(" ")
  const command = contentSplit[0].toLowerCase();
  const commandArgs = contentSplit.splice(1)
  console.log(prefix, command, commandArgs)
  try{
    const commandToRun = client.commands.get(command)
    if(!commandToRun) return
    else return commandToRun.execute(client, msg, commandArgs);
  }catch(e){
    msg.reply("Sorry about that, there was an error sending the message, I will report this to my owner and this should be fixed shortly. I apologize.")
    console.log(e)
    msg.guild.channels.cache.get(cfg.botinfo.error_channel).send(`\`\`\`javascript\n${require('util').inspect(e)}\`\`\``);
  }
})

client.login(cfg.bot.token)