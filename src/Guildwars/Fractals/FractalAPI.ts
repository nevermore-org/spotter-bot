import axios from "axios"
import { DateTime } from "luxon";
import { AchievementResponse } from "../../Model/Guildwars/Achievement";
import { FractalInfo } from "../../Model/Guildwars/FractalInfo";
import { getIdsFromCollection } from "../../Mongo/Mongo";
import { GW_API_URL } from "../General/enum/GW_API_URL";
import { GW_INSTABILITIES, GW_INST_NAMES } from "./enum/GW_INSTABILITIES";

export default class FractalAPI {
    /**
     * Returns daily fractals (t4 + recs) for either today or tomorrow
     */
    public getDailyFractals = async () => {
        const dailyResponse = await axios.get(GW_API_URL.DAILY);
        //GW2 API actually returns daily fractals ACHIEVEMENTS rather than fractals themselves
        const fractalAchievements: AchievementResponse[] = dailyResponse.data.fractals;

        const fractalIds: number[] = fractalAchievements.map((achiev: AchievementResponse) => achiev.id);
        const fractalsDB = await getIdsFromCollection(fractalIds, 'achievements');

        const fractalsDaily = fractalsDB?.filter( fractal => fractal.fractal_info && ["DailyT4", "Recommended"].includes(fractal.fractal_info.type));
        const fractalsDailyInfo: FractalInfo[] = fractalsDaily ? fractalsDaily.map(achiev => achiev.fractal_info) : [];
        
        return fractalsDailyInfo;
    }

    /**
     * Converts array of daily fractals to their matching array of instabilities
     * @param levels
     */
    public getInstabilities(fractals: FractalInfo[]) {
        const today = DateTime.utc().ordinal;

        // replaces each level with list of instability indices; then replaces those with their names
        let getInstabilitiesForLevel = (level: number) => (GW_INSTABILITIES[level][today]).map(index => GW_INST_NAMES[index]);

        return fractals.map( fractal => {
            const instabilities = fractal.levels.map(level => getInstabilitiesForLevel(level));
            return {... fractal, instabilities};
        });     
    }

}
