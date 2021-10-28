import config from './config';
import Discord from 'discord.js';

const { TOKEN } = config;

const PREFIX = 'a!';

let bannedAccounts = [];

const client = new Discord.Client();
client.login(TOKEN);

const timestampToReadable = (timestamp) => {
    let result = "";
    result += timestamp % (1000 * 60 * 60 * 24) ? timestamp % (1000 * 60 * 60 * 24) + " days" : "";
    result += timestamp % (1000 * 60 * 60) ? timestamp % (1000 * 60 * 60) + " hours" : "";
    result += timestamp % (1000 * 60) ? timestamp % (1000 * 60) + " minutes" : "";
    result += timestamp % (1000) ? timestamp % (1000) + " seconds" : "";
    return result;
}

const readableToTimestamp = (readable) => {
    let date = new Date();
    const regex = /\d/g;
    const length = regex.exec(readable);
    if (readable.contains('days') || readable.contains('day')) {
        date.setTime(date.getTime() + length * 1000 * 60 * 60 * 24);
    } else if (readable.contains('hours') || readable.contains('hour')) {
        date.setTime(date.getTime() + length * 1000 * 60 * 60);
    } else if (readable.contains('minutes') || readable.contains('minute')) {
        date.setTime(date.getTime() + length * 1000 * 60);
    } else if (readable.contains('seconds') || readable.contains('second')) {
        date.setTime(date.getTime() + length * 1000);
    }
    return date.getTime();
}

const ban = async (message, input) => {
    if (input.length === 2) {
        if (bannedAccounts.find(acc => acc.name === input[0])) {
            return message.reply('User already added');
        }
        bannedAccounts.push({ name: input[0], timestamp: readableToTimestamp(input[1]) });
    } else {
        message.reply(`Usage: ${PREFIX}ban "<<user>>" "<<time banned>>"`);
    }
};


const showAccounts = async (message) => {
    const now = Date.now();
    bannedAccounts.sort((a, b) => a.timestamp < b.timestamp);
    const embed = new Discord.MessageEmbed()
        .setColor('black');
    let i = bannedAccounts.length;
    while (i--) {
        const timeLeft = bannedAccounts[i].timestamp - now;
        if (timeLeft < 0) {
            bannedAccounts.splice(i, 1);
        }
        embed.addField('Name', bannedAccounts[i].name);
        embed.addField('Time', timestampToReadable(timeLeft));
    }
    message.reply(embed);

};

const cmdRegex = /[^\s"]+|"([^"]*)"/gi;

client.on('message', async (message) => {
    try {
        if (message.content.startsWith(PREFIX)) {
            let input = [];
            do {
                const match = cmdRegex.exec(message);
                if (match != null) {
                    input.push(match[1] ? match[1] : match[0]);
                }
            } while (match != null);
            //let input = message.content.slice(PREFIX.length).trim().split("\"");
            const command = input.shift();
            console.log(input);
            if (command == 'ban') {
                ban(message, input);
            } else if (command == 'accounts') {
                showAccounts(message);
            }
        }
    }
    catch (e) {
        console.log('roflcopter');
    }
});

const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('ok');
});
server.listen(3000);