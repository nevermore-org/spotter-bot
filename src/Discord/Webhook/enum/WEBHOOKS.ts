import { isPropertyAccessChain } from "typescript";
import loadDotenv from "../../../Config/Config";
import WebhookDailies from "../WebhookDailies";

loadDotenv();

// easy and dirty implementation
export const WEBHOOKS = [
    { name: 'dailiesNVE', manager: WebhookDailies, url: process.env.WEBHOOK_URL_DAILIES },
    { name: 'dailiesDD', manager: WebhookDailies, url: process.env.WEBHOOK_URL_DAILIES_DD }
]
