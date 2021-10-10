import { THUMBNAILS } from "./enum/THUMBNAILS";
import View from "./View";
import { EMBED_ID } from "./enum/EMBED_ID";
import { CommandInteraction, MessageEmbed } from "discord.js";
import EMOJIS from "./enum/EMOJIS";
import Item from "../../Model/Guildwars/BaseItem";
import { AGENT_LOCATIONS, PACT_AGENTS } from "../../Guildwars/PactSupply/enum/GW_PSNA";
import { TODAY } from "../../Util/util";

export default class ViewPactSupply extends View {
    thumbnail: string = THUMBNAILS.MERCHANT;
    waypoints: string[] = [`${EMOJIS["Waypoint"]}`];

    public constructor(items: Item[]) {
        super();
        this.setEmbeds(items);
    }

    /**
     * Sets embeds
     * @param fractals 
     * @param instabs 
     */
    public setEmbeds = async (items: Item[]): Promise<ViewPactSupply> => {
        const pactSupplyEmbed = this.createEmbed(EMBED_ID.PACT_SUPPLY, "Pact Supply Network Agents", this.thumbnail);

        items.forEach( (item, index) => {
            let agentLocation = AGENT_LOCATIONS[index][TODAY];
            this.waypoints.push(agentLocation);

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
