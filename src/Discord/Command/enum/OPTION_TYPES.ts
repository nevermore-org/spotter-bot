// https://discord.com/developers/docs/interactions/application-commands

export enum OPTION_TYPES {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP,
    STRING,
    INTEGER,
    BOOLEAN,
    USER,
    CHANNEL,
    ROLE,
    MENTIONABLE, // user, role or snowflake,
    NUMBER // aka floating point value
}
