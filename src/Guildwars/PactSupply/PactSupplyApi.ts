import axios from "axios"
import { Achievement } from "../../Model/Guildwars/Achievement";
import Item from "../../Model/Guildwars/BaseItem";
import { DailyResponse } from "../../Model/Guildwars/Daily";
import { GW_API_URL } from "../General/enum/GW_API_URL";


export default class PactSupplyAPI {
    /**
     * Returns items as an array of strings(ids)
     */
     public getPSNAItems = async () => {
        const fullResponse = await axios.get(GW_API_URL.PSNA);
        // yeah, regex...
        // will break as soon as the format changes one tiiiny bit
        const itemsReg = new RegExp(/Mehem,Fox,Derwena,Yana,Katelyn,Verma,[\d]*-[\d]*-[\d]*\n([\d]*),([\d]*),([\d]*),([\d]*),([\d]*),([\d]*)/).exec(fullResponse.data);

        // itemsReg contains the capturing groups in an array - slice(1, 7) are our groups we care about
        const itemsResponse = await axios.get(`${GW_API_URL.ITEMS}?ids=${itemsReg?.slice(1, 7)}`);

        const itemsData: Item[] = itemsResponse.data;

        return itemsData;
    }
}
