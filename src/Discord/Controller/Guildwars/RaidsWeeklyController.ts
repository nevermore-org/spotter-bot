import { CommandInteraction } from "discord.js";
import DiscordControllerInterface from "../../../Model/Discord/DiscordControllerInterface";
import RaidsAPI from "../../../Guildwars/Raids/RaidsAPI";
import ViewRaidsWeekly from "../../View/ViewRaidsWeekly";
import AccountAPI from "../../../Guildwars/Account/AccountAPI";
import ApiKeyAPI from "../../../Guildwars/ApiKey/ApiKeyAPI";
import UserAPIKeyInfo from "../../../Model/Guildwars/UserAPIKeyInfo";


export default class RaidsController implements DiscordControllerInterface {
    private raidsApi: RaidsAPI;
    private apiKeyApi: ApiKeyAPI;

    constructor() {
        this.apiKeyApi = new ApiKeyAPI();
        this.raidsApi = new RaidsAPI();
    }

    /**
     * Handles discord interaction
     * @param interaction 
     */
    public handleInteraction = async (interaction: CommandInteraction): Promise<void> => {
        const userDiscord = interaction.user;
        const userDB = <UserAPIKeyInfo> await this.apiKeyApi.getUserFromDB(userDiscord.id);

        const preferredKey = userDB.preferred_api_key;
        const accountName = <string> userDB.api_keys.find(key => key.key_id === preferredKey)?.account_name;


        const allWingsInfo = await this.raidsApi.getAllRaidWings();
        const weeklyCleared = await this.raidsApi.getWeeklyBosses(preferredKey);


        const view = new ViewRaidsWeekly(userDiscord, accountName, allWingsInfo, weeklyCleared);
        view.sendFirstInteractionResponse(interaction);
    }
}
