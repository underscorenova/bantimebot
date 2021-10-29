const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { timestampToReadable } = require('../functions');

module.exports = {
    data: new SlashCommandBuilder().setName('accounts').setDescription('Show banned accounts'),
    async execute(interaction, bannedAccounts) {
        const now = Date.now();
        bannedAccounts.sort((a, b) => a.timestamp < b.timestamp);
        const embed = new MessageEmbed().setColor('black');
        let i = bannedAccounts.length;
        while (i--) {
            const timeLeft = bannedAccounts[i].timestamp - now;
            if (timeLeft < 0) {
                bannedAccounts.splice(i, 1);
                continue;
            }
            embed.addField('Name', bannedAccounts[i].name, true);
            embed.addField('Unbanned', timestampToReadable(timeLeft), true);
            if (i !== 0) {
                embed.addField('\u200B', '\u200B', true);
            }
        }
        if (bannedAccounts.length === 0) {
            embed.addField('Name', 'No users banned');
        }
        interaction.reply({ embeds: [embed] });
    }
};
