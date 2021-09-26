import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import DiscordControllerInterface from "../../../Model/Discord/DiscordControllerInterface";
import FractalAPI from "../../../Guildwars/Fractals/FractalAPI";
import Fractal from "../../../Model/Guildwars/Fractal";
import BaseFractal from "../../../Model/Guildwars/BaseFractal";
import ViewInstabilities from "../../View/ViewInstabilities";

export default class InstabilitiesController implements DiscordControllerInterface {
    private fractalAPI: FractalAPI;

    constructor() {
        this.fractalAPI = new FractalAPI();
    }

    public handleInteraction = async (interaction: CommandInteraction): Promise<void> => {
        const fractals: Fractal[] = await this.fractalAPI.getDailyFractals(true);
        const levels: BaseFractal[][] = this.fractalAPI.getDailyT4Levels(fractals);
        const instabs: string[][][] = this.fractalAPI.getDailyInstabilities(levels);

        this.createView(interaction, fractals, instabs);
    }

    private createView = async (interaction: CommandInteraction, data: Fractal[], instabs: string[][][]): Promise<void> => {
        const embedInstabilities = new ViewInstabilities().createDefault().getEmbed(data, instabs);

        await interaction.reply({ embeds: [embedInstabilities] });
    }
}
