import { CommandInteraction, MessageEmbed, User } from "discord.js";
import View from "./View";
import { THUMBNAILS } from "./enum/THUMBNAILS";
import { EMBED_ID } from "./enum/EMBED_ID";
import UserAPIKeyInfo from "../../Model/Guildwars/UserAPIKeyInfo";
import AccountInfo from "../../Model/Guildwars/AccountInfo";
import WorldInfo from "../../Model/Guildwars/WorldInfo";
import { DateTime } from "luxon";
import EMOJIS from "./enum/EMOJIS";


export default class ViewAccount extends View {
    // thumbnail: string = THUMBNAILS.____;
    expansions: Record<string, string>;

    public constructor(user: User, accountInfo: AccountInfo, worldInfo: WorldInfo) {
        super();
        // could be extended with expansion-emojis
        this.expansions = {
            'HeartOfThorns' : `Heart of Thorns`,
            'PathOfFire' : `Path of Fire`,
        };
        this.setEmbeds(user, accountInfo, worldInfo);
        
    }

    /**
     * Sets embeds
     */
    public setEmbeds = async (user: User, accountInfo: AccountInfo, worldInfo: WorldInfo): Promise<ViewAccount> => {
        const accountEmbed = this.createEmbed(EMBED_ID.ACCOUNT);
        accountEmbed.setAuthor(accountInfo.name, user.displayAvatarURL());
        
        accountEmbed.addField('Created on', `${DateTime.fromISO(accountInfo.created).setLocale('en-GB').toLocaleString(DateTime.DATETIME_SHORT)}`);
        accountEmbed.addField('Commander Tag', `${accountInfo.commander ? `${EMOJIS['CommanderTagGreen']} Yes` : `${EMOJIS['CommanderTagRed']} No`}`);
        accountEmbed.addField('WvW Server Info', `:map: ${worldInfo.name}\n :busts_in_silhouette: ${worldInfo.population}`);

        const ownedExpansions = accountInfo.access.filter( access => this.expansions[access]).map(access => this.expansions[access]);
        accountEmbed.addField('Owned Expansions', `${ownedExpansions.join('\n')}`);

        return this;
    }


    /**
     * Returns first interaction response
     * @param interaction 
     */
    public sendFirstInteractionResponse (interaction: CommandInteraction){
        const accountEmbed: MessageEmbed = this.getEmbed(EMBED_ID.ACCOUNT);

        interaction.reply({ embeds: [accountEmbed] });
    }
}
