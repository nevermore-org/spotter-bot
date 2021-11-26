import { CommandInteraction, MessageEmbed } from "discord.js";
import { EMBED_COLORS } from "../Discord/View/enum/EMBED_COLORS";
import ERROR_FIELDS from "../Discord/View/enum/ERROR_FIELDS";
import ApiKeyAPI from "../Guildwars/ApiKey/ApiKeyAPI";
import UserAPIKeyInfo from "../Model/Guildwars/UserAPIKeyInfo";
import { differenceArray, differenceSet } from "../Util/util";


/**
 * Used to check if the user's preferred APIKey has the expected permissions for a given command
 * Invoked on command interaction, if needsAPIKey
 * Returns -1 for error, 1 if successful
 */
export const validatePermissions = async(interaction: CommandInteraction, commandPermissions: string[]) => {
    const apiKeyApi = new ApiKeyAPI();
    
    const userID = interaction.user.id;
    const userInfo = await apiKeyApi.getUserFromDB(userID);
    
    if (!userInfo){
        await sendValidationError(interaction, "err-no-user");
        return -1;
    }
    
    const userPrefAPIKey = userInfo.api_keys.find(key => key.key_id === userInfo.preferred_api_key);
    if (!userPrefAPIKey) {return -1}; // this cannot really happen; Alas! TypeScript needed affirmation

    const isValid = apiKeyApi.isAPIKeyValid(userPrefAPIKey?.key_id);
    
    if (!isValid) {
        await sendValidationError(interaction, "err-invalid-key");
        return -1;
    }
    
    const userKeyPermissions = userPrefAPIKey?.key_permissions;
    const missingPermissions = differenceArray(commandPermissions, userKeyPermissions);

    if (missingPermissions.length > 0) {
        await sendValidationError(interaction, "err-missing-permissions", commandPermissions);
        return -1;           
    }

    return 0;    
}

/**
 * Sends the validation error's embed to the user's PM
 */
const sendValidationError = async(interaction: CommandInteraction, errorType: string, commandPermissions: string[] = []) => {
    const errorEmbed = new MessageEmbed().setColor(EMBED_COLORS.ERROR).setTitle(`Guild Wars 2 API Key Settings`).setTimestamp();
    const errorField = ERROR_FIELDS[errorType];
    const prettyPerms = `:lock: \`${commandPermissions.map(perm => perm.toUpperCase()).join('\`, \`')}\``;

    errorEmbed.addField(`Error: ${errorField.name}`, `${errorField.value}${commandPermissions.length !== 0 ? prettyPerms : ""}`, errorField.inline);
    interaction.user.send({ embeds: [errorEmbed] });  
}
