const timestampToReadable = (timestamp) => {
    const ntos = (number, text) => {
        if (number < 1) {
            return "";
        }
        if (number === 1) {
            return `${number} ${text} `;
        }
        return `${number} ${text}s `
    }
    const seconds = 1000;
    const minutes = seconds * 60;
    const hours = minutes * 60;
    const days = hours * 24;
    const months = days * 365 / 12;
    const monthA = Math.floor(timestamp / months);
    const dayA = Math.floor(timestamp % months / days);
    const hourA = Math.floor(timestamp % days / hours);
    const minuteA = Math.floor(timestamp % hours / minutes);
    const secondA = Math.floor(timestamp % minutes / 1000);
    return ("In " + ntos(monthA, "month") + ntos(dayA, "day") + ntos(hourA, "hour") + ntos(minuteA, "minute") + ntos(secondA, "second")).trim();
};

const readableToTimestamp = (readable) => {
    let date = new Date();
    readable = readable.toLowerCase();
    const nRegex = /\d+\s[a-z]+/g;
    let result, matches = [];
    while (result = nRegex.exec(readable)) {
        matches.push(result);
    }
    let i = matches.length;
    while (i--) {
        const regex = /\d+/g;
        const length = regex.exec(matches[i]);
        if (length == null || length.length === 0) return 0;
        if (matches[i][0].includes('days') || matches[i][0].includes('day')) {
            date.setTime(date.getTime() + (length * 1000 * 60 * 60 * 24));
        } else if (matches[i][0].includes('hours') || matches[i][0].includes('hour')) {
            date.setTime(date.getTime() + length * 1000 * 60 * 60);
        } else if (matches[i][0].includes('minutes') || matches[i][0].includes('minute')) {
            date.setTime(date.getTime() + length * 1000 * 60);
        } else if (matches[i][0].includes('seconds') || matches[i][0].includes('second')) {
            date.setTime(date.getTime() + length * 1000);
        } else {
            return 0;
        }
    }
    return date.getTime();
};
const DUMP_CHANNEL = '905033975905550378';

const getMessageInDumpChannel = async (client) => {
    return client.channels.cache.get(DUMP_CHANNEL).messages.fetch({ limit: 1 });
}

const serialize = async (client, data) => {
    const messages = await getMessageInDumpChannel(client);
    const message = messages.first();
    if (message && message.edit) {
        message.edit(JSON.stringify(data));
    } else {
        client.channels.cache.get(DUMP_CHANNEL).send(JSON.stringify(data));
    }
}

const deserialize = async (client) => {
    const messages = await getMessageInDumpChannel(client);
    const message = messages.first();
    if (message) {
        return [...JSON.parse(message.content)];
    }
    return [];
}



module.exports = {
    timestampToReadable,
    readableToTimestamp,
    serialize,
    deserialize
}