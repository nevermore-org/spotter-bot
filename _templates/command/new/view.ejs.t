---
to: src/Discord/View/View<%=Name%>.ts
unless_exists: true
---
import { CommandInteraction, MessageEmbed } from "discord.js";
import View from "./View";
import { THUMBNAILS } from "./enum/THUMBNAILS";
import { EMBED_ID } from "./enum/EMBED_ID";


export default class View<%=Name%> extends View {
    // thumbnail: string = THUMBNAILS.____;

    public constructor() {
        super();
        this.setEmbeds();
    }

    /**
     * Sets embeds
     */
    public setEmbeds = async (): Promise<View<%=Name%>> => {
        const <%=h.changeCase.camel(name)%>Embed = this.createEmbed(EMBED_ID.<%=h.changeCase.constantCase(name)%>, `<%=h.changeCase.sentence(name)%>`);

        // TODO: ADD YOUR FIELDS TO THE EMBED HERE
        // <%=h.changeCase.camel(name)%>Embed.addField([TITLE], [CONTENT], [INLINE?]);

        return this;
    }


    /**
     * Returns first interaction response
     * @param interaction 
     */
    public sendFirstInteractionResponse(interaction: CommandInteraction) {
        const <%=h.changeCase.camel(name)%>Embed: MessageEmbed = this.getEmbed(EMBED_ID.<%=h.changeCase.constantCase(name)%>);
        interaction.reply({ embeds: [<%=h.changeCase.camel(name)%>Embed] })
    }
}
