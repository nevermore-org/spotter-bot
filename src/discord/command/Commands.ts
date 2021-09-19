import DiscordCommandInterface from "../../model/discord/DiscordCommandInterface";
import pingController from "../controller/pingController";

/**
 * # WIP #
 * This implementation probably sucks.
 * Will see, if a better solution might be required
 */
const COMMANDS: Record<string, DiscordCommandInterface> = {
    "ping": {
        name: "ping",
        description: "makes pong after ping",
        controller: new pingController(),
    }
};

export default COMMANDS;