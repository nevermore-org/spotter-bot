import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import DiscordControllerInterface from "../../../model/discord/DiscordControllerInterface";
import DailyAPI from "../../../guildwars/DailyAPI";
import Fractal from "../../../model/guildwars/Fractal";

/**
 * /fractals
 */
export default class FractalsController implements DiscordControllerInterface {
    private dailyAPI: DailyAPI;

    constructor() {
        this.dailyAPI = new DailyAPI();
    }

    public handleInteraction = async (interaction: CommandInteraction): Promise<void> => {
        const fractals: Fractal[] = await this.dailyAPI.getTodayFractals();
        this.createView(interaction, fractals);
    }

    private createView = async (interaction: CommandInteraction, data: Fractal[]): Promise<void> => {
        const embedDaily = new MessageEmbed()
            .setColor('#BAD4A1')
            .setTitle("Fractal dailies")
            .setThumbnail("https://render.guildwars2.com/file/4A5834E40CDC6A0C44085B1F697565002D71CD47/1228226.png")
            .addFields(
                { name: "T4 Fractals", value: `${data[6].name}\n${data[10].name}\n${data[14].name}` },
                { name: "Recommended fractals", value: `${data[0].name}\n${data[1].name}\n${data[2].name}` },
            )
            .setTimestamp();

        const embedRecs = new MessageEmbed()
            .setColor('#BAD4A1')
            .setTitle("Fractal recommended")
            .setThumbnail("https://render.guildwars2.com/file/4A5834E40CDC6A0C44085B1F697565002D71CD47/1228226.png")
            .addFields(
                { name: "Recommended fractals", value: `${data[0].name}\n${data[1].name}\n${data[2].name}` },
            )
            .setTimestamp();

        // const buttonsDaily = new MessageActionRow()
        //     .addComponents(
        //         new MessageButton()
        //             .setCustomId('daily')
        //             .setLabel('Daily')
        //             .setStyle('PRIMARY')
        //             .setDisabled(true),
        //         new MessageButton()
        //             .setCustomId('recs')
        //             .setLabel('Recommended')
        //             .setStyle('SECONDARY'),
        //     );

        // const buttonsRecs = new MessageActionRow()
        //     .addComponents(
        //         new MessageButton()
        //             .setCustomId('daily')
        //             .setLabel('Daily')
        //             .setStyle('SECONDARY'),
        //         new MessageButton()
        //             .setCustomId('recs')
        //             .setLabel('Recommended')
        //             .setStyle('PRIMARY')
        //             .setDisabled(true)
        //     );

        // const collector = interaction.channel?.createMessageComponentCollector();

        // collector?.on("collect", async interaction => {
        //     try {
        //         if (interaction.customId === "daily")
        //             await interaction.update({ embeds: [embedDaily] });
        //         else if (interaction.customId === "recs")
        //             await interaction.update({ embeds: [embedRecs]});
        //     }
        //     catch (err) {

        //     }
        // });

        await interaction.reply({ embeds: [embedDaily] });
    }
}