import { Interaction } from "discord.js";

export default interface DiscordControllerInterface {
    handleInteraction(interaction: Interaction): Promise<void>
}
