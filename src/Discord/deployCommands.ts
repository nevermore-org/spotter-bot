import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import loadDotenv from '../Config/Config';
import COMMANDS from "./Command/Commands";


/**
 * Deploys slash commands from COMMANDS array (WIP)
 * to run this use npm run deploy-commands
 * guild ~ discord server (lol)
 * @param token
 * @param clientId
 * @param guildId
 */
async function deployCommands(token: string, clientId: string, guildId: string = "") {
    const rest = new REST({ version: '9' }).setToken(token);
    try {
        console.log('Started refreshing application (/) commands.');

        const arrayOfCommands = COMMANDS.map(command => command.data);

        if (guildId) {
            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: arrayOfCommands },
            );
            console.log('Successfully reloaded application (/) commands for development environment.');
        }
        else {
            await rest.put(
                Routes.applicationCommands(clientId),
                { body: arrayOfCommands },
            );
            console.log('Successfully reloaded application (/) commands for production environment.');
        }
        //here it deploys commands to all guilds that bot is in
        //should be run only on production server (updates only once per hour)


    } catch (error) {
        console.error(error);
    }
}

loadDotenv();
deployCommands(String(process.env.CLIENT_TOKEN), String(process.env.APPLICATION_ID), String(process.env.GUILD_ID))
