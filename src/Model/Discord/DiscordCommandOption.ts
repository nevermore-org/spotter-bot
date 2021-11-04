type OptionChoice = {
    name: string,
    value: string
}

export default interface DiscordCommandOption {
    name: string,
    description: string,
    type: number,
    choices?: OptionChoice[],
    required?: boolean,
    options?: DiscordCommandOption[] | undefined;
}
