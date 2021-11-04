import { CommandInteraction, EmbedField, MessageEmbed } from "discord.js";
import { THUMBNAILS } from "./enum/THUMBNAILS";
import View from "./View";
import { EMBED_ID } from "./enum/EMBED_ID";
import { DateTime } from "luxon";
import { FractalInfo, InstabFractalInfo } from "../../Model/Guildwars/FractalInfo";

export default class ViewFractals extends View {
    thumbnail: string = THUMBNAILS.FRACTAL;
    todayStr: string;
    titlesMap: Record<string, string> = {'daily': `Daily T4s + Recs`, 'cm': `Daily CMs`};

    /**
     *
     */
    constructor(wantTomorrow: boolean = false) {
        super();
        // DateTime.utc().plus({days: wantTomorrow ? 1 : 0}).setLocale('en-gb').toLocaleString();
        this.todayStr = wantTomorrow ? "(Tomorrow)" : "";
        
    }

    /**
     * Sets the fractal embed; is called for all command options
     * @param commandOption 
     * @param fractals 
     * @param recs 
     * @returns 
     */
    public setEmbeds = (commandOption: string, fractals: InstabFractalInfo[], recs: FractalInfo[] = []): ViewFractals => {
        const fractalsEmbed = this.createEmbed(EMBED_ID.FRACTALS, `${this.titlesMap[commandOption]} ${this.todayStr}`, this.thumbnail);
        let offset = 0;

        fractals.forEach(fractal => {
            fractalsEmbed.addField(`${fractal.name}`, this.formatInstabilities(fractal.instabilities));

            // if the fractal type has two variants, insert one padding field and one with the second variant
            if (fractal.instabilities.length > 1){
                fractalsEmbed.addField('\u180E', '\u180E\n**OR**\n\u180E', true);
                fractalsEmbed.addField('\u180E', this.formatInstabilities(fractal.instabilities, 1), true);
                
                fractalsEmbed.fields[offset].inline = true;
            }
            
            // number of fields for each row we have - 3 if there are two data fields and one padding
            offset += fractal.instabilities.length > 1 ? 3 : 1;
                        
        });

        // basically if you want to show recommended fractals or not
        if(recs.length > 0) {
            const sortedRecs = recs.sort((a, b) => b.levels[0] - a.levels[0]); // DESC order
            fractalsEmbed.addField(`Recommended fractals`, `${sortedRecs.map(rec => [rec.levels[0], rec.name].join(" ")).join("\n")}`);
        }

        return this;
    }
    
    /**
     * Returns formatted string of instabilities
     * @param instability
     * @param variantIndex - index of a variant for a given fractal
     */
     public formatInstabilities(instabilities: string[][], variantIndex: number = 0) {
        return [0, 1, 2].map(fractalIndex => instabilities[variantIndex][fractalIndex]).join('\n');
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
