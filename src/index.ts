import { Intents, Interaction, Client } from 'discord.js';
import loadDotenv from './Config/Config';
import COMMANDS from './Discord/Command/Commands';
import DiscordControllerInterface from './Model/Discord/DiscordControllerInterface';
import express from "express";
import path from 'path';

loadDotenv();

/**
 * Serves contents in the public folder
 */
const server = express();

server.use("/public", express.static(path.join(__dirname + '/../public')));

server.listen(80);

const client: Client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
    client.user?.setActivity("Guild Wars 2");
    console.log(`Logged in as ${client?.user?.tag}`);
});

/**
 * Listens for interaction with the bot API
 */
client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    const controller: DiscordControllerInterface = COMMANDS[commandName].controller;

    if (controller) {
        await controller.handleInteraction(interaction);
    }
    else {
        await interaction.reply("No such command exists");
    }
});

client.login(process.env.CLIENT_TOKEN);
