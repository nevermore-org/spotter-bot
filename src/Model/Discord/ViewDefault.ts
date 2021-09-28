import { MessageEmbed, MessageActionRow } from "discord.js";

export default interface ViewDefault {
    embeds: Map<string, MessageEmbed>;
    defaultColor: number;
    defaultTitle: string;
    defaultThumbnail: string;
    actionRows: Map<string, MessageActionRow[]>;
    seed: number;
}
