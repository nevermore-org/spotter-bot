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

        const arrayOfCommands = getArrayOfCommandsForSlashDeploy();

        if (guildId)
            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: arrayOfCommands },
            );
        else
            //here it deploys commands to all guilds that bot is in
            //should be run only on production server (updates only once per hour)
            await rest.put(
                Routes.applicationCommands(clientId),
                { body: arrayOfCommands },
            );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

/**
 * Basically omits unnecessary properties from COMMANDS array
 */
function getArrayOfCommandsForSlashDeploy() {
    const arrayOfCommands = [];
    for (let key in COMMANDS) {
        arrayOfCommands.push({ name: key, description: COMMANDS[key].description });
    }

    return arrayOfCommands;
}

loadDotenv();
deployCommands(String(process.env.CLIENT_TOKEN), String(process.env.APPLICATION_ID), String(process.env.GUILD_ID))