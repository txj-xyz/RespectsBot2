module.exports = (client, commandFiles) => {
    loadCommands = async () => {
        for (const file of commandFiles) {
            const command = require(`../../commands/${file}`);
            console.log(`Loaded command: ${command.name} - ${command.description}`)
            try{
                client.commands.set(command.name, command);
            }catch(e){
                console.log(e)
            }
            
        }
    }
};