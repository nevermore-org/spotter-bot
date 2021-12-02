import { DateTime, Duration } from "luxon";
import Item from "../Model/Guildwars/Item";


/**
 * Returns closest boss timing from now as Duration object (of milisecs)
 * @param schedule needs to have the day's first timing as the first one in array 
 */
export function calcBoss(schedule: string[] = [""]) {

    // array of Duration objects between now and all the timings in a given schedule
    // will be negative if the timing was in the past
    const diffSchedule = schedule.map(time => DateTime.fromFormat(time, "T", {zone: 'utc'}).diff(DateTime.utc()));

    // only want timings in the future
    const timesAhead = diffSchedule.filter(time => time.milliseconds > 0);
    
    // if there is no timing in the future -> the next timing will be the first one of tomorrow (hence today's first + 1 day)
    return timesAhead.length ? timesAhead[0] : diffSchedule[0].plus({days: 1});
}

/**
 * Returns pretty string output of Duration 
 * e.g. 2 hour(s) and 6 minute(s)
 * @param duration
 */
export function prettifyDuration(duration: Duration) {
    // dont want to show hours if there is less than hour remaining till the boss
    // there is a interesting bug which happens if the duration is longer than 2 hours - displays the time converted to minutes
    return duration.toFormat(`${duration.milliseconds > 3600000 ? "h 'hour(s) and '" : "" }m 'minute(s)'`);
}

// assumes both arrays are of the same length
export function zipArraysAsMap(keyArray: string[], valueArray: string[]){
    const map: Map<string, string> = new Map();

    keyArray.forEach((key, index) => {
        map.set(key, valueArray[index]);
    });

    return map;
}

/**
 * Returns argument string in title case
 * separator is only used to recognize words in the input string
 * e.g. random words => Random Words
 */
export const titleCase = (str: string, separator: string = ' ') => {
    return str
        .toLowerCase()
        .split(separator)
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join(' ');
};


/**
 * Sort items based on their rarities
 * Returns a map with rarity-names as keys and matching items as elements of the value/array
 */
export function createRarityItemMap(items: Item[], rarities: string[]){
    var itemMap: Map<string, Item[]> = new Map();
    rarities.forEach( rarity => itemMap.set(rarity, []));

    items.forEach( item => {
        itemMap.get(item.rarity)?.push(item);
    })

    return itemMap;
}

export function chunkify <T>(items: T[], chunkSize: number) {
    var chunks = [],
        index = 0,
        originLen = items.length;
  
    while (index < originLen) {
      chunks.push(items.slice(index, index += chunkSize));
    }
  
    return chunks;
}


export const objectWithoutKey = <T>(object:Record<string, T>, key:string) => {
    const {[key]: _, ...otherKeys} = object;
    return otherKeys;
}

/**
 * returns A \ B, as Set, faster 
 * @param setA 
 * @param setB 
 */
export const differenceSet = <T>(setA: Set<T>, setB: Set<T>) => {
    return new Set([...setA].filter( element => !setB.has(element)));
}

/**
 * return A \ B, as Array, slower than set, should be called on smaller
 */
export const differenceArray = <T>(arrA: Array<T>, arrB: Array<T>) => {
    return [...arrA].filter( element => !arrB.includes(element));
}

/**
 * From https://github.com/sindresorhus/escape-string-regexp
 * Will come in handy for the names of API keys, since those are unescaped
 */ 
export function escapeStringRegexp(unescapedString: string) {
	// Escape characters with special meaning either inside or outside character sets.
	// Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
	return unescapedString
		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		.replace(/-/g, '\\x2d');
}
