import { THUMBNAILS } from "./enum/THUMBNAILS";
import View from "./View";
import { EMBED_ID } from "./enum/EMBED_ID";
import { CommandInteraction, EmbedFieldData, EmbedField, MessageEmbed } from "discord.js";
import { getConstantValue, isVariableDeclaration } from "typescript";
import { NONAME } from "dns";
import { isGatherType, Gathering } from "../../Model/Guildwars/Gathering";
import { GW_GATHERING, GW_PUZZLES } from "../../Guildwars/Dailies/enum/GW_LOCATIONS";
import EMOJIS from "./enum/EMOJIS";
import { GW_API_URL } from "../../Guildwars/General/enum/GW_API_URL";

export default class ViewDailies extends View {
    thumbnail: string = THUMBNAILS.DAILY_PVE;
    waypoints: string[] = [`${EMOJIS["Waypoint"]}`];

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
        const dailiesEmbed = this.createEmbed(EMBED_ID.DAILIES, "PvE Dailies", this.thumbnail);

        for (let index = 0; index < dailiesPve.length; index++){
            const dailyName = dailiesPve[index];
            dailiesEmbed.addField(dailyName, this.getFieldValue(dailyName));
        }

        if (this.waypoints.length === 0){
            this.waypoints.push("No waypoints to show");
        }

        dailiesEmbed.addField("Copy&Paste All Waypoints", this.waypoints.join(" "));

        return this;
    }

    private getFieldValue(dailyName: string){
        const splitDailyName = dailyName.split(" ");

        // it should be possible to always determine the type of a daily last word in the name
        // turns out it is possible for *most* types of dailies
        const dailyType = splitDailyName[splitDailyName.length - 1];

        // Gathering
        if (isGatherType(dailyType)){
            // just cause 'Vista Viewer' has to be special
            // region name is either the whole part between the first and the last word or the part between the first word and 'Vista Viewer'
            const regionName = splitDailyName.slice(1, dailyType === "Viewer" ? -2 : -1).join();
            const location = GW_GATHERING[regionName][dailyType];

            this.waypoints.push(`${location.waypoint}`);
            return `${EMOJIS["Waypoint"]} ${location.waypoint}\n ${EMOJIS[dailyType]} *${location.description}*`;
        }

        // Jumping Puzzles
        else if (dailyType === "Puzzle"){
            const puzzleName = splitDailyName.slice(1, -2).join("_");
            const location = GW_PUZZLES[puzzleName];

            this.waypoints.push(`${location.waypoint}`);
            // might want to split this line
            return `${EMOJIS["Waypoint"]} ${location.waypoint}\n*${EMOJIS['JP']} ${location.description}*\n${EMOJIS['Guide']} [Wiki Guide](${GW_API_URL.WIKI}${puzzleName})`;
        }

        // default return if the Daily-type doesn't have anything going for it
        return `${EMOJIS['Guide']} No guide available`;

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
