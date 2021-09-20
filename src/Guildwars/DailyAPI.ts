import axios from "axios"
import { Achievement } from "../Model/Guildwars/Achievement";
import Fractal from "../Model/Guildwars/Fractal";
import { GW_API_URL } from "./GW_API_URL";
import GW_FRACTALS from "./GW_FRACTALS";
import GW_T4 from "./GW_T4";
import INSTABILITIES from "../Guildwars/INSTABILITIES";
import INST_NAMES from "../Guildwars/INST_NAMES";
import { isDataView } from "util/types";

// fuuuuu, daily reset happens at 2 AM, NOT at 0:00 (hence why - 3600 * 1000 aka 2 hours)
const dayOfYear = (date:any) => Math.floor((date - 3600 * 1000 - new Date(date.getFullYear(), 0, 0).valueOf()) / 1000 / 60 / 60 / 24);

export default class DailyAPI {
    /**
     * Returns daily fractals (t4 + recs) for either today or tomorrow
     */
    public getDailyFractals = async (today:boolean) => {
        const dailyResponse = await axios.get(today ? GW_API_URL.DAILY : GW_API_URL.TOMORROW);
        //GW2 API actually returns daily fractals ACHIEVEMENTS rather than fractals themselves
        const fractalAchievements: Achievement[] = dailyResponse.data.fractals;

        const fractalIds: number[] = fractalAchievements.map((achiev: Achievement) => achiev.id);
        const fractalResponse = await axios.get(`${GW_API_URL.ACHIEVEMENTS}?ids=${fractalIds}`);

        const fractals: Fractal[] = fractalResponse.data;
        const parsedFractals = this.parseRecommendedFractals(fractals);

        return parsedFractals;
    }
    /**
     * Yes. These numskulls don't return the name of the recommended fractal.
     * @param fractals 
     */
    private parseRecommendedFractals(fractals: Fractal[]) {
        return fractals.map((fractal: Fractal) => {
            fractal.recommended = false;
            if (fractal.name.includes("Daily Recommended")) {
                const fractalNumber: number = Number(fractal.name.split(" ")[3]);
                fractal.name = `${fractalNumber} ${GW_FRACTALS[fractalNumber]}`;
                fractal.recommended = true;
            }
            return fractal;
        });
    }

    /**
     * Returns array of arrays which contain the daily fractals' levels
     * @param fractals 
     */
    public getDailyFractalsLevels(fractals: Fractal[]){
        // don't need the "Daily Tier 4" part
        const names: string[] = [fractals[6].name, fractals[10].name, fractals[14].name].map( name => name.slice(13));
        const levels = names.map( name => GW_T4[name] as string[]);
        console.log(dayOfYear(new Date()));
        
        return levels;
    }

    /**
     * Returns an absolute abomination
     * @param levels
     */
    public getDailyInstabilities(levels: string[][]) {
        return levels.map( (fractalType: string []) => 
            fractalType.map(level => INSTABILITIES[level][dayOfYear(new Date())]).map(instabIndices => 
                instabIndices.map((instabIndex:number) => INST_NAMES[instabIndex])));
    }

}