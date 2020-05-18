const f = require('superagent')
module.exports = {
	name: 'dog',
	description: 'Random Dog!',
	async execute(client, msg) {
        let loading = await msg.channel.send(client.resource.loading())
        
        f.get('https://dog.ceo/api/breeds/image/random').then(res => {
            loading.edit(client.resource.embed()
            .setFooter(`Requested by: ${msg.author.tag}`)
            .setImage(res.body.message)
            );
        })
	},
};