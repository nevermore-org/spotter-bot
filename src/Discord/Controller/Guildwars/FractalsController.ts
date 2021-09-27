import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import DiscordControllerInterface from "../../../Model/Discord/DiscordControllerInterface";
import FractalAPI from "../../../Guildwars/Fractals/FractalAPI";
import Fractal from "../../../Model/Guildwars/Fractal";
import ViewFractals from "../../View/ViewFractals";

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

    private createView = async (interaction: CommandInteraction, dataToday: Fractal[], dataTomorrow: Fractal[], seed: number): Promise<void> => {

        const embedToday = new ViewFractals(true).createDefault().getEmbed(dataToday);
        const embedTomorrow = new ViewFractals(false).createDefault().getEmbed(dataTomorrow);

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


        const collector = interaction.channel?.createMessageComponentCollector({ componentType: 'BUTTON', time: 30000});

        collector?.on("collect", async interaction => {
            try {
                if (interaction.customId === `tomorrow${seed}`){
                    await interaction.update({embeds: [embedTomorrow], components:[buttonToday]})
                }
                else if (interaction.customId === `today${seed}`) {
                    await interaction.update({embeds: [embedToday], components:[buttonTomorrow]})                    
                }
            }
            catch(err){
                console.log("something's wrong");
            }

        });

        collector?.on("end", collected => {
            const lastId = collected.last()?.customId.slice(0, 5);

            buttonToday.components[0].setDisabled(true);
            buttonTomorrow.components[0].setDisabled(true);

            interaction.editReply({
                embeds: [lastId === "today" || collected.size === 0 ? embedToday : embedTomorrow], 
                components:[lastId === "today" || collected.size === 0 ? buttonTomorrow : buttonToday]
            }); 
        });

        await interaction.reply({ embeds: [embedToday], components: [buttonTomorrow] });
    }
}
