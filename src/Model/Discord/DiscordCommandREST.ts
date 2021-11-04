import DiscordCommandOption from "./DiscordCommandOption";

export default interface DiscordCommandREST {
    id: string;
    application_id: string;
    version: string;
    default_permission: boolean;
    default_member_permissions: null;
    type: number;
    name: string;
    description: string;
    guild_id?: string;
    options?: DiscordCommandOption[];
}
