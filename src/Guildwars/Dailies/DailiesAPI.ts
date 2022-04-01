import axios from "axios"
import { Achievement, AchievementResponse } from "../../Model/Guildwars/Achievement";
import { DailyResponse } from "../../Model/Guildwars/Daily";
import { collectionExists, getDb, getIdsFromCollection } from "../../Mongo/Mongo";
import { GW_API_URL } from "../General/enum/GW_API_URL";


export default class DailiesAPI {
    /**
     * Returns PvE dailies as an array of names
     */
     public getDailies = async () => {
        const fullResponse = await axios.get(GW_API_URL.DAILY);
        const dailyAchievements: AchievementResponse[] = fullResponse.data.pve;

        // want dailies for lvl 80s ////+ access to all expansions
        const filteredDailies = dailyAchievements.filter(daily => daily.level.max === 80);

        const dailyIds: number[] = filteredDailies.map((achiev: AchievementResponse) => achiev.id);
        //const dailyIdResponse = await axios.get(`${GW_API_URL.ACHIEVEMENTS}?ids=${dailyIds}`);
        //const dailyNames: string[] = dailyIdResponse.data.map((daily: DailyResponse) => daily.name);

        const dailiesDB = await getIdsFromCollection(dailyIds, 'achievements', { projection: { name: 1, _id: 0 } });  
        const dailyNames: string[] = dailiesDB ? dailiesDB.map(daily => daily.name) : [];

        // id 1852 == Big Spender
        const dailyWvW = fullResponse.data.wvw;
        const isBigSpenderToday: boolean = dailyWvW.some((daily: Achievement) => daily.id === 1852);

        return dailyNames.concat(isBigSpenderToday ? ["Daily WvW Big Spender"] : []);
    }


}
