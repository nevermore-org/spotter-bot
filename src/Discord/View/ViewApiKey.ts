import { CommandInteraction, EmbedField, MessageEmbed } from "discord.js";
import View from "./View";
import { THUMBNAILS } from "./enum/THUMBNAILS";
import { EMBED_ID } from "./enum/EMBED_ID";
import EMOJIS from "./enum/EMOJIS";
import { EMBED_COLORS } from "./enum/EMBED_COLORS";
import APIKeyInfo from "../../Model/Guildwars/APIKeyInfo";
import UserAPIKeyInfo from "../../Model/Guildwars/UserAPIKeyInfo";


export default class ViewApiKey extends View {
    commandName: string;
    userKeys: APIKeyInfo[] | undefined;
    preferredKeyIndex: number | undefined;
    embedSetters: Record<string, (embed: MessageEmbed) => Promise<ViewApiKey>>;
    neededPermissions: string[] = ['account'];
    // could maybe be inside its own file
    errorFields: Record<string, EmbedField> = {
        'err-default': {
            name: 'Something went wrong',
            value: 'Lumberjack Jack has some work to do.', 
            inline: false
        },
        'err-invalid-api-key': {
            name: 'Invalid GW2 API Key', 
            value: 'Please provide a valid GW2 API Key.', 
            inline: false
        },
        'err-non-unique-key': {
            name: 'Non-unique GW2 API Key',
            value: 'You cannot add the same key twice.',
            inline: false
        }
    }

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
        this.preferredKeyIndex = userKeysInfo ? userKeysInfo.preferred_key_index : undefined;
        this.embedSetters = {
            'show': this.setEmbedKeyShow,
            'add': this.setEmbedKeyAdd,
        }

        this.setEmbeds(optarg);
    }

    /**
     * Sets embeds
     */
    public setEmbeds = async (optarg: string): Promise<ViewApiKey> => {
        const apiKeyEmbed = this.createEmbed(`${EMBED_ID.API_KEY}-${this.commandName}`, `Guild Wars 2 API Key Settings`);

        // 'err' is consistent for all subcommands so this handles displayal of all errors the user should see
        if (optarg.includes('err')){
            const errorField = this.errorFields[optarg];

            apiKeyEmbed.color = EMBED_COLORS.ERROR;
            apiKeyEmbed.addField(`Error: ${errorField.name}`, errorField.value, errorField.inline);
          
            return this;
        }

        await this.embedSetters[this.commandName](apiKeyEmbed);
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
                const isPreferredEmoji = this.preferredKeyIndex === index ? ':sunny:' : ':cloud:'; // Pretty symbolic, I guess
                const prettyPerms = `:lock: \`${userKey.key_permissions.map(perm => perm.toUpperCase()).join('\`, \`')}\``;

                embed.addField(`${isPreferredEmoji} ${userKey.account_name} - ${userKey.key_name}`, `${isValidEmoji} ||${userKey.key_id}||\n${prettyPerms}`);
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


    /**
     * Returns first interaction response
     * @param interaction 
     */
    public sendFirstInteractionResponse(interaction: CommandInteraction) {
        const apiKeyEmbed: MessageEmbed = this.getEmbed(`${EMBED_ID.API_KEY}-${this.commandName}`);
        interaction.user.send({ embeds: [apiKeyEmbed] });
    }
}
