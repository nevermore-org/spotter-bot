import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import DiscordControllerInterface from "../../../Model/Discord/DiscordControllerInterface";
import DailyAPI from "../../../Guildwars/DailyAPI";
import Fractal from "../../../Model/Guildwars/Fractal";

export default class InstabilitiesController implements DiscordControllerInterface {
    private dailyAPI: DailyAPI;

    constructor() {
        this.dailyAPI = new DailyAPI();
    }

    public handleInteraction = async (interaction: CommandInteraction): Promise<void> => {
        const fractals: Fractal[] = await this.dailyAPI.getDailyFractals(true);
        const levels: string[][] = this.dailyAPI.getDailyFractalsLevels(fractals);
        const instabs: string[][][] = this.dailyAPI.getDailyInstabilities(levels);

        this.createView(interaction, fractals, instabs);
    }

    private createView = async (interaction: CommandInteraction, data: Fractal[], instabs: string[][][]): Promise<void> => {

        const embedInstabilities = new MessageEmbed()
            .setColor('#BAD4A1')
            .setTitle("Instabilities")
            .setThumbnail("https://wiki.guildwars2.com/images/6/6f/Mists_Convergence_Overhead.png") // might want to change this later
            
            .addFields( 
                { name: `${data[6].name.slice(13)}`, value: this.dailyAPI.formatInstabilities(instabs, 0)},
                { name: `${data[10].name.slice(13)}`, value: this.dailyAPI.formatInstabilities(instabs, 1) },
                { name: `${data[14].name.slice(13)}`, value: this.dailyAPI.formatInstabilities(instabs, 2) }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embedInstabilities]});
    }
}