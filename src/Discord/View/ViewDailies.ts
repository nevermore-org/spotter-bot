import { THUMBNAILS } from "./enum/THUMBNAILS";
import View from "./View";
import { EMBED_ID } from "./enum/EMBED_ID";
import { CommandInteraction, EmbedFieldData, EmbedField, MessageEmbed } from "discord.js";
import { getConstantValue, isVariableDeclaration } from "typescript";
import { NONAME } from "dns";
import { isGatherType, Gathering } from "../../Model/Guildwars/Gathering";
import { GW_GATHERING, GW_MINIDUNGEONS, GW_PUZZLES, GW_HEARTS, GW_ACTIVITIES, GW_DAILY, NORMALIZE_DAILY } from "../../Guildwars/Dailies/enum/GW_DAILIES";
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

        for (let index = 0; index < dailiesPve.length; index++) {
            const dailyName = dailiesPve[index];
            dailiesEmbed.addField(dailyName, this.getFieldValue(dailyName));
        }

        if (this.waypoints.length === 0) {
            this.waypoints.push("No waypoints to show");
        }

        dailiesEmbed.addField("Copy&Paste All Waypoints", this.waypoints.join(" "));

        return this;
    }

    // there might be a way to make all the 'ifs' more modular
    private getFieldValue(fullName: string) {
        const splitName = fullName.split(" ");

        // it should be possible to always determine the type of a daily last word in the name
        // turns out it is possible for *most* types of dailies
        const dailyType = splitName[splitName.length - 1];
        const daily = GW_DAILY[NORMALIZE_DAILY[dailyType]];

        // temporary solution, before adventures and bosses are added
        if (!daily){
            return `${EMOJIS['Guide']} No guide available`;
        }

        // need this for all those daily types that dont have any special keyword at the end of their name
        const slicedName = daily.endOfName === 0 ? splitName.slice(1) : splitName.slice(1, daily.endOfName);

        const dailyName = slicedName.join("_");
        const location = daily.location(dailyName, dailyType);

        if (daily.wantWaypoint){
            this.waypoints.push(`${location.waypoint}`);
        }

        return daily.prettyFormat(location, dailyName);
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
