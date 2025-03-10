require('../config.js');
const {
    bold,
    VCardBuilder
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'owner',
    aliases: ['creator', 'developer'],
    category: 'info',
    code: async (ctx) => {
        const vcard = new VCardBuilder()
            .setFullName(global.owner.name)
            .setOrg(global.owner.organization)
            .setNumber(global.owner.number)
            .build();

        await ctx.reply({
            contacts: {
                displayName: global.ownername,
                contacts: [{
                    vcard
                }]
            }
        });
    }
};