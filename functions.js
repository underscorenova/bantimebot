const timestampToReadable = (timestamp) => {
    var units = {
        year  : 24 * 60 * 60 * 1000 * 365,
        month : 24 * 60 * 60 * 1000 * 365/12,
        day   : 24 * 60 * 60 * 1000,
        hour  : 60 * 60 * 1000,
        minute: 60 * 1000,
        second: 1000
    };
    var rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
    for (var u in units) {
        if (Math.abs(timestamp) > units[u] || u == 'second') {
            return rtf.format(Math.round(timestamp/units[u]), u)
        }
    }
};

const readableToTimestamp = (readable) => {
    let date = new Date();
    readable = readable.toLowerCase();
    const regex = /\d+/g;
    const length = regex.exec(readable);
    if(length == null || length.length === 0) return 0;
    if (readable.includes('days') || readable.includes('day')) {
        date.setTime(date.getTime() + (length * 1000 * 60 * 60 * 24));
    } else if (readable.includes('hours') || readable.includes('hour')) {
        date.setTime(date.getTime() + length * 1000 * 60 * 60);
    } else if (readable.includes('minutes') || readable.includes('minute')) {
        date.setTime(date.getTime() + length * 1000 * 60);
    } else if (readable.includes('seconds') || readable.includes('second')) {
        date.setTime(date.getTime() + length * 1000);
    } else {
        return 0;
    }
    return date.getTime();
};

module.exports = {
    timestampToReadable,
    readableToTimestamp
}