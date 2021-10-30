const config = require('./config');
const { Client, Collection, MessageEmbed } = require('discord.js');
const fs = require('fs');
const { timestampToReadable, readableToTimestamp } = require('./functions');

const { TOKEN } = config;

const PREFIX = '.';

let bannedAccounts = [];

const client = new Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}
client.login(TOKEN);

const ban = async (message, input) => {
    if (input.length === 2) {
        if (bannedAccounts.find((acc) => acc.name === input[0])) {
            return message.reply('User already added');
        }
        bannedAccounts.push({ name: input[0], timestamp: readableToTimestamp(input[1]) });
        return message.reply('Added user!');
    } else {
        await message.reply(`Usage: ${PREFIX}ban "<<user>>" "<<time banned>>"`);
    }
};

const unban = async (message, input) => {
    if (!input[0]) return message.reply(`Usage: ${PREFIX}unban "<<user>>"`);
    const index = bannedAccounts.findIndex((acc) => acc.name === input[0]);
    if (index < 0) {
        return message.reply('User not found');
    }
    bannedAccounts.splice(index, 1);
    return message.reply('Unbanned user');
};

const showAccounts = async (message) => {
    const now = Date.now();
    bannedAccounts.sort((a, b) => a.timestamp < b.timestamp);
    const embed = new MessageEmbed().setColor('black');
    let i = bannedAccounts.length;
    let nameString = '',
        timeString = '';
    while (i--) {
        const timeLeft = bannedAccounts[i].timestamp - now;
        if (timeLeft < 0) {
            bannedAccounts.splice(i, 1);
            continue;
        }
        nameString += bannedAccounts[i].name + "\n";
        timeString += timestampToReadable(timeLeft) + "\n";
        /* if (i !== 0) {
            embed.addField('\u200B', '\u200B', true);
        } */
    }
    if (bannedAccounts.length === 0) {
        embed.addField('Name', 'No users banned');
    } else {
        embed.addField('Name', nameString, true);
        embed.addField('Unbanned', timeString, true);
    }
    await message.channel.send({ embeds: [embed] });
};

const cmdRegex = /[^\s"]+|"([^"]*)"/gi;

client.on('messageCreate', async (message) => {
    try {
        if (message.content.startsWith(PREFIX)) {
            let input = [];
            message.content = message.content.slice(PREFIX.length).trim();
            do {
                var match = cmdRegex.exec(message.content);
                if (match != null) {
                    input.push(match[1] ? match[1] : match[0]);
                }
            } while (match != null);
            const command = input.shift();
            if (command === 'ban') {
                ban(message, input);
            } else if (command === 'accounts') {
                showAccounts(message);
            } else if (command === 'unban') {
                unban(message, input);
            }
        }
    } catch (e) {
        console.log(e);
        console.log('roflcopter');
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction, bannedAccounts);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true
        });
    }
});

const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('ok');
});
server.listen(3000);
