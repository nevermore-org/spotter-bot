import { CommandInteraction, MessageEmbed, User } from "discord.js";
import View from "./View";
import { THUMBNAILS } from "./enum/THUMBNAILS";
import { EMBED_ID } from "./enum/EMBED_ID";
import { RaidWingInfo } from "../../Model/Guildwars/FullRaidInfo";
import { titleCase } from "../../Util/util";


export default class ViewRaidsWeekly extends View {
    public constructor(user: User, accountName: string, allWingsInfo: RaidWingInfo[], weeklyCleared: string[]) {
        super();
        this.setEmbeds(user, accountName, allWingsInfo, weeklyCleared);
    }

    /**
     * Sets embeds
     */
    public setEmbeds = async (user: User, accountName: string, allWingsInfo: RaidWingInfo[], weeklyCleared: string[]): Promise<ViewRaidsWeekly> => {
        const weeklyEmbed = this.createEmbed(EMBED_ID.RAIDS_WEEKLY, `Weekly Cleared Raid Bosses`);
        weeklyEmbed.setAuthor(`${user.username} - ${accountName}`, user.displayAvatarURL());

        // add new embed field for each raid wing
        for (let index = 0; index < allWingsInfo.length; index++){
            const wingInfo = allWingsInfo[index];
            let clearedCount = 0; // how many events in a given wing are actually cleared 
            
            const wingEvents = wingInfo.events.map(event => {
                const isCleared = weeklyCleared.includes(event.id);
                const emojiCleared = isCleared ? ':white_check_mark:' : ':x:';

                clearedCount += isCleared ? 1 : 0;
                return `${emojiCleared} ${titleCase(event.id, '_')}`;
            });
            
            const isFullyCleared = wingInfo.events.length === clearedCount;
            weeklyEmbed.addField(`${isFullyCleared ? ':ballot_box_with_check:': ':x:'} ${titleCase(wingInfo.id, '_')}`, `${wingEvents.join('\n')}`, true);
        }
        
        return this;
    }


    /**
     * Returns first interaction response
     * @param interaction 
     */
    public sendFirstInteractionResponse(interaction: CommandInteraction) {
        const weeklyEmbed: MessageEmbed = this.getEmbed(EMBED_ID.RAIDS_WEEKLY);
        interaction.reply({ embeds: [weeklyEmbed] });
    }
}
