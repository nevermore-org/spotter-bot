import DiscordCommandOption from "./DiscordCommandOption";

// little bit hacky way to deal with this
// in Discord.js they use strings as OptionTypes
// but we kinda sidestepped their wrapper, and use discord API directly
// and since discord api uses numbers as OptionTypes, we kinda have to as well

export default interface DiscordCommandData {
    readonly name: string,
    readonly description: string;
    readonly options: DiscordCommandOption[];
}
