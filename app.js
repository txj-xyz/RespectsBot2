const Discord = require('discord.js');
const fs = require('fs');
const storageFile = require('./arrStorage.json');
const client = new Discord.Client();

//Re-did the local storage to a file based storage.
localFile = storageFile;

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

//Wait for F message.
client.on('message', msg => {
	
	//try to send the message if error then return it and stop the command.
	try{
		if (msg.content === 'f') {
	  
		localFile["respectCount"]++
		fs.writeFileSync('./arrStorage.json', JSON.stringify(localFile, null, '\t'))
		msg.reply(`has paid their Respects. :regional_indicator_f: :pray:\n:bar_chart: ${localFile["respectCount"]}`);
		console.log(`Respect has been paid, Count: ${localFile["respectCount"]} User ${msg.author.username}`);

	}else if(msg.content === 'F'){

		localFile["respectCount"]++
		fs.writeFileSync('./arrStorage.json', JSON.stringify(localFile, null, '\t'))
		msg.reply(`has paid their Respects. :regional_indicator_f: :pray:\n:bar_chart: ${localFile["respectCount"]}`)
		console.log(`Respect has been paid, Count: ${localFile["respectCount"]} User ${msg.author.username}`);
	
	}else if(msg.content.indexOf("<!@468171246018756609>") >= 0){
		msg.reply(":eyes:")
		return
	}
	}catch(e){
		console.log(`Error found with sending message, dumping.`)
		console.log(e)
	}

});

//Simple Token Login.
client.login('<BOT_TOKEN>');
