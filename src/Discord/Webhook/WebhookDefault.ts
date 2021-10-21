import { WebhookClient } from "discord.js";
import { RecurrenceRule, scheduleJob } from "node-schedule";

export default class WebhookDefault {
    public cronRule: RecurrenceRule;
    public webhook: WebhookClient;

    constructor (webhookUrl: string) {
        this.webhook = new WebhookClient({url: webhookUrl});

        // might be cleaner to use cron format ('0 6 * * *')
        // problem with cron is it doesn't take timezones into account
        this.cronRule = new RecurrenceRule();
        this.cronRule.tz = 'Etc/UTC';
        this.cronRule.hour = 6;
        this.cronRule.minute = 0;
    }

    /**
     * Calls sendEmbed each day at specified time
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
        this.webhook.send('Default unga bunga message');
    }
    
}

