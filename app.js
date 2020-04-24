const Discord = require('discord.js');
const fs = require('fs');
const storageFile = require('./arrStorage.json');
const client = new Discord.Client();

//Re-did the local storage to a file based storage.
confFile = storageFile;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//Wait for F message.
client.on('message', msg => {
	
  if (msg.content === 'f') {
	  
	confFile["respectCount"]++
	fs.writeFileSync('./arrStorage.json', JSON.stringify(confFile, null, '\t'))
    msg.reply(`has paid their Respects. :regional_indicator_f: :pray:\n:bar_chart: ${confFile["respectCount"]}`);
	console.log(`Respect has been paid, Count: ${confFile["respectCount"]} User ${msg.author.username}`);
  
  }else if(msg.content === 'F'){
	
	confFile["respectCount"]++
	fs.writeFileSync('./arrStorage.json', JSON.stringify(confFile, null, '\t'))
	msg.reply(`has paid their Respects. :regional_indicator_f: :pray:\n:bar_chart: ${confFile["respectCount"]}`)
	console.log(`Respect has been paid, Count: ${confFile["respectCount"]} User ${msg.author.username}`);
	
  }
  
});

//Simple Token Login.
client.login('<BOT_TOKEN>');