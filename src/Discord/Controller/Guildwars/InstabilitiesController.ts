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
            .setColor('#EB8258')
            .setTitle("Instabilities")
            .setThumbnail("https://render.guildwars2.com/file/4A5834E40CDC6A0C44085B1F697565002D71CD47/1228226.png")
            // ! really simple view for now, gotta change this somehow
            .addFields( 
                { name: `${data[6].name.slice(13)}`, value: `${instabs[0]}`},
                { name: `${data[10].name.slice(13)}`, value: `${instabs[1]}` },
                { name: `${data[14].name.slice(13)}`, value: `${instabs[2]}` }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embedInstabilities]});
    }
}