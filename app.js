const Discord = require('discord.js')
const si = require('systeminformation')
const cfg = require("./config.json")
const DBL = require("dblapi.js")

//WOW OMG A COMMENT TAG HAHA LE FUNNY MEME XD
const humanizeDuration = require('humanize-duration')
const mongo = require("mongodb").MongoClient

//Spawn Clients for use elsewhere later
const client = new Discord.Client()
const dbl = new DBL(cfg.bot.dblToken, client)

//connect over to mongo and fufil the Promise()
function connectDB() {
  return new Promise((resolve, reject) => {
    mongo.connect(`mongodb://${cfg.database.host}:${cfg.database.port}`, async (err, data) => {
      if(err) return console.log('Error connecting to mongodb')
      resolve(data.db(cfg.database.db))
    })
  })
}

function formatBytes(bytes){
  if (bytes>=1000000000) {bytes=(bytes/1000000000).toFixed(2)+'GB';}
  else if (bytes>=1000000) {bytes=(bytes/1000000).toFixed(2)+'MB';}
  else if (bytes>=1000) {bytes=(bytes/1000).toFixed(2)+'KB';}
  else if (bytes>1) {bytes=bytes+' bytes';}
  else if (bytes==1) {bytes=bytes+' byte';}
  else {bytes='0 byte';}
  return bytes;
}

//Global vars for rb!info command.
let cpu
let operating

//More Logging for the Discord.JS Client
client.on("warn", info => console.log(info));
client.on("error", console.error);

//on client ready, connect over to the db for mongo and get ready to store data.
client.on('ready', async () => {
  cpu = await si.cpu()
  operating = await si.osInfo()

  console.log(`Logged in as ${client.user.tag}!`)

  //set game for the bot so we can inform users of the help command :poggers:
  client.user.setPresence({ activity: { type: 'LISTENING', name: `${client.guilds.cache.size} servers. | rb!help` } })
  .then(console.log)
  .catch(console.error)

  setInterval(async () => {
    dbl.postStats(client.guilds.cache.size)
    .catch(e => console.log(`Error posting stats: ${e}`))
  }, 1800000)

  //assign mongodb cursor to client.database for use elsewhere
  client.database = await connectDB()
})

client.on('message', async msg => {

  //pull stats for bot :thinking: using the info command
  if(msg.content.toLowerCase() === 'rb!info'){
    msg.channel.send(
      new Discord.MessageEmbed()
        .setTitle('Statistics')
        .setColor('#fcebb3')
        .setTimestamp()
        .setFooter(msg.author.tag)
        .addField('Users', `\`${client.users.cache.size}\``, true)
        .addField('Guilds', `\`${client.guilds.cache.size}\``, true)
        .addField('Language', '`NodeJS`', true)
        .addField('RAM', `\`${formatBytes(process.memoryUsage().rss)}\`/\`8GB\``, true)
        .addField('CPU', `\`${cpu.cores} Cores\``, true)
        .addField('Platform', `\`${operating.platform}\``, true)
        //.addField('Shards', `\`${parseInt(client.options.shards) + 1}\``, true)
        .addField('Ping', `\`${client.ws.ping} ms\``, true)
        .addField('Uptime', `\`${humanizeDuration(client.uptime)}\``, true)
        .addField('Developer', '`TXJ#0001`', true)
    )
  }
  if(msg.content.toLowerCase() === 'rb!help'){
    msg.reply(
      new Discord.MessageEmbed()
        .setTitle('Respects Bot - Commands')
        .setColor('#ffff4f')
        .setTimestamp()
        .setDescription(
        '`rb!ping` - Ping the websocket!\n'
        +'`rb!info` - Returns process information on the bot like uptime, guilds etc.\n'
        +'`rb!help` - Shows this page!\n'
        +`\`rb!invite\` - Invite the bot to your server with this command, or [click here](\`${cfg.botinfo.invite_url}\`)\n\n`
        +`**Music Commands [BETA]** Enabled?:${cfg.botinfo.music_enabled}\n`
        +'`rb!play` - Play Music from Youtube.\n'
        +'`rb!pause` - Pause the current song.\n'
        +'`rb!resume` - Resume the current song.\n'
        +'`rb!queue` - Show the current music queue and what is currently playing.\n'
        +'`rb!skip` - Skip the current song.\n'
        +'`rb!stop` - Stop the current song.\n'
        +'`rb!loop` - Toggle loop for the current song.\n'
        +'`rb!volume` - Change the volume of the bot on the fly.\n'
        +'`rb!remove` - Remove a song from the music queue.\n'
        )
        .setFooter(`${cfg.botinfo.owner}`)
    )
  }
  if(msg.content.toLowerCase() === 'rb!ping' && msg.author.id === cfg.botinfo.ownerid) return msg.channel.send(`Pong! ${client.ws.ping}ms`);
  if(msg.content.toLowerCase() === 'rb!shutdown' && msg.author.id === cfg.botinfo.ownerid) return process.exit(1);
  if(msg.content.toLowerCase() === 'rb!invite'){
    msg.reply('https://discordapp.com/api/oauth2/authorize?client_id=468171246018756609&permissions=3072&scope=bot')
  }

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

      //New Embed Format! POGGERS
      msg.channel.send(new Discord.MessageEmbed()
      .setTitle('Respect Found')
      .setDescription(`<@${msg.author.id}> has paid their respects. :pray: :regional_indicator_f:`)
      .setColor('#003cff')
      .setTimestamp()
      .addField('Server Respects', `\`${fcount}\``, true)
      .addField('Total Respects', `\`${total}\``, true)
      ).catch(e => msg.guild.channels.cache.get(cfg.botinfo.error_channel).send(
        new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setTimestamp()
        .addField('Error Dump', `\`\`\`${e}\`\`\``, false)
        .addField('Channel ID', `\`${msg.channel.id}\``, false)
        .addField('Guild ID', `\`${msg.guild.id}\``, false)
        .addField('User Requested', `\`${msg.author.tag}\``, false)
        .addField('User ID', `\`${msg.author.id}\``, false)
      ))
  }
})

client.login(cfg.bot.token)