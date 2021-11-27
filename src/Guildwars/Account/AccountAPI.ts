import axios from "axios"
import ApiKeyAPI from "../ApiKey/ApiKeyAPI";
import { GW_API_URL } from "../General/enum/GW_API_URL";
import AccountInfo from "../../Model/Guildwars/AccountInfo";
import WorldInfo from "../../Model/Guildwars/WorldInfo";


export default class AccountAPI {
    apiKeyApi = new ApiKeyAPI();

    public getAccountInfo = async(userID: string) => {
        const userAPIKey = await this.apiKeyApi.getUserFromDB(userID);
        const accountResponse = await axios.get(`${GW_API_URL.ACCOUNT}`, { headers: {"Authorization" : `Bearer ${userAPIKey?.preferred_api_key}`}});
        return <AccountInfo> accountResponse.data;
    }

    public getWorldByID = async(worldID: number) => {
        const worldResponse = await axios.get(`${GW_API_URL.WORLDS}?id=${worldID}`);
        return <WorldInfo> worldResponse.data;     
    }

}

