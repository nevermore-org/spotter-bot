import { MessageEmbed, MessageActionRow } from "discord.js";

export default interface ViewDefault {
    embed: MessageEmbed,
    color: number,
    title: string,
    thumbnail: string,
    actionRows: [MessageActionRow],
    seed: number
}
