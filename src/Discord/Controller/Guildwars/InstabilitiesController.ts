import { CommandInteraction } from "discord.js";
import DiscordControllerInterface from "../../../Model/Discord/DiscordControllerInterface";
import FractalAPI from "../../../Guildwars/Fractals/FractalAPI";
import Fractal from "../../../Model/Guildwars/Fractal";
import BaseFractal from "../../../Model/Guildwars/BaseFractal";
import ViewInstabilities from "../../View/ViewInstabilities";

/**
 * Sends instabilites for todays T4s
 */
export default class InstabilitiesController implements DiscordControllerInterface {
    private fractalAPI: FractalAPI;

    constructor() {
        this.fractalAPI = new FractalAPI();
    }

    /**
     * Handles discord interaction
     * @param interaction 
     */
    public handleInteraction = async (interaction: CommandInteraction): Promise<void> => {
        const fractals: Fractal[] = await this.fractalAPI.getDailyFractals(true);
        const levels: BaseFractal[][] = this.fractalAPI.getDailyT4Levels(fractals);
        const instabs: string[][][] = this.fractalAPI.getDailyInstabilities(levels);

        const view = new ViewInstabilities(fractals, instabs);
        view.sendFirstInteractionResponse(interaction);
    }
}
