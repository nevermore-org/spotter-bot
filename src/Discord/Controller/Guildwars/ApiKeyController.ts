import { CommandInteraction, CommandInteractionOption } from "discord.js";
import DiscordControllerInterface from "../../../Model/Discord/DiscordControllerInterface";
import ApiKeyAPI from "../../../Guildwars/ApiKey/ApiKeyAPI";
import ViewApiKey from "../../View/ViewApiKey";
import APIKeyInfo from "../../../Model/Guildwars/APIKeyInfo";
import EMOJIS from "../../View/enum/EMOJIS";
import UserAPIKeyInfo from "../../../Model/Guildwars/UserAPIKeyInfo";


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
            this.optarg = await this.handleAddAPIKey(userID, subCommand);
        }

        if (subCommand.name === 'remove'){
            this.optarg = await this.handleRemoveAPIKey(userID, subCommand);
        }

        let userDB = <UserAPIKeyInfo | undefined> await this.apiKeyApi.getUserFromDB(userID);

        // it validates all keys on show command
        if (subCommand.name === 'show'){
            userDB = await this.apiKeyApi.validateAPIKeys(userDB);
        }

        const view = new ViewApiKey(subCommand.name, userDB, this.optarg);
        view.sendFirstInteractionResponse(interaction);
    }

    public handleAddAPIKey = async(userID:string, subCommand: CommandInteractionOption): Promise<string> => {
        if(!subCommand.options || !subCommand.options.length){return 'err-default'}; // "should" never get in here
        const APIkey = <string> subCommand.options[0].value;
        
        return await this.apiKeyApi.addAPIKeyToDB(userID, APIkey);
    }

    public handleRemoveAPIKey = async(userID: string, subCommand: CommandInteractionOption): Promise<string> => {
        const userInfo = <UserAPIKeyInfo> await this.apiKeyApi.getUserFromDB(userID);

        // to display different error messages to the user
        if(!subCommand.options || !subCommand.options.length){return 'err-default'};
        if(!userInfo){return 'err-no-user'};
        if(userInfo.api_keys.length === 0) {return 'err-no-api-keys'};

        const keysToRemove = await this.apiKeyApi.getUserKeysToRemove(userInfo, subCommand.options[0]);
        
        if(keysToRemove.length === 0) {return 'err-no-api-keys'};
        if (keysToRemove[0].startsWith('err')){return keysToRemove[0]}; // in case of error, "bubble up" the error message

        return await this.apiKeyApi.removeUserKeysFromDB(userID, keysToRemove);
    }
}
