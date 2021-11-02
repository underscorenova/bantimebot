const { SlashCommandBuilder } = require('@discordjs/builders');
const { readableToTimestamp, serialize } = require('../functions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Set ban timer for username')
        .addStringOption((option) =>
            option.setName('username').setDescription('Username').setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('bantime')
                .setDescription('Time that the user is banned')
                .setRequired(true)
        ),
    async execute(interaction, bannedAccounts) {
        if (bannedAccounts.find((acc) => acc.name === interaction.options.getString('username'))) {
            return interaction.reply('User already added');
        }
        let text = readableToTimestamp(interaction.options.getString('bantime'));
        if (!text) return interaction.reply('Cannot parse time');
        bannedAccounts.push({ name: interaction.options.getString('username'), timestamp: text });
        serialize(interaction.client, bannedAccounts);
        return interaction.reply('Added user');
    }
};
