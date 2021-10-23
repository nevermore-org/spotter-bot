import { CommandInteraction } from "discord.js";
import GuildAPI from "../../../Guildwars/Guild/GuildAPI";
import DiscordControllerInterface from "../../../Model/Discord/DiscordControllerInterface";
import Item from "../../../Model/Guildwars/Item";
import ViewGuildStash from "../../View/ViewGuildStash";



export default class GuildStashController implements DiscordControllerInterface {
    private guildAPI: GuildAPI;

    constructor() {
        this.guildAPI = new GuildAPI();
    }

    /**
     * Handles discord interaction
     * @param interaction 
     */
    public handleInteraction = async (interaction: CommandInteraction): Promise<void> => {
        if(!process.env.GW_API_KEY_GUILD) {return};
        
        const items: Item[] = await this.guildAPI.getStashItems(process.env.GW_API_KEY_GUILD);
        const subcmd: string = interaction.options.data[0].name;     

        const view = new ViewGuildStash(items, subcmd);
        view.sendFirstInteractionResponse(interaction);
    }
}
