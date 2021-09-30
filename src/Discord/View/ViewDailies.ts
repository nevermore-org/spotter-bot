import { THUMBNAILS } from "./enum/THUMBNAILS";
import View from "./View";
import { EMBED_ID } from "./enum/EMBED_ID";
import { CommandInteraction, EmbedFieldData, EmbedField, MessageEmbed } from "discord.js";
import { getConstantValue, isVariableDeclaration } from "typescript";
import { NONAME } from "dns";
import { isGatherType, Gathering } from "../../Model/Guildwars/Gathering";
import { GW_GATHERING, GW_GATHER_EMOJI } from "../../Guildwars/Dailies/enum/GW_GATHERING";

export default class ViewDailies extends View {
    thumbnail: string = THUMBNAILS.DAILY_PVE;

    public constructor(dailiesPve: string[]) {
        super();
        this.setEmbeds(dailiesPve);
    }

    /**
     * Sets embeds
     * @param fractals 
     * @param instabs 
     */
    public setEmbeds = async (dailiesPve: string[]): Promise<ViewDailies> => {
        const dailiesEmbed = this.createEmbed(EMBED_ID.DAILIES, "PvE dailies", this.thumbnail);

        for (let index = 0; index < dailiesPve.length; index++){
            const dailyName = dailiesPve[index];
            dailiesEmbed.addField(dailyName, this.getFieldValue(dailyName))
        }

        return this;
    }

    private getFieldValue(dailyName: string){
        const splitDailyName = dailyName.split(" ");

        // it should be possible to always determine the type of a daily last word in the name 
        const dailyType = splitDailyName[splitDailyName.length - 1];

        if (isGatherType(dailyType)){
            // just cause 'Vista Viewer' has to be special
            // region name is either the whole part between the first and the last word or the part between the first word and 'Vista Viewer'
            const regionName = splitDailyName.slice(1, dailyType === "Viewer" ? -2 : -1).join();

            const location = GW_GATHERING[regionName][dailyType];
            return `<:waypoint:893273199901569095> ${location.waypoint}\n ${GW_GATHER_EMOJI[dailyType]} *${location.description}*`;
        }

        // default return if the Daily-type doesn't have anything going for it
        return 'No guide available';

    }


    /**
     * Returns first interaction response
     * @param interaction 
     */
    public sendFirstInteractionResponse(interaction: CommandInteraction) {
        const dailiesEmbed: MessageEmbed = this.getEmbed(EMBED_ID.DAILIES);
        interaction.reply({ embeds: [dailiesEmbed] })
    }
}
