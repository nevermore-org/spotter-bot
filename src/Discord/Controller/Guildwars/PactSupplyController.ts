import { CommandInteraction } from "discord.js";
import DiscordControllerInterface from "../../../Model/Discord/DiscordControllerInterface";
import PactSupplyAPI from "../../../Guildwars/PactSupply/PactSupplyApi";
import ViewPactSupply from "../../View/ViewPactSupply";



export default class PactSupplyController implements DiscordControllerInterface {
    private pactSupplyApi: PactSupplyAPI;

    constructor() {
        this.pactSupplyApi = new PactSupplyAPI();
    }

    /**
     * Handles discord interaction
     * @param interaction 
     */
    public handleInteraction = async (interaction: CommandInteraction): Promise<void> => {
        const items = await this.pactSupplyApi.getPSNAItems();

        const view = new ViewPactSupply(items);
        view.sendFirstInteractionResponse(interaction);
    }
}
