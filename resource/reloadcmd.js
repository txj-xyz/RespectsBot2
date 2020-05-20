const Discord = require(`discord.js`);
const fs = require('fs');

module.exports = (client, commandFiles) => {

    function reloadCommands (fileName) {
        if(!client.commands.get('help')){
            for (const file of commandFiles) {
                const command = require(`../commands/${file}`);
                console.log(`Loaded command: ${command.name} - ${command.description}`)
                try{
                    client.commands.set(command.name, command);
                }catch(e){
                    console.log(e)
                }
            }
        } else {
            const commandsReloaded = []
            for (const file of commandFiles) {
                if (!fileName) {
                    eval(`delete require.cache[require.resolve('${process.cwd().replace(/[\\]/g, '/')}/commands/${file}')]`)
                    const command = require(`../commands/${file}`);
                    console.log(`Reloading command: ${command.name}`)
                    client.commands.set(command.name, command);
                    commandsReloaded.push(command.name)
                } else if(fileName === file || `${fileName}.js` === file) {
                    eval(`delete require.cache[require.resolve('${process.cwd().replace(/[\\]/g, '/')}/commands/${file}')]`)
                    const command = require(`../commands/${file}`);
                    console.log(`Reloading command: ${command.name}`)
                    client.commands.set(command.name, command);
                    commandsReloaded.push(command.name)
                }
            }
            return commandsReloaded
        }
    }
    client.reloadCommands = reloadCommands
};