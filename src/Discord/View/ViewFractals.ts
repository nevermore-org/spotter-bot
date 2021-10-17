import { CommandInteraction, EmbedField, MessageEmbed } from "discord.js";
import Fractal from "../../Model/Guildwars/Fractal";
import { THUMBNAILS } from "./enum/THUMBNAILS";
import View from "./View";
import { EMBED_ID } from "./enum/EMBED_ID";
import { DateTime } from "luxon";

export default class ViewFractals extends View {
    thumbnail: string = THUMBNAILS.FRACTAL;
    dailyT4sIndices: number[] = [6, 10, 14];

    /**
     * Should set all properties that are displayable
     * @param fractals
     * @param instabilities
     */
    constructor(fractals: Fractal[], instabilities: string[][][]) {
        super();
        this.setEmbeds(fractals, instabilities);
    }

    /**
     * Sets embeds for the whole view
     * @param fractalsToday 
     * @param fractalsTomorrow 
     * @returns 
     */
    public setEmbeds = async (fractals: Fractal[], instabilities: string[][][]): Promise<ViewFractals> => {
        const todayStr = DateTime.utc().setLocale('en-gb').toLocaleString();
        //Notice the first argument. It's an id that is being set to an embed.
        //Embeds in our context are basically the main "container" for all the properties. E. g. Buttons can't exist without an embed.
        const fractalsEmbed = this.createEmbed(EMBED_ID.FRACTALS, `Fractals for ${todayStr}`, this.thumbnail);
        let offset = 0;

        instabilities.forEach((instability, loopIndex) => {
            // 6, 10 and 14 are daily T4s Indices in fractals data array
            let t4Index = [6, 10, 14][loopIndex];
            fractalsEmbed.addField(`${fractals[t4Index].name.slice(13)}`, this.formatInstability(instability));

            // if the fractal type has two variants, insert one padding field and one with the second variant
            if (instability.length > 1){
                fractalsEmbed.addField('\u180E', '\u180E\n**OR**\n\u180E', true);
                fractalsEmbed.addField('\u180E', this.formatInstability(instability, 1), true);
                
                fractalsEmbed.fields[offset].inline = true;
            }
            
            // number of fields for each row we have - 3 if there are two data fields and one padding
            offset += instability.length > 1 ? 3 : 1;
        })

        // [2, 1, 0] are indices for rec. fractals in fractals data array
        fractalsEmbed.addField(`Recommended fractals`, [2, 1, 0].map(index => fractals[index].name).join('\n'));
        return this
    }
    
    /**
     * Returns formatted string of instabilities
     * @param instability
     * @param variantIndex - index of a variant for a given fractal
     */
     public formatInstability(instab: string[][], variantIndex: number = 0) {
        return [0, 1, 2].map(fractalIndex => instab[variantIndex][fractalIndex]).join('\n');
    }

    /**
     * Sends the very first interaction response that is display after the discord command.
     * It's nice to define it like this, because then we won't "lose" it in longer code.
     * @param interaction 
     */
    public sendFirstInteractionResponse(interaction: CommandInteraction) {
        const todayEmbed: MessageEmbed = this.getEmbed(EMBED_ID.FRACTALS);
        interaction.reply({ embeds: [todayEmbed]})
    }
}
