---
to: src/Discord/Controller/Guildwars/<%=Name%>Controller.ts
unless_exists: true
---
import { CommandInteraction } from "discord.js";
import DiscordControllerInterface from "../../../Model/Discord/DiscordControllerInterface";
import <%=Name%>API from "../../../Guildwars/<%=Name%>/<%=Name%>API";
import View<%=Name%> from "../../View/View<%=Name%>";


export default class <%=Name%>Controller implements DiscordControllerInterface {
    private <%=h.changeCase.camel(name)%>Api: <%=Name%>API;

    constructor() {
        this.<%=h.changeCase.camel(name)%>Api = new <%=Name%>API();
    }

    /**
     * Handles discord interaction
     * @param interaction 
     */
    public handleInteraction = async (interaction: CommandInteraction): Promise<void> => {
        // get data from API; handle command options

        const view = new View<%=Name%>();
        view.sendFirstInteractionResponse(interaction);
    }
}
