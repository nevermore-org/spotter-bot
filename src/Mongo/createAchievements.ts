import axios from "axios";
import { Collection, Document } from "mongodb";
import GW_FRACTALS from "../Guildwars/Fractals/enum/GW_FRACTALS";
import { GW_API_URL } from "../Guildwars/General/enum/GW_API_URL";
import { Achievement, AchievementMod } from "../Model/Guildwars/Achievement";
import { chunkify } from "../Util/util";
import { CollectionCreateFunction } from "./enum/DB_CONFIG";
import { insertMany } from "./Mongo";

/**
 * Creates achievements collection from scratch
 * Gets data from GW_API in chunks; then modifies and inserts them into the DB
 * @param collection 
 */
export const createAchievements: CollectionCreateFunction = async(collection: Collection<Document>): Promise<void> => {
    const achievIds = await axios.get(GW_API_URL.ACHIEVEMENTS);
    const chunkedAchievs: Achievement[][] = chunkify(achievIds.data, 200);

    for (let i = 0; i < chunkedAchievs.length; i++) {
        // 200 ids at once is GW_API limit
        const chunkResponse = await axios.get(`${GW_API_URL.ACHIEVEMENTS}?ids=${chunkedAchievs[i]}`);
        const chunkOriginal: Achievement[] = chunkResponse.data;
        const chunkModified = chunkOriginal.map( achievement => upgradeAchievement(achievement));

        await insertMany(chunkModified, collection);
    }
    console.log(`--- Succesfully created the "achievements" collection with ${achievIds.data.length} documents ---`);
}

/**
 * Changes (and returns) the achievement from GW_API to our DB-achievement format
 * exchanges id for _id for easier mongoDB indexing
 * adds special_flag and fractal_info when applicable
 * @param achievement 
 */

function upgradeAchievement(achievement: Achievement) {
    const specialFlag = isDaily(achievement) ? "Completionist" : (isFractal(achievement) ? "FractalDaily" : "");

    let newAchievement: AchievementMod = {
        _id: achievement.id,
        special_flag: specialFlag,
        ...achievement,
        fractal_info: getFractalInfo(achievement.name)
    };

    delete newAchievement["id"];
    return newAchievement;
}

const isFractal = (achievement: Achievement) => {
    return achievement.name.includes("Daily Recommended") 
    || achievement.name.includes("Daily Tier")
};

// abomination incarnate
// thank you, GW_API, for having such an *amazing* flags system!
// is technically isDailyThatCountsTowardsDailyCompletionist
const isDaily = (achievement: Achievement) => {
    return achievement.flags.includes("Daily")
    // all of these filter out non-PvE dailies and those that don't count towards Daily Completionist 
    && achievement.name.includes("Daily") 
    && !(achievement.name.includes("Bonus")) 
    && !(achievement.name.includes("Fractal—Scale"))
    && !(achievement.name.includes("Fractal")) 
    && !(achievement.name.includes("Tier"))
    && achievement.id < 3900
    && !(achievement.name.includes("PvP"))
    && !(achievement.name.includes("WvW"))
    && !(achievement.name.includes("Stats"))
    && !(achievement.name.includes("Mists"))
    && !(achievement.name.includes("Completionist"))
    && !(achievement.id > 3000 && achievement.id < 3550)
};

/**
 * Decides which type is the achievement, and returns corresponding fractal_info object
 * @param achievementName 
 * @returns 
 */

 const getFractalInfo = (achievementName: string) => {

    if (achievementName.includes("Daily Tier")){
        const fractalName = achievementName.slice(13);
        const fractalTier: number = Number(achievementName[11]); // == N in Daily Tier N ...
        // T1 = 1 to 25; T2 = 26 to 50; T3 = 51 to 75; T4 = 76 to 100
        const tierRange = [(fractalTier - 1) * 25 + 1, fractalTier * 25]; // [low boundary, high boundary]
        
        // gets only fractals that fit the name and are in the correct Tier
        const fractalsByNameInTier = GW_FRACTALS.filter(level => level.name === fractalName && level.level >= tierRange[0] && level.level <= tierRange[1]);
        const fractalLevels = fractalsByNameInTier.map( fractal => fractal.level);

        return {
            type: `DailyT${fractalTier}`,
            name: `${fractalName}`, 
            levels: fractalLevels
        }
    }

    else if (achievementName.includes("Daily Recommended")){
        const recFractalName = achievementName.split(" ");
        const recFractalLevel: number = Number(recFractalName[recFractalName.length-1]);
        
        return {
            type: "Recommended",
            name: `${GW_FRACTALS[recFractalLevel - 1].name}`, 
            levels: [recFractalLevel]
        }
    }
    else {
        return undefined;
    }
}
