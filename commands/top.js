let results = [];
let limitArg = 5;
module.exports = {
	name: 'top',
	description: 'Return a list of the top 5 guilds.',
	async execute(client, msg, commandArgs) {
        let loading = await msg.channel.send(client.resource.loading())
        if(commandArgs.length === 0){
            limitArg = 5;
            return loading.edit(client.resource.embed()
                .setTitle(`Error`)
                .setDescription(`No Value Provided please use a value of 1-10`)
            )
        } else if(commandArgs > 10) {
            return loading.edit(client.resource.embed()
                .setTitle(`Error`)
                .setDescription(`Please use a value of 1-10`)
            )
        } else {
            limitArg = Number(commandArgs);
        }
        client.database.collection('guilds').find().limit(limitArg).sort({fcount: -1}).toArray(function(err, result) {
            if(results.length === 0){
                result.forEach(function(result, key){
                    results.push(`${key + 1}. ${result.guild_name} - **${result.fcount}**`)
                })
            }else {
                results = [];
                result.forEach(function(result, key){
                    results.push(`${key + 1}. ${result.guild_name} - **${result.fcount}**`)
                })
            }
            if (err){
                loading.edit(client.resource.embed()
                    .setTitle(`Error`)
                    .setDescription(`Error found reporting this to my owner.:\n \`\`\`${err}\`\`\``)
                )
            } else {
                loading.edit(client.resource.embed()
                    .setTitle(`Respects Bot Leaderboard`)
                    .setFooter(`Delivered via - MongoDB API`)
                    .setDescription(results.join('\n'))
                )
            }
        })
	},
};