import { CommandInteraction } from "discord.js";
import DiscordControllerInterface from "../../../Model/Discord/DiscordControllerInterface";
import AccountAPI from "../../../Guildwars/Account/AccountAPI";
import ViewAccount from "../../View/ViewAccount";
import WorldInfo from "../../../Model/Guildwars/WorldInfo";


export default class AccountController implements DiscordControllerInterface {
    private accountApi: AccountAPI;

    constructor() {
        this.accountApi = new AccountAPI();
    }

    /**
     * Handles discord interaction
     * @param interaction 
     */
    public handleInteraction = async (interaction: CommandInteraction): Promise<void> => {
        const user = interaction.user;
        const accountInfo = await this.accountApi.getAccountInfo(user.id);
        const worldInfo = await this.accountApi.getWorldByID(accountInfo.world);

        const view = new ViewAccount(user, accountInfo, worldInfo);
        view.sendFirstInteractionResponse(interaction);
    }
}
