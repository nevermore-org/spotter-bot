import DailiesAPI from "../../Guildwars/Dailies/DailiesAPI";
import { EMBED_ID } from "../View/enum/EMBED_ID";
import ViewDailies from "../View/ViewDailies";
import WebhookDefault from "./WebhookDefault";

/**
 * Sends today's dailies to webhook client
 */
 export default class WebhookDailies extends WebhookDefault {
    private dailiesAPI: DailiesAPI;

    constructor(webhookUrl: string) {
        super(webhookUrl);
        this.dailiesAPI = new DailiesAPI;
        
        return this;        
    }

    /**
     * Sends Dailies Embed to through the Webhook
     * 
     */
    public sendEmbed = async (): Promise<void> => {
        const dailiesToday: string[] = await this.dailiesAPI.getDailies();
        const view = new ViewDailies(dailiesToday);

        const dailiesEmbed = view.getEmbed(EMBED_ID.DAILIES);
        this.webhook.send({embeds:[dailiesEmbed]});
    }
}
