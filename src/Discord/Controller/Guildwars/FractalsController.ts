import { CommandInteraction } from "discord.js";
import DiscordControllerInterface from "../../../Model/Discord/DiscordControllerInterface";
import FractalAPI from "../../../Guildwars/Fractals/FractalAPI";
import Fractal from "../../../Model/Guildwars/Fractal";
import ViewFractals from "../../View/ViewFractals";
import BaseFractal from "../../../Model/Guildwars/BaseFractal";

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
        const fractals: Fractal[] = await this.fractalAPI.getDailyFractals();
        const levels: BaseFractal[][] = this.fractalAPI.getDailyT4Levels(fractals);
        const instabs: string[][][] = this.fractalAPI.getDailyInstabilities(levels);

        const view = new ViewFractals(fractals, instabs);
        view.sendFirstInteractionResponse(interaction);
    }
}
