module.exports = {
	name: 'top',
	description: 'Return a list of the top 5 guilds.',
	async execute(client, msg) {
        let loading = await msg.channel.send(client.resource.loading())
        client.database.collection('guilds').find().limit(5).sort({fcount: -1}).toArray(function(err, result) {
            console.log(result)
            if (err){
                loading.edit(client.resource.embed()
                    .setTitle(`Error`)
                    .setDescription(`Error found reporting this to my owner.:\n \`\`\`${err}\`\`\``)
                )
            } else{
                loading.edit(client.resource.embed()
                    .setTitle(`Respects Bot Leaderboard`)
                    .setFooter(`Delivered via - MongoDB API`)
                    .setDescription(`
                    1. ${result[0].guild_name} - **${result[0].fcount.toLocaleString()}**
                    2. ${result[1].guild_name} - **${result[1].fcount.toLocaleString()}**
                    3. ${result[2].guild_name} - **${result[2].fcount.toLocaleString()}**
                    4. ${result[3].guild_name} - **${result[3].fcount.toLocaleString()}**
                    5. ${result[4].guild_name} - **${result[4].fcount.toLocaleString()}**`)
                )
                
            }
            
        })
	},
};