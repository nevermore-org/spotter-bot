import { THUMBNAILS } from "./enum/THUMBNAILS";
import View from "./View";
import { EMBED_ID } from "./enum/EMBED_ID";
import { CommandInteraction, MessageEmbed } from "discord.js";
import EMOJIS from "./enum/EMOJIS";
import Item from "../../Model/Guildwars/BaseItem";
import { AGENT_LOCATIONS, PACT_AGENTS } from "../../Guildwars/PactSupply/enum/GW_PSNA";
import { DateTime } from "luxon";

export default class ViewPactSupply extends View {
    thumbnail: string = THUMBNAILS.MERCHANT;
    waypoints: string[] = [`${EMOJIS["Waypoint"]}`];

    public constructor(items: Item[]) {
        super();
        this.setEmbeds(items);
    }

    /**
     * Sets embeds
     * @param items
     */
    public setEmbeds = async (items: Item[]): Promise<ViewPactSupply> => {
        const todayStr = DateTime.utc().setLocale('en-gb').toLocaleString();
        const pactSupplyEmbed = this.createEmbed(EMBED_ID.PACT_SUPPLY, `Pact Supply Network Agents ${todayStr}`, this.thumbnail);
        const weekday = DateTime.utc().minus({hours: 8}).weekday - 1;

        items.forEach( (item, index) => {
            // agent location reset daily at 8:00 AM UTC, while their recipes change at 0:00 UTC
            // just so there is even less consistency
            let agentLocation = AGENT_LOCATIONS[index][weekday];
            this.waypoints.push(agentLocation);

            // slice 8 cause we don't want/need the "Recipe:" part
            pactSupplyEmbed.addField(PACT_AGENTS[index], `${EMOJIS['Waypoint']} ${agentLocation}\n${EMOJIS['PSNA']} ${item.name.slice(8)}`, true);
        });

        pactSupplyEmbed.addField("Copy&Paste All Waypoints", this.waypoints.join(" "));

        // pactSupplyEmbed.setImage("https://i.ibb.co/4mf0Vvs/combine-images.png");

        return this;
    }


    /**
     * Returns first interaction response
     * @param interaction 
     */
    public sendFirstInteractionResponse(interaction: CommandInteraction) {
        const pactSupplyEmbed: MessageEmbed = this.getEmbed(EMBED_ID.PACT_SUPPLY);
        interaction.reply({ embeds: [pactSupplyEmbed] }) // Array.from(this.embeds.values()) - if all created embeds are needed
    }
}
