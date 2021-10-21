import { CommandInteraction } from "discord.js";
import DiscordControllerInterface from "../../../Model/Discord/DiscordControllerInterface";
import FractalAPI from "../../../Guildwars/Fractals/FractalAPI";
import Fractal from "../../../Model/Guildwars/Fractal";
import ViewFractals from "../../View/ViewFractals";
import BaseFractal from "../../../Model/Guildwars/BaseFractal";
import GW_FRACTALS from "../../../Guildwars/Fractals/enum/GW_FRACTALS";

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
        const viewType = interaction.options.data[0].value;
        const view = new ViewFractals()

        // it is split just so we dont always use GW_API
        // especially in cases when its not really needed (like CMs for example)
        // it's not as pretty as it used to be, and won't really be reasonable if we decide to expand fractals "somehow" tho

        if (viewType === 'daily'){
            const fractals: Fractal[] = await this.fractalAPI.getDailyFractals();

            const recs: string[] = fractals.filter(fractal => fractal.recommended).map(fractal => fractal.name);
            const levels: BaseFractal[][] = this.fractalAPI.getDailyT4Levels(fractals);
            const instabs: string[][][] = this.fractalAPI.getInstabilities(levels);
            
            view.setEmbedToDaily(levels, instabs, recs);
        }

        else if(viewType === 'cm'){
            const CMs = GW_FRACTALS.slice(-3);
            // honestly wouldn't work if this wasn't here; ain't happy about that
            const levelsCMs: BaseFractal[][] = CMs.map(CM => [CM]); //// but you gotta do what you gotta do
            const instabsCMs: string[][][] = this.fractalAPI.getInstabilities(levelsCMs);
            
            view.setEmbedToCMs(levelsCMs, instabsCMs);
        }
        else{throw "Dunno how you got here, but welcome!"}

        view.sendFirstInteractionResponse(interaction);
    }    
}
