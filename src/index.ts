import { Intents, Interaction, Client } from 'discord.js';
import loadDotenv from './Config/Config';
import COMMANDS from './Discord/Command/Commands';
import { WEBHOOKS } from './Discord/Webhook/enum/WEBHOOKS';
import DiscordCommandInterface from './Model/Discord/DiscordCommandInterface';
import { setUpDB } from "./Mongo/Mongo";
import { testDailies } from './Tests/testDailies';
import winston from 'winston';
import DiscordTransport from "./Discord/Webhook/DiscordTransport";

loadDotenv();
setUpDB();

// testDailies();

const client: Client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
    client.user?.setActivity("Guild Wars 2");

    console.log(`Logged in as ${client?.user?.tag}`);

    // schedule all webhooks
    WEBHOOKS.forEach(webhook => {
        if (webhook.url) {
            new webhook.manager(webhook.url).cronSchedule();
        }
    });

});

/**
 * Listens for interaction with the bot API
 */
client.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    const command: DiscordCommandInterface | undefined = COMMANDS.find(cmd => cmd.data.name === commandName);

    if (command) {
        await command.controller.handleInteraction(interaction);
    }
    else {
        await interaction.reply("No such command exists");
    }
});

client.login(process.env.CLIENT_TOKEN);

if (process.env.NODE_ENV === "prod") {
    const logger = winston.createLogger({
        transports: [
            new DiscordTransport({
                webhook: <string>process.env.WEBHOOK_ERRORS,
                defaultMeta: { service: "SpotterBot" },
                level: 'error',
                handleExceptions: true
            })
        ],
        exitOnError: false
    });
}
