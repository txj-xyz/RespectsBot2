const Discord = require(`discord.js`);
const fs = require('fs');

module.exports = (client, commandFiles) => {

    function reloadCommands (fileName) {
        const commandsReloaded = []
        for (const file of commandFiles) {
            // Check if the file name is correct regardless of extension.
            if (!fileName) {
                eval(`delete require.cache[require.resolve('${process.cwd().replace(/[\\]/g, '/')}/commands/${file}')]`)
                const command = require(`../../commands/${file}`);
                console.log(`Reloading command: ${command.name}`)
                client.commands.set(command.name, command);
                commandsReloaded.push(command.name)
            } else if(fileName === file || `${fileName}.js` === file) {
                //reload command
                eval(`delete require.cache[require.resolve('${process.cwd().replace(/[\\]/g, '/')}/commands/${file}')]`)
                const command = require(`../../commands/${file}`);
                console.log(`Reloading command: ${command.name}`)
                client.commands.set(command.name, command);
                commandsReloaded.push(command.name)
            }
        }
        return commandsReloaded
    }
    client.reloadCommands = reloadCommands
};