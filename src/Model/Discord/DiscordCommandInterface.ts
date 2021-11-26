import DiscordCommandData from "./DiscordCommandData";
import DiscordControllerInterface from "./DiscordControllerInterface";

export default interface DiscordCommandInterface {
    readonly data: DiscordCommandData,
    readonly controller: DiscordControllerInterface;
    readonly needsAPIKey: boolean;
    readonly permissionsNeeded?: string[]; // if needs api key, perms should be checked against this
}
