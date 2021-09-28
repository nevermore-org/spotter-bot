import Fractal from "../../Model/Guildwars/Fractal";
import { THUMBNAILS } from "./enum/THUMBNAILS";
import View from "./View";
import { EMBED_ID } from "./enum/EMBED_ID";
import { CommandInteraction, MessageEmbed } from "discord.js";

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
            { name: `${fractals[10].name.slice(13)}`, value: this.formatInstabs(instabs, 1) },
            { name: `${fractals[14].name.slice(13)}`, value: this.formatInstabs(instabs, 2) }
        )
    }

    /**
     * Returns formatted string of instabilities
     * @param instabs 
     * @param index
     */
    public formatInstabs(instabs: string[][][], index: number) {
        var formattedInstabs: string = `${instabs[index][0][0]} - ${instabs[index][0][1]} - ${instabs[index][0][2]}`;
        // return three instabilities if the fractal is unique; return 6 if two are possible
        return `${instabs[index].length == 1 ? formattedInstabs :
            `${formattedInstabs} __**OR**__\n ${instabs[index][1][0]} - ${instabs[index][1][1]} - ${instabs[index][1][2]}`}`
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
