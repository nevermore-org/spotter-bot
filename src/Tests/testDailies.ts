import { filterSaveDailies, saveAchievementsToJSON, toAbsPath } from "../Util/scrapers";
import * as fs from 'fs';
import { Achievement } from "../Model/Guildwars/Achievement";
import { chunk } from "../Util/util";
import { WebhookClient } from "discord.js";
import ViewDailies from "../Discord/View/ViewDailies";
import { EMBED_ID } from "../Discord/View/enum/EMBED_ID";

/**
 * Splits all dailies to chunks of size 10
 * Then creates a viewDailies for each chunk and tries to send it through the webhook client
 */
export const testDailies = async() => {
    // saveAchievementsToJSON('allAchievements.json');
    // filterSaveDailies('allAchievements.json', 'dailyAchievements.json');

    const dailiesFile = fs.readFileSync(toAbsPath('../Util/enum/dailyAchievements.json'), "utf-8");
    const allDailies: Achievement[] = JSON.parse(dailiesFile);
    const chunkedDailies = chunk(allDailies, 10);

    const webhook = new WebhookClient({url: process.env.WEBHOOK_URL_DAILIES ?? ''});

    for (let i = 0; i < chunkedDailies.length; i++) {
        console.log(`Working on chunk at index ${i}.`)
        const dailiesTest = chunkedDailies[i].map( daily => daily.name);
        const view = new ViewDailies(dailiesTest);

        const dailiesEmbed = view.getEmbed(EMBED_ID.DAILIES);
        await webhook.send({embeds:[dailiesEmbed]});
    }
}


