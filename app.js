const Discord = require('discord.js')
const si = require('systeminformation')
const cfg = require("./config/config.json")
const DBL = require("dblapi.js")
const blacklist = require("./config/userblocklist.json")

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

  //This really isn't needed if you are not using "top.gg" DBL.
  setInterval(async () => {
    dbl.postStats(client.guilds.cache.size)
    .catch(e => console.log(`Error posting stats: ${e}`))
  }, 1800000)

  //assign mongodb cursor to client.database for use elsewhere
  client.database = await connectDB()
})

client.on('message', async msg => {
  //check blacklist first and ignore things if they are blocked, this will be way better in the future
  if(blacklist.bannedusers.includes(msg.author.id)) return;

  //pull stats for bot :thinking: using the info command
  if(msg.content.toLowerCase() === `${cfg.bot.prefix}info`){
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
        .addField('Ping', `\`${client.ws.ping}ms\``, true)
        .addField('Uptime', `\`${humanizeDuration(client.uptime)}\``, true)
        .addField('Developer', '`TXJ#0001`', true)
    )
  }
  //random comment
  if(msg.content.toLowerCase() === `${cfg.bot.prefix}help`){
    msg.reply(
      new Discord.MessageEmbed()
        .setTitle('Respects Bot - Commands')
        .setColor('#ffff4f')
        .setTimestamp()
        .setDescription(
        `\`${cfg.bot.prefix}ping\` - Ping the websocket!\n`
        +`\`${cfg.bot.prefix}info\` - Returns process information on the bot like uptime, guilds etc.\n`
        +`\`${cfg.bot.prefix}vote\` - Vote for the bot and support me!\n`
        +`\`${cfg.bot.prefix}help\` - Shows this page!\n`
        +`\`${cfg.bot.prefix}invite\` - Invite the bot to your server with this command, or [click here](\`${cfg.botinfo.invite_url}\`)\n\n`
        +`**Music Commands** Enabled: ${cfg.botinfo.music_status}\n`
        +`\`${cfg.bot.prefix}[play, p]\` - Play/Resume Music from Youtube.\n`
        +`\`${cfg.bot.prefix}[queue, q]\` - Show the current music queue and what is currently playing.\n`
        +`\`${cfg.bot.prefix}[skip, s]\` - Skip the current song.\n`
        +`\`${cfg.bot.prefix}[volume, vol]\` - Change the volume of the bot on the fly.\n`
        +`\`${cfg.bot.prefix}pause\` - Pause the current song.\n`
        +`\`${cfg.bot.prefix}stop\` - Stop the current song.\n`
        +`\`${cfg.bot.prefix}remove\` - Remove a song from the music queue.\n`
        )
        .setFooter(`${cfg.botinfo.owner}`)
    )
  }

  if(msg.content.toLowerCase() === `${cfg.bot.prefix}invite`){
    msg.reply(`${cfg.botinfo.invite_url}`)
  };
  if(msg.content.toLowerCase() === `${cfg.bot.prefix}vote`){
    msg.reply(`https://top.gg/bot/468171246018756609/vote`)
  };

  if(msg.content.toLowerCase() === `${cfg.bot.prefix}ping`) return msg.channel.send(`Pong! ${client.ws.ping}ms`);
  if(msg.content.toLowerCase() === `${cfg.bot.prefix}shutdown` && msg.author.id === cfg.botinfo.ownerid) return process.exit(1);
  
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
      ).catch(e => client.channels.cache.get(cfg.botinfo.error_channel).send(
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