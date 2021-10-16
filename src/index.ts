import { Intents, Interaction, Client, Guild } from 'discord.js';
import loadDotenv from './Config/Config';
import COMMANDS from './Discord/Command/Commands';
import DailiesWebhook from './Discord/Webhook/DailiesWebhook';
import DiscordControllerInterface from './Model/Discord/DiscordControllerInterface';
import { setUpDB } from "./Mongo/Mongo";

loadDotenv();
setUpDB();


const client: Client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
    client.user?.setActivity("Guild Wars 2");
    console.log(`Logged in as ${client?.user?.tag}`);

    if (!process.env.WEBHOOK_URL) return;
    new DailiesWebhook(process.env.WEBHOOK_URL).cronSchedule();
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
