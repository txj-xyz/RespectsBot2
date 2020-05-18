const f = require('superagent')
module.exports = {
	name: 'cat',
	description: 'Random Cat!',
	async execute(client, msg) {
        let loading = await msg.channel.send(client.resource.loading())
        
        f.get('http://aws.random.cat/meow').then(res => {
            loading.edit(client.resource.embed()
            .setFooter(`Requested by: ${msg.author.tag} - `)
            .setImage(res.body.file)
            );
        })
	},
};