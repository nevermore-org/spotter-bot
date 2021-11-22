import DiscordCommandInterface from "../../Model/Discord/DiscordCommandInterface";
import { OPTION_TYPES } from "./enum/OPTION_TYPES";
import FractalsController from "../Controller/Guildwars/FractalsController";
import DailiesController from "../Controller/Guildwars/DailiesController"
import PingController from "../Controller/PingController";
import PactSupplyController from "../Controller/Guildwars/PactSupplyController";
import GuildStashController from "../Controller/Guildwars/GuildStashController";
import ApiKeyController from "../Controller/Guildwars/ApiKeyController";

/*
Made like this, so discord api can chomp happily on the whole data object.
It doesn't have as fast of an access to a given command as it did with the Record
but we don't have that many commands for it to really matter 
*/
export const COMMANDS: DiscordCommandInterface[] = [
    {
        data: {
            name: 'ping',
            description: "makes pong after ping",
            options: []
        },
        controller: new PingController(),
    },
    {
        data: {
            name: 'fractals',
            description: "returns daily fractals",
            options: [
            {
                name:'category', 
                description: "What view do you want?", 
                type: OPTION_TYPES.STRING, required: true, 
                choices: [
                    {name: 'T4s + Recs', value:'daily'}, 
                    {name: 'Only CMs', value: 'cm'}
                ]
            },
            {
                name:'tomorrow',
                description: "Shows fractals for tomorrow",
                type: OPTION_TYPES.STRING,
                choices: [
                    {name: 'Gimme fractals for tomorrow, please!', value:'tomorrow'}
                ]
            }
            ]
        },
        controller: new FractalsController(),
    },
    {
        data: {
            name: 'dailies',
            description: "returns PvE, PvP and WvW dailies",
            options: []
        },
        controller: new DailiesController(),
    },
    {
        data: {
            name: 'psna',
            description: "returns Pact Supply Network Agents info",
            options: []
        },
        controller: new PactSupplyController(),
    },
    {
        data: {
            name: 'stash',
            description: "returns Guild Stash for Daddy Dhuum Squad",
            options: [
                {
                    name: 'dyes',
                    description: 'Barvičkyyyy',
                    type: OPTION_TYPES.SUB_COMMAND
                }
            ]
        },
        controller: new GuildStashController(),
    },
    {
        data: {
            name: 'api-key',
            description: "Handles all GW2 API key business",
            options: [
                {
                    name: 'show',
                    description: 'Show all API keys associated with this Discord account',
                    type: OPTION_TYPES.SUB_COMMAND
                },
                {
                    name: 'add',
                    description: 'Add new API key',
                    type: OPTION_TYPES.SUB_COMMAND,
                    options: [
                        {
                            name: 'api-key',
                            description: "GW2 API key",
                            type: OPTION_TYPES.STRING,
                            required: true
                        }
                    ]
                },
                {
                    name: 'remove',
                    description: "Remove specified API key(s)",
                    type: OPTION_TYPES.SUB_COMMAND_GROUP,
                    options: [
                        {
                            name: 'all',
                            description: "Remove all your GW2 API keys",
                            type: OPTION_TYPES.SUB_COMMAND
                        },
                        {
                            name: 'non-preferred',
                            description: "Remove all your non-preferred GW2 API keys",
                            type: OPTION_TYPES.SUB_COMMAND
                        },
                        {
                            name: 'by-index',
                            description: "Remove single API key specified by index",
                            type: OPTION_TYPES.SUB_COMMAND,
                            options: [
                                {
                                    name: 'index',
                                    description: "Specify the index of the key. If you want to see the list of indexed keys, use /api-key show",
                                    type: OPTION_TYPES.NUMBER,
                                    required: true
                                }
                            ]
                        },
                    ]
                },
            ]
        },
        controller: new ApiKeyController(),
    }, 
] // END_OF_COMMANDS (used to regex-match for scaffolding)

// example of contents of options array - gives the person who invoked the cmd a required choice
// {name: 'category', description: 'Dailies', type: 3, required: true, choices: [{name:'PvE', value:'pve'}, {name:'PvP', value:'pvp'}]}

export default COMMANDS;
