// fuuuuu, daily reset happens at 2 AM, NOT at 0:00 (hence why - 3600 * 1000 aka 2 hours)
export function dayOfYear(date: Date = new Date()) {
    return Math.floor((date.valueOf() - 3600 * 1000 - new Date(date.getFullYear(), 0, 0).valueOf()) / 1000 / 60 / 60 / 24);
}
