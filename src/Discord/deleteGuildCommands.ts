import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types";
import DiscordCommandREST from "../Model/Discord/DiscordCommandREST";


export async function deleteGuildCommands(rest: REST, clientId: string, guildId: string) {
    const guildCommands = <DiscordCommandREST[]>await rest.get(Routes.applicationGuildCommands(clientId, guildId));
    
    for (let i = 0; i < guildCommands.length; i++){
        const cmd = guildCommands[i];                
        try {
            await rest.delete(`/applications/${clientId}/guilds/${guildId}/commands/${cmd.id}`);
            console.log(`Successfully deleted guild command "${cmd.name}" from guild ${guildId}`);
        }
        catch (err) {
            console.error(err);
        }
    }
    console.log(`Successfully deleted all guild commands in ${guildId}`);

}
