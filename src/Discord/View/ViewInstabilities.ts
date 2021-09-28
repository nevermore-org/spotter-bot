import Fractal from "../../Model/Guildwars/Fractal";
import { THUMBNAILS } from "./enum/THUMBNAILS";
import View from "./View";
import { EMBED_ID } from "./enum/EMBED_ID";
import { CommandInteraction, EmbedFieldData, EmbedField, MessageEmbed } from "discord.js";
import { getConstantValue, isVariableDeclaration } from "typescript";
import { NONAME } from "dns";

export default class ViewInstabilities extends View {
    thumbnail: string = THUMBNAILS.INSTABILITY;

    public constructor(fractals: Fractal[], instabilities: string[][][]) {
        super();
        this.setEmbeds(fractals, instabilities);
    }

    /**
     * Sets embeds
     * @param fractals 
     * @param instabs 
     */
    public setEmbeds(fractals: Fractal[], instabs: string[][][]) {
        const instabilitiesEmbed = this.createEmbed(EMBED_ID.FRACTAL_INSTABILITES, "Instabilities", this.thumbnail);

        instabilitiesEmbed.addFields(
            { name: `${fractals[6].name.slice(13)}`, value: this.formatInstabs(instabs, 0) },
            { name: `${fractals[10].name.slice(13)}`, value: this.formatInstabs(instabs, 1)},
            { name: `${fractals[14].name.slice(13)}`, value: this.formatInstabs(instabs, 2) }
        )

        const index = this.findIndex(instabs);

        if (index){
            this.insertField(instabilitiesEmbed, index, instabs);
        }
    }

    /**
     * Returns index of the fractal type which has two variants, if there is any such type
     * @param instabs 
     */    
    private findIndex(instabs: string[][][]){
        for (let index = 0; index < instabs.length - 1; index++){
            if (instabs[index].length > 1){
                return index;
            }
        }
        return null;
    }

        
    /**
     * Inserts two fields (one with padding, one with data) into the embed.fields array after the given index
     * @param instabs 
     */    
    private insertField(embed: MessageEmbed, index: number, instabs: string[][][]){
        const columnValue = this.formatInstabs(instabs, index, 1);
        const inlineField: EmbedField = {name:'\u180E', value: columnValue, inline: true};
        
        // need one inline field of mongolianVowelSeparators for a proper formatting
        const mongolianVowelSeparator: EmbedField = {name:'\u180E', value: '\u180E\n**OR**\n\u180E', inline: true}

        embed.fields.splice(index + 1, 0, inlineField);
        embed.fields.splice(index + 1, 0, mongolianVowelSeparator);

        embed.fields[index].inline = true;     
    }

    /**
     * Returns formatted string of instabilities
     * @param instabs 
     * @param index
     */
    public formatInstabs(instabs: string[][][], fractalIndex: number, variantIndex: number = 0) {
        return `${instabs[fractalIndex][variantIndex][0]}\n${instabs[fractalIndex][variantIndex][1]}\n${instabs[fractalIndex][variantIndex][2]}`;
    }

    /**
     * Returns first interaction response
     * @param interaction 
     */
    public sendFirstInteractionResponse(interaction: CommandInteraction) {
        const instabilitiesEmbed: MessageEmbed = this.getEmbed(EMBED_ID.FRACTAL_INSTABILITES);
        interaction.reply({ embeds: [instabilitiesEmbed] })
    }
}
