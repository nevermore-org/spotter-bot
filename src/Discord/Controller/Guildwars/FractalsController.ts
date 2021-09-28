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

        const viewToday = new ViewFractals(true).createDefault(seed)
        const viewTomorrow = new ViewFractals(false).createDefault(seed)

        const embedToday = viewToday.getEmbed(dataToday);
        const embedTomorrow = viewTomorrow.getEmbed(dataTomorrow);

        const rowToday = viewToday.addButton(0, 'today', 'Switch to Today', 'SUCCESS').getRow(0);
        const rowTomorrow = viewTomorrow.addButton(0, 'tomorrow', 'Switch to Tomorrow').getRow(0);

        
        const collector = interaction.channel?.createMessageComponentCollector({ componentType: 'BUTTON', time: 30000});

        collector?.on("collect", async interaction => {
            try {
                if (interaction.customId === `tomorrow${seed}`){
                    await interaction.update({embeds: [embedTomorrow], components: [rowToday]})
                }
                else if (interaction.customId === `today${seed}`) {
                    await interaction.update({embeds: [embedToday], components: [rowTomorrow]})                    
                }
            }
            catch(err){
                console.log("something's wrong");
            }

        });

        collector?.on("end", collected => {
            const lastId = collected.last()?.customId.slice(0, 5);

            rowToday.components[0].setDisabled(true);
            rowTomorrow.components[0].setDisabled(true);

            interaction.editReply({
                embeds: [lastId === "today" || collected.size === 0 ? embedToday : embedTomorrow], 
                components:[lastId === "today" || collected.size === 0 ? rowTomorrow : rowToday]
            }); 
        });

        await interaction.reply({ embeds: [embedToday], components: [rowTomorrow]});
    }
}
