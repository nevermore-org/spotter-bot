import { CommandInteraction } from "discord.js";
import DiscordControllerInterface from "../../../Model/Discord/DiscordControllerInterface";
import FractalAPI from "../../../Guildwars/Fractals/FractalAPI";
import Fractal from "../../../Model/Guildwars/Fractal";
import ViewFractals from "../../View/ViewFractals";
import BaseFractal from "../../../Model/Guildwars/BaseFractal";
import GW_FRACTALS from "../../../Guildwars/Fractals/enum/GW_FRACTALS";
import { AchievementMod } from "../../../Model/Guildwars/Achievement";
import { FractalInfo, InstabFractalInfo } from "../../../Model/Guildwars/FractalInfo";

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
        const commandOption = interaction.options.data[0].value;
        const view = new ViewFractals()

        // it is split just so we dont always use GW_API
        // especially in cases when its not really needed (like CMs for example)
        
        if (commandOption === 'daily'){
            const dailyFractals: FractalInfo[] = await this.fractalAPI.getDailyFractals();

            const recs = dailyFractals.filter(fractal_info => fractal_info.type === "Recommended");
            const t4Fractals: FractalInfo[] = dailyFractals.filter(fractal_info => fractal_info && fractal_info.type === "DailyT4");
            const instabs: InstabFractalInfo[] = this.fractalAPI.getInstabilities(t4Fractals);

            view.setEmbeds('daily', instabs, recs);
        }

        else if(commandOption === 'cm'){
            const CMs: FractalInfo[] = GW_FRACTALS.slice(-3).map(CM => {return {name: CM.name, levels: [CM.level], type: 'DailyCM'}});
            const instabsCMs: InstabFractalInfo[] = this.fractalAPI.getInstabilities(CMs);
            
            view.setEmbeds('cm', instabsCMs);
        }
        else{throw "Dunno how you got here, but welcome!"}

        view.sendFirstInteractionResponse(interaction);
    }    
}
