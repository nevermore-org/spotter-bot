import DiscordCommandInterface from "../../model/discord/DiscordCommandInterface";
import FractalsController from "../controller/guildwars/FractalsController";
import PingController from "../controller/PingController";

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