import { CommandInteraction, MessageActionRow, MessageEmbed } from "discord.js";
import Fractal from "../../Model/Guildwars/Fractal";
import { THUMBNAILS } from "./enum/THUMBNAILS";
import View from "./View";
import { EMBED_ID } from "./enum/EMBED_ID";

export default class ViewFractals extends View {
    thumbnail: string = THUMBNAILS.FRACTAL;

    /**
     * Should set all properties that are displayable
     * @param interaction 
     * @param fractalsToday 
     * @param fractalsTomorrow 
     */
    constructor(interaction: CommandInteraction, fractalsToday: Fractal[], fractalsTomorrow: Fractal[]) {
        super();
        this.setEmbeds(fractalsToday, fractalsTomorrow);
        this.setButtons();
        this.setButtonBehaviors(interaction);
    }

    /**
     * Sets embeds for the whole view
     * @param fractalsToday 
     * @param fractalsTomorrow 
     * @returns 
     */
    public setEmbeds = async (fractalsToday: Fractal[], fractalsTomorrow: Fractal[]): Promise<ViewFractals> => {
        //Notice the first argument. It's an id that is being set to a embed.
        //Embeds in our context are basically the main "container" for all the properties. E. g. Buttons can't exist without a embed.
        //If I want to add/access e. g. an action row from a specific embed, I use the embed ID (see line 59).
        const fractalsTodayEmbed = this.createEmbed(EMBED_ID.FRACTAL_TODAY, "Fractal dailies - Today", this.thumbnail);
        const fractalsTomorrowEmbed = this.createEmbed(EMBED_ID.FRACTAL_TOMORROW, "Fractal dailies - Tomorrow", this.thumbnail);

        fractalsTodayEmbed.addFields(
            { name: "T4 Fractals", value: `${fractalsToday[6].name}\n${fractalsToday[10].name}\n${fractalsToday[14].name}` },
            { name: "Recommended fractals", value: `${fractalsToday[2].name}\n${fractalsToday[1].name}\n${fractalsToday[0].name}` },
        )

        fractalsTomorrowEmbed.addFields(
            { name: "T4 Fractals", value: `${fractalsTomorrow[6].name}\n${fractalsTomorrow[10].name}\n${fractalsTomorrow[14].name}` },
            { name: "Recommended fractals", value: `${fractalsTomorrow[2].name}\n${fractalsTomorrow[1].name}\n${fractalsTomorrow[0].name}` },
        )
        return this
    }

    /**
     * Sets buttons for the whole view
     */
    public setButtons() {
        this.addActionRowToEmbed(EMBED_ID.FRACTAL_TODAY).addButton(EMBED_ID.FRACTAL_TODAY, 0, "Switch to Tomorrow");
        this.addActionRowToEmbed(EMBED_ID.FRACTAL_TOMORROW).addButton(EMBED_ID.FRACTAL_TOMORROW, 0, "Switch to Today", "SUCCESS");
    }

    /**
     * Should define behavior for the buttons (only if any are present)
     * Not sure if it should be split into two methods (active and inactive behavior). Time will tell.
     * @param interaction 
     * @returns 
     */
    public setButtonBehaviors = async (interaction: CommandInteraction): Promise<ViewFractals> => {
        const collector = interaction.channel?.createMessageComponentCollector({ componentType: 'BUTTON', time: 30000 });

        const todayEmbed: MessageEmbed = this.getEmbed(EMBED_ID.FRACTAL_TODAY);
        const tomorrowEmbed: MessageEmbed = this.getEmbed(EMBED_ID.FRACTAL_TOMORROW);

        const todayActionRow: MessageActionRow = this.getActionRow(EMBED_ID.FRACTAL_TODAY, 0);
        const tomorrowActionRow: MessageActionRow = this.getActionRow(EMBED_ID.FRACTAL_TOMORROW, 0);

        collector?.on("collect", async interaction => {
            try {
                if (interaction.customId === `${EMBED_ID.FRACTAL_TODAY}${this.seed}`) {
                    await interaction.update({ embeds: [tomorrowEmbed], components: [tomorrowActionRow] })
                }
                else if (interaction.customId === `${EMBED_ID.FRACTAL_TOMORROW}${this.seed}`) {
                    await interaction.update({ embeds: [todayEmbed], components: [todayActionRow] })
                }
            }
            catch (err) {
                console.log(err);
            }
        });

        collector?.on("end", collected => {
            const lastId = collected.last()?.customId;

            todayActionRow.components[0].setDisabled(true);
            tomorrowActionRow.components[0].setDisabled(true);

            interaction.editReply({
                embeds: [lastId?.includes(EMBED_ID.FRACTAL_TODAY) || collected.size === 0 ? todayEmbed : tomorrowEmbed],
                components: [lastId?.includes(EMBED_ID.FRACTAL_TODAY) || collected.size === 0 ? todayActionRow : tomorrowActionRow]
            });
        });

        return this;
    }

    /**
     * Sends the very first interaction response that is display after the discord command.
     * It's nice to define it like this, because then we won't "lose" it in longer code.
     * @param interaction 
     */
    public sendFirstInteractionResponse(interaction: CommandInteraction) {
        const todayEmbed: MessageEmbed = this.getEmbed(EMBED_ID.FRACTAL_TODAY);
        const todayActionRow: MessageActionRow = this.getActionRow(EMBED_ID.FRACTAL_TODAY, 0);
        interaction.reply({ embeds: [todayEmbed], components: [todayActionRow] })
    }
}
