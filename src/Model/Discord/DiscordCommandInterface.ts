import DiscordControllerInterface from "./DiscordControllerInterface";

export default interface DiscordCommandInterface {
    readonly description: string;
    readonly controller: DiscordControllerInterface;
}