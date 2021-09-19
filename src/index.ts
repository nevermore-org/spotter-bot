import { Intents, Interaction, Client } from 'discord.js';
import loadDotenv from './Config/Config';
import COMMANDS from './discord/command/Commands';
import DiscordControllerInterface from './model/discord/DiscordControllerInterface';

loadDotenv();

const client: Client = new Client({ intents: [Intents.FLAGS.GUILDS] }); //create new client

client.once('ready', () => {
    console.log(`Logged in as ${client?.user?.tag}`);
});

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

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token