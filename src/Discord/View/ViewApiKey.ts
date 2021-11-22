import { CommandInteraction, EmbedField, MessageEmbed } from "discord.js";
import View from "./View";
import { THUMBNAILS } from "./enum/THUMBNAILS";
import { EMBED_ID } from "./enum/EMBED_ID";
import EMOJIS from "./enum/EMOJIS";
import { EMBED_COLORS } from "./enum/EMBED_COLORS";
import APIKeyInfo from "../../Model/Guildwars/APIKeyInfo";
import UserAPIKeyInfo from "../../Model/Guildwars/UserAPIKeyInfo";
import ERROR_FIELDS from "./enum/ERROR_FIELDS";


export default class ViewApiKey extends View {
    commandName: string;
    userKeys: APIKeyInfo[] | undefined;
    preferredKey: string | undefined;
    optarg: string; // contains return values from lower-level functions
    embedSetters: Record<string, (embed: MessageEmbed) => Promise<ViewApiKey>>;
    neededPermissions: string[] = ['account'];

    /**
     * 
     * @param commandName 
     * @param userInfos 
     * @param optarg - can store things like api key to add or the index of the to-be-removed api key
    */
    public constructor(commandName: string, userKeysInfo: UserAPIKeyInfo | undefined, optarg: string) {
        super();
        this.commandName = commandName;
        this.userKeys = userKeysInfo ? userKeysInfo.api_keys : undefined;
        this.preferredKey = userKeysInfo ? userKeysInfo.preferred_api_key : undefined;
        this.optarg = optarg;
        this.embedSetters = {
            'show': this.setEmbedKeyShow,
            'add': this.setEmbedKeyAdd,
            'remove': this.setEmbedKeyRemove,
            'switch-preferred': this.setEmbedKeySwitchPreferred,
            'purge-all-data': this.setEmbedPurgeAllData
        }

        this.setEmbeds();
    }

    /**
     * Decides which embedSetter to use based on the subcommandName
     * In case of errors, handles error messages the user sees
     */
    public setEmbeds = async (): Promise<ViewApiKey> => {
        const apiKeyEmbed = this.createEmbed(`${EMBED_ID.API_KEY}-${this.commandName}`, `Guild Wars 2 API Key Settings`);

        // 'err' is consistent for all subcommands so this handles displayal of all errors the user should see
        if (this.optarg.includes('err')){
            const errorField = ERROR_FIELDS[this.optarg];

            apiKeyEmbed.color = EMBED_COLORS.ERROR;
            apiKeyEmbed.addField(`Error: ${errorField.name}`, errorField.value, errorField.inline);
          
            return this;
        }

        // just in case
        try {
            await this.embedSetters[this.commandName](apiKeyEmbed);
        }
        catch (err) {
            console.error(err);
        }
        
        return this;
    }

    /**
     * To handle the "show" subcommand's views
     * @param embed 
     * @returns 
    */
    private setEmbedKeyShow = async(embed: MessageEmbed): Promise<ViewApiKey> => {
        
        // user is not in our DB or hasn't added any key yet
        if (!this.userKeys || this.userKeys.length === 0){
            embed.setColor(EMBED_COLORS.SILENT);
            const lines = [
                "No worries though, you can use: **/api-key add <YOUR-API-KEY>** to add a new key.",
                `The API key should have at least the following permissions: \`${this.neededPermissions.join('\`, \`')}\``,
                "*You can create a new API key [here](https://account.arena.net/applications).*",
            ]

            embed.addField("I don't know any of your GW2 API keys", lines.join('\n'));
        }
        // means we have the user in the DB, and have at least one api key stored for them
        else {
            embed.addField(':closed_lock_with_key: Your GW2 API Keys', `If you'd like to add another one, use **/api-key add**.`);

            for (let index = 0; index < this.userKeys.length; index++){
                const userKey = this.userKeys[index];
                const isValidEmoji = userKey.is_valid ? ':white_check_mark:' : ':x:';
                const isPreferredEmoji = userKey.key_id === this.preferredKey ? ':sunny:' : ':cloud:'; // Pretty symbolic, I guess
                const prettyPerms = `:lock: \`${userKey.key_permissions.map(perm => perm.toUpperCase()).join('\`, \`')}\``;

                embed.addField(`${isPreferredEmoji} ${index + 1}. ${userKey.account_name} - ${userKey.key_name}`, `${isValidEmoji} ||${userKey.key_id}||\n${prettyPerms}`);
            }
            
        }
        
        return this;
    }

    private setEmbedKeyAdd = async(embed: MessageEmbed): Promise<ViewApiKey> => {
        if (! this.userKeys) {return this}; // "should" never happen
        const lastKey = this.userKeys[this.userKeys.length - 1];

        embed.addField(':white_check_mark: Success!', `The API Key ||${lastKey.key_id}|| is valid and ready to go. You can use it right away!`);
        return this;
    }

    private setEmbedKeyRemove = async(embed: MessageEmbed): Promise<ViewApiKey> => {
        const countRemoved = ~~this.optarg.split('-')[1];

        embed.addField(`:white_check_mark: Success!`, `${EMOJIS['Bin']} Removed ${countRemoved} GW2 API Key${countRemoved === 1 ? '' : 's'}.`);
        
        return this;
    }

    private setEmbedKeySwitchPreferred = async(embed: MessageEmbed): Promise<ViewApiKey> => {
        const keyObj = this.userKeys?.find(key => key.key_id === this.preferredKey);
        
        const lines = [
            `Your preferred API Key is now **${keyObj?.account_name} - ${keyObj?.key_name}.**`,
            `Any commands that need GW2 API Key will now use this key.`,            
        ]

        embed.addField(`:white_check_mark: Success!`, lines.join('\n'));
        
        return this;
    }

    private setEmbedPurgeAllData = async(embed: MessageEmbed): Promise<ViewApiKey> => {
        embed.setColor(EMBED_COLORS.SILENT);

        embed.addField(`${EMOJIS['Bin']} Success!`, `All your data that you have stored with us was purged.`);
        
        return this;
    }


    /**
     * Returns first interaction response
     * @param interaction 
     */
    public sendFirstInteractionResponse(interaction: CommandInteraction) {
        const apiKeyEmbed: MessageEmbed = this.getEmbed(`${EMBED_ID.API_KEY}-${this.commandName}`);
        interaction.user.send({ embeds: [apiKeyEmbed] });
    }
}
