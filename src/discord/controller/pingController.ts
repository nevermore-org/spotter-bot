import { CommandInteraction, Interaction } from "discord.js";
import DiscordControllerInterface from "../../model/discord/DiscordControllerInterface";

export default class pingController implements DiscordControllerInterface {
    public handleInteraction = async (interaction: CommandInteraction): Promise<void> => {
        interaction.reply("Pong!");
    }
}