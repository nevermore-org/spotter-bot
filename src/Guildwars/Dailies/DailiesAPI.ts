import axios from "axios"
import { Achievement } from "../../Model/Guildwars/Achievement";
import { DailyResponse } from "../../Model/Guildwars/Daily";
import { GW_API_URL } from "../General/enum/GW_API_URL";


export default class DailiesAPI {
    /**
     * Returns PvE dailies as an array of names
     */
     public getDailies = async () => {
        const fullResponse = await axios.get(GW_API_URL.DAILY);
        //console.log(fullResponse);

        const dailyAchievements: Achievement[] = fullResponse.data.pve;

        // want dailies for lvl 80s + access to all expansions        
        const filteredDailies = dailyAchievements.filter(daily => daily.level.max === 80 
            && (daily.required_access ? daily.required_access.condition === 'HasAccess' : true));

        const dailyIds: number[] = filteredDailies.map((achiev: Achievement) => achiev.id);
        const dailyIdResponse = await axios.get(`${GW_API_URL.ACHIEVEMENTS}?ids=${dailyIds}`);

        const dailyNames: string[] = dailyIdResponse.data.map((daily: DailyResponse) => daily.name)

        return dailyNames;
    }
}
