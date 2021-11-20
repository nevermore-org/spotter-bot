import { CommandInteraction, EmbedField, MessageEmbed } from "discord.js";
import View from "./View";
import { THUMBNAILS } from "./enum/THUMBNAILS";
import { EMBED_ID } from "./enum/EMBED_ID";
import EMOJIS from "./enum/EMOJIS";
import UserDB from "../../Model/Guildwars/UserDB";
import { EMBED_COLORS } from "./enum/EMBED_COLORS";


export default class ViewApiKey extends View {
    commandName: string;
    userInfo: UserDB;
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
    public constructor(commandName: string, userInfo: UserDB, optarg: string) {
        super();
        this.commandName = commandName;
        this.userInfo = userInfo;
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
        if (!this.userInfo || this.userInfo.API_Keys.length === 0){
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

            for (let index = 0; index < this.userInfo.API_Keys.length; index++){
                const isPreferredKey = index === this.userInfo.preferredAPIKey;
                const emojiStatus = isPreferredKey ? ':sunny:' : ':cloud:'; // Pretty symbolic, I guess

                embed.addField(`${emojiStatus} DefaultUser.1234 - DefaultAPIKeyName`, `:white_check_mark: \`${this.userInfo.API_Keys[index]}\``)
            }
            
        }
        
        return this;
    }

    private setEmbedKeyAdd = async(embed: MessageEmbed): Promise<ViewApiKey> => {
        const userKeys = this.userInfo.API_Keys;
        const lastKey = userKeys[userKeys.length - 1];

        embed.addField(':white_check_mark: Success!', `The API Key \`${lastKey}\` is valid and ready to go. You can use it right away!`);
        return this;
    }


    /**
     * Returns first interaction response
     * @param interaction 
     */
    public sendFirstInteractionResponse(interaction: CommandInteraction) {
        const apiKeyEmbed: MessageEmbed = this.getEmbed(`${EMBED_ID.API_KEY}-${this.commandName}`);

        interaction.user.send({ embeds: [apiKeyEmbed] });
        interaction.reply(`${EMOJIS['SpotterMail']} Answered your command as a private message.`);
    }
}
