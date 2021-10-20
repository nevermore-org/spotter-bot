type OptionChoice = {
    name: string,
    value: string
}

// little bit hacky way to deal with this
// in Discord.js they use strings as OptionTypes
// but we kinda sidestepped their wrapper, and use discord API directly
// and since discord api uses numbers as OptionTypes, we kinda have to as well
type DiscordCommandOption = {
    name: string,
    description: string,
    type: number,
    choices?: OptionChoice[],
    required?: boolean,
    options?: DiscordCommandOption[] | undefined;
}

export default interface DiscordCommandData {
    readonly name: string,
    readonly description: string;
    readonly options: DiscordCommandOption[];
}
