import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import DiscordControllerInterface from "../../../Model/Discord/DiscordControllerInterface";
import FractalAPI from "../../../Guildwars/Fractals/FractalAPI";
import Fractal from "../../../Model/Guildwars/Fractal";

/**
 * /fractals
 */
export default class FractalsController implements DiscordControllerInterface {
    private fractalAPI: FractalAPI;

    constructor() {
        this.fractalAPI = new FractalAPI();
    }

    // anything

    public handleInteraction = async (interaction: CommandInteraction): Promise<void> => {
        const fractalsToday: Fractal[] = await this.fractalAPI.getDailyFractals(true);
        const fractalsTomorrow: Fractal[] = await this.fractalAPI.getDailyFractals(false);
        const seed = Math.random();

        this.createView(interaction, fractalsToday, fractalsTomorrow, seed);
    }

    private createView = async (interaction: CommandInteraction, data: Fractal[], dataTomorrow: Fractal[], seed: number): Promise<void> => {

        const embedDaily = new MessageEmbed()
            .setColor('#BAD4A1')
            .setTitle("Fractal dailies - Today")
            .setThumbnail("https://render.guildwars2.com/file/4A5834E40CDC6A0C44085B1F697565002D71CD47/1228226.png")
            .addFields(
                { name: "T4 Fractals", value: `${data[6].name}\n${data[10].name}\n${data[14].name}` },
                { name: "Recommended fractals", value: `${data[2].name}\n${data[1].name}\n${data[0].name}` },
            )
            .setTimestamp();

        const embedTomorrow = new MessageEmbed()
            .setColor('#BAD4A1')
            .setTitle("Fractal dailies - Tomorrow")
            .setThumbnail("https://render.guildwars2.com/file/4A5834E40CDC6A0C44085B1F697565002D71CD47/1228226.png")
            .addFields(
                { name: "T4 Fractals", value: `${dataTomorrow[6].name}\n${dataTomorrow[10].name}\n${dataTomorrow[14].name}` },
                { name: "Recommended fractals", value: `${dataTomorrow[2].name}\n${dataTomorrow[1].name}\n${dataTomorrow[0].name}` },
            )
            .setTimestamp();

        const buttonToday = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`today${seed}`)
                    .setLabel('Switch to Today')
                    .setStyle('SUCCESS')
            );

        const buttonTomorrow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(`tomorrow${seed}`)
                    .setLabel('Switch to Tomorrow')
                    .setStyle('PRIMARY')
            );


        const collector = interaction.channel?.createMessageComponentCollector({ componentType: 'BUTTON'});

        collector?.on("collect", async interaction => {
            try {
                if (interaction.customId === `tomorrow${seed}`){
                    await interaction.update({embeds: [embedTomorrow], components:[buttonToday]})
                }
                else if (interaction.customId === `today${seed}`) {
                    await interaction.update({embeds: [embedDaily], components:[buttonTomorrow]})                    
                }
            }
            catch(err){
                console.log("something's wrong");
            }

        });

        await interaction.reply({ embeds: [embedDaily], components: [buttonTomorrow] });
    }
}
