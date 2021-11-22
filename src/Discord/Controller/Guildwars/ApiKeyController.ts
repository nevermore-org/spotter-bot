import { CommandInteraction, CommandInteractionOption, MessageEmbed } from "discord.js";
import DiscordControllerInterface from "../../../Model/Discord/DiscordControllerInterface";
import ApiKeyAPI from "../../../Guildwars/ApiKey/ApiKeyAPI";
import ViewApiKey from "../../View/ViewApiKey";
import APIKeyInfo from "../../../Model/Guildwars/APIKeyInfo";
import EMOJIS from "../../View/enum/EMOJIS";
import UserAPIKeyInfo from "../../../Model/Guildwars/UserAPIKeyInfo";


export default class ApiKeyController implements DiscordControllerInterface {
    private apiKeyApi: ApiKeyAPI;
    optarg: string;
    handlers: Record<string, (userID:string, subCommand: CommandInteractionOption) => Promise<string>>;

    constructor() {
        this.apiKeyApi = new ApiKeyAPI();
        /** return values of functions that interact with the APIs and DB are stored inside the optarg var
         * so the View can choose which embed to send to the user
         * without actually interacting with the DB or APIs directly in any way
         * **/ 
        this.optarg = '_'; 
        this.handlers = {
            'add': this.handleAddAPIKey,
            'remove': this.handleRemoveAPIKey,
            'switch-preferred': this.handleSwitchPreferredAPIKey,
            'purge-all-data': this.handlePurgeAllUserData
        }
    }

    /**
     * Handles discord interaction
     * @param interaction 
     */
    public handleInteraction = async (interaction: CommandInteraction): Promise<void> => {
        const subCommand = interaction.options.data[0];
        const userID = interaction.user.id;
        this.optarg = '_'; // need to reset optarg on each interaction

        // All the key validation takes some time, don't want discord to give up on us completely
        // Want to send this only if not in PMs
        if(interaction.member){
            interaction.reply({content: `${EMOJIS['SpotterMail']} Answered your command as a private message.`, ephemeral: true});
        }

        // show is the only one that doesnt actually modify the DB as of now
        if (subCommand.name !== 'show'){
            this.optarg = await this.handlers[subCommand.name](userID, subCommand);
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

    public handleSwitchPreferredAPIKey = async(userID: string, subCommand: CommandInteractionOption): Promise<string> => {
        const userInfo = <UserAPIKeyInfo> await this.apiKeyApi.getUserFromDB(userID);

        if(!subCommand.options || !subCommand.options.length){return 'err-default'};
        if(!userInfo){return 'err-no-user'};
        if(userInfo.api_keys.length === 0) {return 'err-no-api-keys'};

        // discord validates for us that the index is actually a number
        // care that DB is 0-indexed, but user sees 1-indexed lists
        return await this.apiKeyApi.switchUserPreferredKeyInDB(userInfo, (<number> subCommand.options[0].value))
    }

    public handlePurgeAllUserData = async(userID: string, subCommand: CommandInteractionOption): Promise<string> => {
        const userInfo = <UserAPIKeyInfo> await this.apiKeyApi.getUserFromDB(userID);

        if(!subCommand.options || !subCommand.options.length){return 'err-default'};
        if(!userInfo){return 'err-no-user'};

        const userAnswer = <string> subCommand.options[0].value;
        const isUserSure = userAnswer === 'Yes, do as I say!';
        if(! isUserSure) {return 'err-user-not-sure'};

        return await this.apiKeyApi.purgeAllUserDataFromDB(userID);
    }
}
