const Discord = require('discord.js')
const si = require('systeminformation')
const humanizeDuration = require('humanize-duration')
const cfg = require("./config.json")
const DBL = require("dblapi.js")
const mongo = require("mongodb").MongoClient

//Spawn Clients
const client = new Discord.Client()
const dbl = new DBL(cfg.bot.dblToken, client)

//connect over to mongo.
function connectDB() {
  return new Promise((resolve, reject) => {
    mongo.connect(`mongodb://${cfg.database.host}:${cfg.database.port}`, async (err, data) => {
      if(err) return console.log('Error connecting to mongodb')
      resolve(data.db(cfg.database.db))
    })
  })
}

//Global vars for sys info command.
let cpu
let mem
let operating

//on client ready, connect over to the db for mongo and get ready to store data.
client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`)
  
  //assign mongodb cursor to client.database for use elsewhere
  client.database = await connectDB()

  setInterval(async () => {
    dbl.postStats(client.guilds.cache.size)
    .catch(e => console.log(`Error posting stats: ${e}`))
  }, 1800000)

  cpu = await si.cpu()
  mem = await si.mem()
  operating = await si.osInfo()
})

client.on('message', async msg => {

  //pull stats for bot :thinking:
  if(msg.content.toLowerCase() === 'rb!info'){
    msg.reply(
      new Discord.MessageEmbed()
        .setTitle('Statistics')
        .setColor('#fcebb3')
        .setTimestamp()
        .setFooter(msg.author.tag)
        .addField('Users', `\`${client.users.cache.size}\``, true)
        .addField('Guilds', `\`${client.guilds.cache.size}\``, true)
        .addField('Language', '`NodeJS`', true)
        .addField('RAM\'s', `\`${Math.floor(mem.used / 1000000000)}GB/${Math.floor(mem.total / 1000000000)}GB\``, true)
        .addField('CPU', `\`${cpu.cores} Cores\``, true)
        .addField('Platform', `\`${operating.platform}\``, true)
        .addField('Shards', `\`${parseInt(client.options.shards) + 1}\``, true)
        .addField('Ping', `\`${client.ws.ping} ms\``, true)
        .addField('Uptime', `\`${humanizeDuration(client.uptime)}\``, true)
        .addField('Developer', '`TXJ#0001`', true)
    )
  }

  if(msg.content.toLowerCase() === 'f' && !msg.author.bot){

    //If client.database doesnt exist that means our database isnt connected
    if(!client.database) return msg.reply('Error: Database not connected!')

    //Check to make sure they exist in the database
    let guildEntry = await client.database.collection('guilds').findOne({guild_id: msg.guild.id})
    let fcount = 0

    //If the dont make them a new object and assign fcount to 1
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

    let total = 80976;
    allEntries.forEach(e => {
      total += e.fcount
    })
   
    //do stuff here with mesage
    console.log(`Guild - ${msg.guild.name} : user - ${msg.author.tag} : fcount - ${fcount}`)

    //New Embed format! PogChamp
    msg.channel.send(new Discord.MessageEmbed()
    .setTitle('Respect Found')
    .setDescription(`<@${msg.author.id}> has paid their respects. :pray: :regional_indicator_f:`)
    .setColor('#003cff')
    .setTimestamp()
    //.setFooter(msg.author.tag)
    .addField('Server Respects', `\`${fcount}\``, true)
    .addField('Total Respects', `\`${total}\``, true)
    
    //old format, MonkaS
    //msg.reply(`has paid their Respects. :regional_indicator_f: :pray:\nTotal Respects: \`${total}\`\nRespects Paid on this guild: \`${fcount}\``)
    )
  }
})

client.login(cfg.bot.token)