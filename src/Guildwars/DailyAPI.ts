import axios from "axios"
import { Achievement } from "../Model/Guildwars/Achievement";
import Fractal from "../Model/Guildwars/Fractal";
import { GW_API_URL } from "./GW_API_URL";
import GW_FRACTALS from "./GW_FRACTALS";

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
}