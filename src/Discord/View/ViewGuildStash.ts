import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { DYE_RARITIES } from "../../Guildwars/General/enum/GW_MISC";
import Item from "../../Model/Guildwars/Item";
import { createRarityItemMap, titleCase } from "../../Util/util";
import { EMBED_ID } from "./enum/EMBED_ID";
import { THUMBNAILS } from "./enum/THUMBNAILS";
import View from "./View";

export default class ViewGuildStash extends View {
    thumbnail: string = THUMBNAILS.GUILD_EMBLEM;

    public constructor(items: Item[], subcommand: string) {
        super();
        this.setEmbeds(items, subcommand);
    }

    /**
     * Sets embeds
     */
    public setEmbeds = async (items: Item[], subcommand: string): Promise<ViewGuildStash> => {
        const guildStashEmbed = this.createEmbed(EMBED_ID.GUILD_STASH, `Guild Stash - ${titleCase(subcommand)}`, this.thumbnail);

        subcommand === 'dyes' ? this.setDyesOnly(guildStashEmbed, items) : this.setAllItems(guildStashEmbed);

        return this;
    }

    private setAllItems(embed: MessageEmbed) {
        // TODO
        // not implemented yet
    }
    
    private setDyesOnly(embed: MessageEmbed, items: Item[]) {
        const dyes = this.filterDyes(items);
        const dyeRarityMap = createRarityItemMap(dyes, DYE_RARITIES);
        //console.log(dyeRarityMap);

        dyeRarityMap.forEach( (dyes, rarity) => {
            // don't really want to display rarities with no items
            if (dyes.length) {
                // only the color names, sorted alphabetically
                embed.addField(rarity, (dyes.sort((a, b) => a.name.localeCompare(b.name)).map((dye: Item) => dye.name).join(', ')));
            }
        })
    }


    public filterDyes(items: Item[]){
        // They just had to shoehorn every single item into one "type" in their API, I guess
        return items.filter(item => item.type === "Consumable" && item.details?.type === "Unlock" && item.details?.unlock_type === "Dye");
    }

    /**
     * Returns first interaction response
     * @param interaction 
     */
    public sendFirstInteractionResponse(interaction: CommandInteraction) {
        const guildStashEmbed: MessageEmbed = this.getEmbed(EMBED_ID.GUILD_STASH);
        interaction.reply({ embeds: [guildStashEmbed] })
    }
}
