import Fractal from "../../Model/Guildwars/Fractal";
import { THUMBNAILS } from "./THUMBNAILS";
import View from "./View";

export default class ViewInstabilities extends View{
    thumbnail = THUMBNAILS.INSTABILITY;
    title = "Instabilities";

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
     * Adds the data to the embed
     * @param fractals 
     * @param instabs
     */
    public getEmbed(fractals: Fractal[], instabs: string[][][]){
        this.embed.addFields(
            { name: `${fractals[6].name.slice(13)}`, value: this.formatInstabs(instabs, 0) },
            { name: `${fractals[10].name.slice(13)}`, value: this.formatInstabs(instabs, 1) },
            { name: `${fractals[14].name.slice(13)}`, value: this.formatInstabs(instabs, 2) }
        )
        return this.embed;
    }

}
