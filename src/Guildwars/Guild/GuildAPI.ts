import axios from "axios"
import GuildStashItem from "../../Model/Guildwars/GuildStashItem";
import Item from "../../Model/Guildwars/Item";
import { GW_API_URL } from "../General/enum/GW_API_URL"


export default class GuildAPI {
    // this is pretty much public anyway
    GUILD_ID = "9EED60FC-9707-EC11-81B7-C3B1C0E42B51" // <- Daddy Dhuum Squad


    public getStashItems = async (access_token: string) => {
        const stashResponse = await axios.get(`${GW_API_URL.GUILD}${this.GUILD_ID}/stash?access_token=${access_token}`);

        const inventory = stashResponse.data[0].inventory;

        const itemsIds = inventory.map((item : GuildStashItem) => item?.id);
        const itemsResponse = await axios.get(`${GW_API_URL.ITEMS}?ids=${itemsIds}`);

        const items: Item[] = itemsResponse.data;

        return items;
    }
    
}
