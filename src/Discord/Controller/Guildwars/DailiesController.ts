import { CommandInteraction } from "discord.js";
import DailiesAPI from "../../../Guildwars/Dailies/DailiesAPI";
import DiscordControllerInterface from "../../../Model/Discord/DiscordControllerInterface";
import ViewDailies from "../../View/ViewDailies";


/**
 * Sends today's dailies
 */
export default class DailiesController implements DiscordControllerInterface {
    private dailiesAPI: DailiesAPI;

    constructor() {
        this.dailiesAPI = new DailiesAPI;
    }

    /**
     * Handles discord interaction
     * @param interaction 
     */
    public handleInteraction = async (interaction: CommandInteraction): Promise<void> => {
        const dailiesToday: string[] = await this.dailiesAPI.getDailies();

        dailiesToday.push("UwU");

        const view = new ViewDailies(dailiesToday);
        view.sendFirstInteractionResponse(interaction);
    }
}
