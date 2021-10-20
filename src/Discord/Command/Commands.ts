import FractalsController from "../Controller/Guildwars/FractalsController";
import DailiesController from "../Controller/Guildwars/DailiesController"
import PingController from "../Controller/PingController";
import PactSupplyController from "../Controller/Guildwars/PactSupplyController";
import DiscordCommandInterface from "../../Model/Discord/DiscordCommandInterface";

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
            options: []
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
    }
]

// example of contents of options array - gives the person who invoked the cmd a required choice
// {name: 'category', description: 'Dailies', type: 3, required: true, choices: [{name:'PvE', value:'pve'}, {name:'PvP', value:'pvp'}]}

export default COMMANDS;
