// https://wiki.guildwars2.com/wiki/API:2/worlds

export default interface WorldInfo {
    id: number; // The world id.
    name: string; // The world name.
    population: string; // The world population level. One of: Low, Medium, High, VeryHigh, Full
}
