import { CommandInteraction } from "discord.js";
import DiscordControllerInterface from "../../../Model/Discord/DiscordControllerInterface";
import FractalAPI from "../../../Guildwars/Fractals/FractalAPI";
import Fractal from "../../../Model/Guildwars/Fractal";
import ViewFractals from "../../View/ViewFractals";

/**
 * Sends daily fractals for today or tomorrow
 */
export default class FractalsController implements DiscordControllerInterface {
    private fractalAPI: FractalAPI;

    constructor() {
        this.fractalAPI = new FractalAPI();
    }

    /**
     * Handles discord interaction
     * @param interaction 
     */
    public handleInteraction = async (interaction: CommandInteraction): Promise<void> => {
        const fractalsToday: Fractal[] = await this.fractalAPI.getDailyFractals(true);
        const fractalsTomorrow: Fractal[] = await this.fractalAPI.getDailyFractals(false);

        const view = new ViewFractals(interaction, fractalsToday, fractalsTomorrow);
        view.sendFirstInteractionResponse(interaction);
    }
}
