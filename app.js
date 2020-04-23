const Discord = require('discord.js');
const client = new Discord.Client();

//Store destructive count.
var respectCount = 0;


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

//Wait for F message.
client.on('message', msg => {
	
  if (msg.content === 'f') {
	  
	respectCount++
    msg.reply(`has paid their Respects. :regional_indicator_f: :pray:\n:bar_chart: ${respectCount}`);
	console.log(`Respect has been paid, Count: ${respectCount} User ${msg.author.username}`);
  
  }else if(msg.content === 'F'){
	
	respectCount++
	msg.reply(`has paid their Respects. :regional_indicator_f: :pray:\n:bar_chart: ${respectCount}`)
	console.log(`Respect has been paid, Count: ${respectCount} User ${msg.author.username}`);
	
  }
  
});


//Simple Token Login.
client.login('<BOT_TOKEN>');