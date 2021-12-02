import axios from "axios"
import { FullRaidInfo } from "../../Model/Guildwars/FullRaidInfo";
import { GW_API_URL } from "../General/enum/GW_API_URL";


export default class RaidsAPI {

    public getAllRaidWings = async() => {
        // raids are weirdly represented in the API
        // while we normally just use W1-W7, W1-3 actually belong to the "forsaken_thicket" raid and W4-7 each have their own "raid section"
        // so while we de facto use 1 raid with 7 wings, de jure it would be 5 raids with the first one having 3 wings, and all the others having 1 wing each
        const raidsResponse = await axios.get(`${GW_API_URL.RAIDS}`);
        const allRaidsNames = <string[]> raidsResponse.data;

        const raidsDataResponse = await axios.get(`${GW_API_URL.RAIDS}?ids=${allRaidsNames}`);

        // gets all the wings for all the raids (forsaken_thicket and others)
        return (<FullRaidInfo[]> raidsDataResponse.data).flatMap(raid => raid.wings);
    }

    public getWeeklyBosses = async(userAPIKey: string) => {
        const bossesResponse = await axios.get(`${GW_API_URL.ACCOUNT_RAIDS}`, { headers: {"Authorization" : `Bearer ${userAPIKey}`}});
        return <string[]> bossesResponse.data;
    }
    
}

