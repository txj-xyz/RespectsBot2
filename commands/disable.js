
module.exports = {
  name: 'disable',
  description: 'Disable F command for guild or channel',
  async execute(client, msg, args) {
    let loading = await msg.channel.send(client.resource.loading())
    
    if(!args[0]) return;
        loading.edit(client.resource.embed()
        .setTitle(`Success`)
        .setDescription(`arr[0]: \`${args}\``)
      );
  },
};