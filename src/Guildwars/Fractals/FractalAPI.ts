import axios from "axios"
import { DateTime } from "luxon";
import { Achievement } from "../../Model/Guildwars/Achievement";
import BaseFractal from "../../Model/Guildwars/BaseFractal";
import Fractal from "../../Model/Guildwars/Fractal";
import { GW_API_URL } from "../General/enum/GW_API_URL";
import GW_FRACTALS from "./enum/GW_FRACTALS";
import { GW_INSTABILITIES, GW_INST_NAMES } from "./enum/GW_INSTABILITIES";

export default class FractalAPI {
    /**
     * Returns daily fractals (t4 + recs) for either today or tomorrow
     */
    public getDailyFractals = async () => {
        const dailyResponse = await axios.get(GW_API_URL.DAILY);
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
                const fractalLevel: number = Number(fractal.name.split(" ")[3]);
                // might be bit too many levels here
                const fractalName = GW_FRACTALS.find(fLevel => fLevel.level == fractalLevel)?.name;

                fractal.name = `${fractalLevel} ${fractalName}`;
                fractal.recommended = true;
            }
            return fractal;
        });
    }

    /**
    * Returns all types of fractals that match fractalName as BaseFractal object  
    * Right now filters only T4's
    * @param fractalName
    */
    private getLevelsByName(fractalName: string) {
        return GW_FRACTALS.filter(level => level.name === fractalName && level.level > 75);
    }


    /**
     * Returns array of arrays which contain the daily fractals' levels
     * Complexity is not ideal (O(3n) altogether), should be possible in one loop only
     * @param fractals 
     */
    public getDailyT4Levels(fractals: Fractal[]) {
        // don't need the "Daily Tier 4" part
        // hardcoded T4s' positions in array (6, 10, 14)
        const names: string[] = [fractals[6].name, fractals[10].name, fractals[14].name].map(name => name.slice(13));
        const levels = names.map(name => this.getLevelsByName(name));

        return levels; // -> [[{name: Underground, level: 78},{name: Underground, level: 84}], [{...}], [{...}]]
    }


    /**
     * Converts array of daily fractals to their matching array of instabilities
     * @param levels
     */
    public getInstabilities(levels: BaseFractal[][]) {
        const today = DateTime.utc().ordinal;

        // replaces each level with list of instability indices; then replaces those with their names
        let getInstabilitiesForLevel = (level: number) => (GW_INSTABILITIES[level][today]).map(index => GW_INST_NAMES[index]);

        return levels.map(fractalType => fractalType.map(level => getInstabilitiesForLevel(level.level)));
    }

}
