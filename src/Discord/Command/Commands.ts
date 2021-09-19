import DiscordCommandInterface from "../../Model/Discord/DiscordCommandInterface";
import FractalsController from "../Controller/Guildwars/FractalsController";
import PingController from "../Controller/PingController";

/**
 * # WIP #
 * This implementation probably sucks.
 * Will see, if a better solution might be required
 */
const COMMANDS: Record<string, DiscordCommandInterface> = {
    "ping": {
        description: "makes pong after ping",
        controller: new PingController()
    },
    "fractals": {
        description: "returns daily fractals",
        controller: new FractalsController()
    }
};

export default COMMANDS;