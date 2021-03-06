const { SlashCommandBuilder } = require('@discordjs/builders');
const { serialize } = require('../functions');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban user')
        .addStringOption((option) =>
            option.setName('username').setDescription('Username').setRequired(true)
        ),
    async execute(interaction, bannedAccounts) {
        const index = bannedAccounts.findIndex(acc => acc.name === interaction.options.getString('username'));
        if (index < 0) {
            return interaction.reply('User not found');
        }
        bannedAccounts.splice(index, 1);
        serialize(interaction.client, bannedAccounts);
        return interaction.reply('Unbanned user');
    }
};
