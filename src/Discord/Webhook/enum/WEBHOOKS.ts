import WebhookDailies from "../WebhookDailies";

export const WEBHOOKS = [
    { name: 'dailies', manager: WebhookDailies, url: process.env.WEBHOOK_URL_DAILIES },
]
