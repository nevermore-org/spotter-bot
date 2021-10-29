import axios from "axios";
import path from "path/posix";
import GW_ACHIEV_IDS from "../Guildwars/General/enum/GW_ACHIEV_IDS";
import { GW_API_URL } from "../Guildwars/General/enum/GW_API_URL";
import { chunk, objectWithoutKey } from "./util";
import * as fs from 'fs';
import { Achievement } from "../Model/Guildwars/Achievement";
import { collectionExists, getDb, insertMany } from "../Mongo/Mongo";

export const toAbsPath = (relativePath: string) => {
    return path.join(__dirname, relativePath);
}

export function appendToJSONFile <T>(outputRelPath: string, dataChunk: T[], silent:boolean=true) {
    const absPath = toAbsPath(outputRelPath);

    // TODO check if file exists, if not, create it
    var JSONfile = fs.readFileSync(absPath, "utf-8");
    let objectArray = JSON.parse(JSONfile);

    objectArray.push(... dataChunk);

    JSONfile = JSON.stringify(objectArray, null, '\t');
    fs.writeFileSync(absPath, JSONfile, "utf-8");

    if (!silent){console.log(`Appended ${dataChunk.length} objects to ${outputRelPath}`);}
}


/**
 * Splits all achievement ids into chunks of 200 (GW_API limit)
 * Then for each chunk of ids it gets their corresponding array of achievement-objects
 * And appends! it to a json file (the file needs to exist and have at least one [] inside)
 */
 export const saveAchievementsToJSON = async (outputRelPath: string) => {
    const chunkedAchievs = chunk(GW_ACHIEV_IDS, 200);

    for (let i = 0; i < chunkedAchievs.length; i++) {
        const achievChunk = await axios.get(`${GW_API_URL.ACHIEVEMENTS}?ids=${chunkedAchievs[i]}`);
        appendToJSONFile(outputRelPath, achievChunk.data);
    }
    console.log(`Succesfully added ${GW_ACHIEV_IDS.length} achievements to ${outputRelPath}.`);
}


export const filterSaveDailies = (inputJSONPath: string, outputRelPath: string) => {
    console.log('Filtering all daily achievements');   
    const allAchievsFile = fs.readFileSync(toAbsPath(inputJSONPath), "utf-8");
    const allAchievements: Achievement[] = JSON.parse(allAchievsFile);

    // abomination incarnate
    // thank you, GW_API, for having such an *amazing* flags system!
    const dailyAchievements = allAchievements.filter((achievement: Achievement) => 
        achievement.flags.includes("Daily")
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
    );

    for (let i = 0; i < dailyAchievements.length; i++) {
        appendToJSONFile(outputRelPath, [dailyAchievements[i]]);
    }
    console.log(`Succesfully added ${dailyAchievements.length} daily achievements to ${outputRelPath}.`);
}

// changes id -> _id to fit MongoDB and adds special_flag property
export const createModifiedAchievementsJSON = (relativeOutputPath: string = "enum/achievements.json") => {
    const dailiesFile = fs.readFileSync(toAbsPath('enum/dailyAchievements.json'), "utf-8");
    const achievFile = fs.readFileSync(toAbsPath('enum/allAchievements.json'), "utf-8");

    const dailies: Achievement[] = JSON.parse(dailiesFile);
    const achievs: Achievement[] = JSON.parse(achievFile);

    const dailyIds: number[] = dailies.map( daily => daily.id);

    for (let i = 0; i < achievs.length; i++) {
        const specialFlag = dailyIds.includes(achievs[i].id) ? 'Completionist' : '';
        let modifiedAchiev = {_id: achievs[i].id, special_flag: specialFlag, ...objectWithoutKey(achievs[i], 'id')};      
        appendToJSONFile(relativeOutputPath, [modifiedAchiev]);

        console.log(`Added ${achievs[i].name} to JSON file`);
    }

}
