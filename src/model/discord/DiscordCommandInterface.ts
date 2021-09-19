import DiscordControllerInterface from "./DiscordControllerInterface";

export default interface DiscordCommandInterface {
    readonly name: string;
    readonly description: string;
    readonly controller: DiscordControllerInterface;
}