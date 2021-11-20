import { CommandInteraction, CommandInteractionOption } from "discord.js";
import DiscordControllerInterface from "../../../Model/Discord/DiscordControllerInterface";
import ApiKeyAPI from "../../../Guildwars/ApiKey/ApiKeyAPI";
import ViewApiKey from "../../View/ViewApiKey";
import UserDB from "../../../Model/Guildwars/UserDB";
import APIKeyInfo from "../../../Model/Guildwars/APIKeyInfo";
import EMOJIS from "../../View/enum/EMOJIS";


export default class ApiKeyController implements DiscordControllerInterface {
    private apiKeyApi: ApiKeyAPI;
    optarg: string;

    constructor() {
        this.apiKeyApi = new ApiKeyAPI();
        this.optarg = '_';
    }

    /**
     * Handles discord interaction
     * @param interaction 
     */
    public handleInteraction = async (interaction: CommandInteraction): Promise<void> => {
        // All the key validation takes some time, don't want discord to give up on us completely
        interaction.reply(`${EMOJIS['SpotterMail']} Answered your command as a private message.`);

        const subCommand = interaction.options.data[0];
        const userID = interaction.user.id;
        this.optarg = '_'; // need to reset optarg on each interaction

        if (subCommand.name === 'add'){
            this.optarg = await this.handleAddAPIkey(userID, subCommand);
        }

        const userDB = await this.apiKeyApi.getUserFromDB(userID);
        const userKeys: APIKeyInfo[] | undefined = userDB ? await this.apiKeyApi.createAPIKeysInfo(<UserDB> userDB) : undefined;

        const view = new ViewApiKey(subCommand.name, userKeys, this.optarg);
        view.sendFirstInteractionResponse(interaction);
    }

    public handleAddAPIkey = async(userID:string, subCommand: CommandInteractionOption): Promise<string> => {
        if(!subCommand.options || !subCommand.options.length){return 'err-default'}; // "should" never get in here
        const APIkey = <string> subCommand.options[0].value;
        
        return await this.apiKeyApi.addAPIKeyToDB(userID, APIkey);
    }
}
