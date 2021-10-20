import DiscordCommandData from "./DiscordCommandData";
import DiscordControllerInterface from "./DiscordControllerInterface";

export default interface DiscordCommandInterface {
    readonly data: DiscordCommandData,
    readonly controller: DiscordControllerInterface;
}
