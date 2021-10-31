import { THUMBNAILS } from "./enum/THUMBNAILS";
import View from "./View";
import { EMBED_ID } from "./enum/EMBED_ID";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { GW_DAILY, NORMALIZE_DAILY } from "../../Guildwars/Dailies/enum/GW_DAILIES";
import EMOJIS from "./enum/EMOJIS";
import { DateTime } from "luxon";

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
    public setEmbeds = async (dailiesToday: string[]): Promise<ViewDailies> => {
        const todayStr = DateTime.utc().setLocale('en-gb').toLocaleString();
        const dailiesEmbed = this.createEmbed(EMBED_ID.DAILIES, `Dailies for ${todayStr}`, this.thumbnail);

        dailiesToday.forEach(daily => {
            dailiesEmbed.addField(daily, this.getFieldValue(daily));
        })

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

        // // there should not be any type of daily that doesn't exist now, it's here just in case
        // if (!daily) {
        //     return `${EMOJIS['Guide']} No guide available`;
        // }

        // need this for all those daily types that dont have any special keyword at the end of their name
        const slicedName = daily.endOfName === 0 ? splitName.slice(1) : splitName.slice(1, daily.endOfName);

        const dailyName = slicedName.join("_");
        const location = daily.location(dailyName, dailyType);

        // useful for debugging
        if (!location){
            console.error(`location = ${location}, fullName = ${fullName}, slicedName = ${slicedName}, dailyName = ${dailyName}`)
        }

        if (daily.wantWaypoint) {
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
