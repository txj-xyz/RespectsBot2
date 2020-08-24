module.exports = {
	name: 'abuse',
	description: 'Leave a guild due to abuse of commands.',
	async execute(client, msg, commandArgs) {
        if(msg.author.id !== "189238841054461952") return;
        if(!commandArgs[0]) return msg.channel.send("Please enter a Guild ID to leave.") 
        
        const guild_to_leave = client.guilds.cache.get(commandArgs[0]);
        const left_guild_name = client.guilds.cache.get(commandArgs[0]).name;
        const left_guild_owner = client.guilds.cache.get(commandArgs[0]).owner;
        
        await left_guild_owner.send(`I am leaving **${left_guild_name}**`);
        await guild_to_leave.leave();
	},
};