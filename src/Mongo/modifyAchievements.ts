import { Achievement, AchievementMod } from "../Model/Guildwars/Achievement";
import { toAbsPath } from "../Util/scrapers";
import { collectionExists, getDb, insertMany } from "./Mongo";
import * as fs from 'fs';
import GW_FRACTALS from "../Guildwars/Fractals/enum/GW_FRACTALS";
import { Collection, Db, Document } from "mongodb";

const insertAchievementsToDB = async () => {
    const achievFile = fs.readFileSync(toAbsPath('enum/achievements.json'), "utf-8");
    const achievs: AchievementMod[] = JSON.parse(achievFile);

    const db = await getDb(process.env.MONGO_INITDB_DATABASE);

    if (await collectionExists('achievements', db)){
        const achievementCollection = db.collection('achievements');
        insertMany(achievs, achievementCollection);
    }
}

/**
 * Updates all daily recomended achievements inside the achievements collection
 * Fills in the special flag - FractalDaily
 * And adds the fractal_info field with all the fun stuff like level, name and type (either Recommended || Daily)
 * Quite a monstrosity, shouldn't really get called that often
 */
export const updateFractalAchievements = async () => {
    const db = await getDb(process.env.MONGO_INITDB_DATABASE);
    if (! await collectionExists('achievements', db)) return;

    const achievCollection = db.collection('achievements');
    const fractals = await achievCollection.find({"name": {$regex: "^Daily Recommended|^Daily Tier"}}).toArray();

    if(!fractals) {console.error("There are no fractal achievements in the collection"); return;}


    const modifiedFractalAchievements: AchievementMod[] = fractals.map(fractal => {
        let achievFractal = <AchievementMod>fractal;

        achievFractal.special_flag = "FractalDaily";
        achievFractal.fractal_info = getFractalInfo(achievFractal.name);

        return achievFractal;
    })

    for (let i = 0; i < modifiedFractalAchievements.length; i++){
        const achievement = modifiedFractalAchievements[i];
        await updateFractalAchievementWithCustomFields(achievCollection, achievement);        
    }
}


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
    // does not expect anything else than Daily Recommended (might be a problem in the future)
    else {
        const recFractalName = achievementName.split(" ");
        const recFractalLevel: number = Number(recFractalName[recFractalName.length-1]);
        
        return {
            type: "Recommended",
            name: `${GW_FRACTALS[recFractalLevel - 1].name}`, 
            levels: [recFractalLevel]
        }
    }
}
/**
 * Might want to rename this to something less verbose
 * Updates the fractal achievement document with our custom fields - special_flag and fractal_info
 * @param achievCollection 
 * @param achievement 
 */
const updateFractalAchievementWithCustomFields = async (achievCollection: Collection<Document>, achievement: AchievementMod) => {
    if (!achievement.fractal_info || !achievement.special_flag) return;

    console.log(achievement.fractal_info.type, achievement.fractal_info.name, achievement.fractal_info.levels);

    await achievCollection.updateOne({"_id": achievement._id}, {
        '$set': {
            special_flag: achievement.special_flag, 
            fractal_info: {
                type: achievement.fractal_info.type,
                name: achievement.fractal_info.name,
                levels: achievement.fractal_info.levels
            }
        },
    });

    console.log(`Succesfully updated: ${achievement._id, achievement.name}`);
}
