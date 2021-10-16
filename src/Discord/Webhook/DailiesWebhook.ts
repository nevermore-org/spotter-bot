import { Webhook, WebhookClient } from "discord.js";
import DailiesAPI from "../../Guildwars/Dailies/DailiesAPI";
import { EMBED_ID } from "../View/enum/EMBED_ID";
import ViewDailies from "../View/ViewDailies";
import { RecurrenceRule, scheduleJob } from "node-schedule";

/**
 * Sends today's dailies to webhook client
 */
 export default class DailiesWebhook {
    private dailiesAPI: DailiesAPI;
    private webhook: WebhookClient;
    private cronRule: RecurrenceRule;

    // main server
    // 898965290107408395
    // m3OOvn6fiRcSXG5NVoxX834hS-EY6RRV0xBcj2hI7vntoEQ-cv0hiPJjYe5GuSAIPheJ

    constructor(webhookUrl: string) {
        this.dailiesAPI = new DailiesAPI;        
        this.webhook= new WebhookClient({url: webhookUrl});
        
        // might be cleaner to use cron format ('10 0 * * *')
        // problem with cron is it doesn't take timezones into account
        this.cronRule = new RecurrenceRule();
        this.cronRule.tz = 'Etc/UTC';
        this.cronRule.hour = 0;
        this.cronRule.minute = 10;
        
        return this;        
    }

    /**
     * Calls sendEmbed each day at 00:10 utc
     * 
     */
    public cronSchedule(){
        return scheduleJob(this.cronRule, this.sendEmbed);
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
