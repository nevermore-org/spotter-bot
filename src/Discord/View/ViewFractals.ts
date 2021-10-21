import { CommandInteraction, EmbedField, MessageEmbed } from "discord.js";
import Fractal from "../../Model/Guildwars/Fractal";
import { THUMBNAILS } from "./enum/THUMBNAILS";
import View from "./View";
import { EMBED_ID } from "./enum/EMBED_ID";
import { DateTime } from "luxon";
import BaseFractal from "../../Model/Guildwars/BaseFractal";

export default class ViewFractals extends View {
    thumbnail: string = THUMBNAILS.FRACTAL;
    //todayStr: string;

    /**
     * ////Should set all properties that are displayable
     */
    constructor() {
        super();
        // this.todayStr = DateTime.utc().setLocale('en-gb').toLocaleString();
    }

    /**
     * Set embed to daily T4s + recs
     * @param levels
     * @param instabilities
     * @param recommended
     * @returns 
     */
    public setEmbedToDaily = (levels: BaseFractal[][], instabilities: string[][][], recommended: string[]): ViewFractals => {
        
        //Notice the first argument. It's an id that is being set to an embed.
        //Embeds in our context are basically the main "container" for all the properties. E. g. Buttons can't exist without an embed.
        const fractalsEmbed = this.createEmbed(EMBED_ID.FRACTALS, `Daily T4s + Recs`, this.thumbnail);
        let offset = 0;

        instabilities.forEach((instability, loopIndex) => {
            fractalsEmbed.addField(`${levels[loopIndex][0].name}`, this.formatInstability(instability));

            // if the fractal type has two variants, insert one padding field and one with the second variant
            if (instability.length > 1){
                fractalsEmbed.addField('\u180E', '\u180E\n**OR**\n\u180E', true);
                fractalsEmbed.addField('\u180E', this.formatInstability(instability, 1), true);
                
                fractalsEmbed.fields[offset].inline = true;
            }
            
            // number of fields for each row we have - 3 if there are two data fields and one padding
            offset += instability.length > 1 ? 3 : 1;
        })

        fractalsEmbed.addField(`Recommended fractals`, recommended.join('\n'));
        return this
    }

    /**
     * Create new embed and set it to Daily CMs
     * @param levels
     * @param instabilities
     */

    public setEmbedToCMs = (levels: BaseFractal[][], instabilities: string[][][]): ViewFractals => {
        const CMsEmbed = this.createEmbed(EMBED_ID.FRACTALS, `Daily CMs`, this.thumbnail);
        
        instabilities.forEach((instability, index) => {
            CMsEmbed.addField(`${levels[index][0].name}`, this.formatInstability(instability));
        })

        return this;        
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
     * Sends the very first interaction response that is displayed after the discord command.
     * It's nice to define it like this, because then we won't "lose" it in longer code.
     * @param interaction 
     */
    public sendFirstInteractionResponse(interaction: CommandInteraction) {
        const dailyEmbed: MessageEmbed = this.getEmbed(EMBED_ID.FRACTALS);
        interaction.reply({ embeds: [dailyEmbed]})
    }
}
