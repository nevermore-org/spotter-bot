import axios from "axios"
import { Achievement } from "../../Model/Guildwars/Achievement";
import Fractal from "../../Model/Guildwars/Fractal";
import { GW_API_URL } from "./GW_API_URL";
import GW_FRACTALS from "./GW_FRACTALS";
import { GW_INSTABILITIES, GW_INST_NAMES } from "./GW_INSTABILITIES";

// fuuuuu, daily reset happens at 2 AM, NOT at 0:00 (hence why - 2 * 3600 * 1000 aka 2 hours)
const dayOfYear = (date: any) => Math.floor((date - 2 * 3600 * 1000 - new Date(date.getFullYear(), 0, 0).valueOf()) / 1000 / 60 / 60 / 24);

export default class FractalAPI {
    /**
     * Returns daily fractals (t4 + recs) for either today or tomorrow
     */
    public getDailyFractals = async (today: boolean) => {
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
    * Returns array of keys (numbers) that have specified fractalName as value
    * Would be prettier if GW_FRACTALS keys were strings
    * Also the complexity is not ideal (O(3n) altogether), should be possible in one loop only
    * @param fractalName
    * @param predicate returns boolean
    */
    private getLevelsByName(fractalName: string, predicate: any) {
        // get all keys as an array of strings and typecast them to numbers
        return (Object.keys(GW_FRACTALS) as unknown as Array<keyof typeof GW_FRACTALS>).filter(level => GW_FRACTALS[level] === fractalName && predicate(level));
    }


    /**
     * Returns array of arrays which contain the daily fractals' levels
     * @param fractals 
     */
    public getDailyT4Levels(fractals: Fractal[]) {
        // don't need the "Daily Tier 4" part
        const names: string[] = [fractals[6].name, fractals[10].name, fractals[14].name].map(name => name.slice(13));
        const levels = names.map(name => this.getLevelsByName(name, ((level: number) => level >= 75)));

        return levels;
    }


    /**
     * Converts array of daily fractal levels to its matching array of instabilites
     * It's still convoluted as it is; should change how the data is stored
     * @param levels e.g. [[88, 97], [96], [98]]
     */
    public getDailyInstabilities(levels: number[][]) {
        const today = dayOfYear(new Date());

        // replaces each level with list of instability indices; then replaces those with their names
        let getInstabilitiesForLevel = (level: number) => (GW_INSTABILITIES[level][today]).map(index => GW_INST_NAMES[index]);
        
        return levels.map(fractalType => fractalType.map(level => getInstabilitiesForLevel(level)));
        // [ [ [ 4, 3, 16 ], [ 8, 5, 2 ] ], [ [ 15, 17, 6 ] ], [ [ 7, 15, 4 ] ] ]

        // return levels.map( (fractalType: number []) => 
        //     fractalType.map(level => GW_INSTABILITIES[level][dayOfYear(new Date())]).map(instabIndices => 
        //         instabIndices.map((instabIndex:number) => GW_INST_NAMES[instabIndex])));
    }

    /**
     * Returns formatted string of instabilities
     * @param instabs 
     * @param index
     */

    public formatInstabilities(instabs: string[][][], index: number) {
        var formattedInstabs: string = `${instabs[index][0][0]} - ${instabs[index][0][1]} - ${instabs[index][0][2]}`;
        // return three instabilities if the fractal is unique; return 6 if two are possible
        return `${instabs[index].length == 1 ? formattedInstabs :
            `${formattedInstabs} __**OR**__\n ${instabs[index][1][0]} - ${instabs[index][1][1]} - ${instabs[index][1][2]}`}`
    }

}
