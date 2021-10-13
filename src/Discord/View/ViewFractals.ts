import { CommandInteraction, EmbedField, MessageEmbed } from "discord.js";
import Fractal from "../../Model/Guildwars/Fractal";
import { THUMBNAILS } from "./enum/THUMBNAILS";
import View from "./View";
import { EMBED_ID } from "./enum/EMBED_ID";
import { TODAY_STR } from "../../Util/util";

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
        //Notice the first argument. It's an id that is being set to an embed.
        //Embeds in our context are basically the main "container" for all the properties. E. g. Buttons can't exist without an embed.
        const fractalsEmbed = this.createEmbed(EMBED_ID.FRACTALS, `Fractals for ${TODAY_STR}`, this.thumbnail);

        instabilities.forEach((instability, loopIndex) => {
            // 6, 10 and 14 are daily T4s Indices in fractals data array
            let t4Index = [6, 10, 14][loopIndex];
            fractalsEmbed.addField(`${fractals[t4Index].name.slice(13)}`, this.formatInstability(instability));
        })

        // index of the fractal type which has two variants
        // if there isn't any such type, returns -1
        const index = instabilities.findIndex( instability => instability.length > 1);

        if (index !== -1){
            this.insertFieldAtIndex(fractalsEmbed, index, instabilities[index]);
        }

        // `${fractals[2].name}\n${fractals[1].name}\n${fractals[0].name}`
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
     * Inserts two fields (one with padding, one with intab data) into the embed.fields array after the given index
     * @param embed
     * @param index
     * @param instability
     */    
    private insertFieldAtIndex(embed: MessageEmbed, index: number, instability: string[][]){
        const variantData = this.formatInstability(instability, 1);
        const inlineField: EmbedField = {name:'\u180E', value: variantData, inline: true};
        
        // need one inline field of mongolianVowelSeparators for a proper formatting
        const mongolianVowelSeparatorField: EmbedField = {name:'\u180E', value: '\u180E\n**OR**\n\u180E', inline: true}

        embed.fields.splice(index + 1, 0, inlineField);
        embed.fields.splice(index + 1, 0, mongolianVowelSeparatorField);

        embed.fields[index].inline = true;     
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
