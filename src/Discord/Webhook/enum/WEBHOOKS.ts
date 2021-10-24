import loadDotenv from "../../../Config/Config";
import WebhookDailies from "../WebhookDailies";

loadDotenv();

export const WEBHOOKS = [
    { name: 'dailies', manager: WebhookDailies, url: process.env.WEBHOOK_URL_DAILIES },
]
