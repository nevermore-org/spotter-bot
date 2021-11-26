import { EmbedField } from "discord.js";

const ERROR_FIELDS: Record<string, EmbedField> = {
    'err-default': {
        name: 'Something went wrong',
        value: 'Lumberjack Jack has some work to do.', 
        inline: false
    },
    'err-invalid-api-key': {
        name: 'Invalid GW2 API Key', 
        value: 'Please provide a valid GW2 API Key.', 
        inline: false
    },
    'err-non-unique-key': {
        name: 'Non-unique GW2 API Key',
        value: 'You cannot add the same API Key twice.',
        inline: false
    },
    'err-no-api-keys': {
        name: 'No GW2 API keys to remove',
        value: 'I either do not have any of your keys stored, or there are no keys matching your criteria.',
        inline: false
    },
    'err-no-user': {
        name: 'No data asocciated with this account',
        value: `I do not have you in my database.\n If you'd like to add new API Key please use **/api-key add**`,
        inline: false
    },
    'err-wrong-key-index': {
        name: 'Wrong API Key Index',
        value: 'There is no API key with this index.\nYou can use **/api-key show** for the list of all your keys.',
        inline: false
    },
    'err-remove-preferred': {
        name: 'Cannot remove your preferred API Key',
        value: 'If you want to delete your preferred key, you can either switch to another key first, or remove all keys.',
        inline: false
    },
    'err-already-preferred': {
        name: 'This API Key is already your preferred key',
        value: 'You can only switch to any non-preferred key.\nUse **/api-key show** for the list of all your keys.',
        inline: false
    },
    'err-user-not-sure': {
        name: 'Incorrect purge check answer',
        value: `You have to type exactly '**Yes, do as I say!**' (without quotes) to succesfully purge.`,
        inline: false
    },
    'err-invalid-key': {
        name: 'Invalid preferred API Key',
        value: `Your preferred API Key is currently invalid.\nIf you are 100% sure, that your API Key is valid, it is possible, that GW2 servers are just having hiccups.\nIf you'd like to add a new API Key, please use **/api-key add**.`,
        inline: false
    },
    'err-missing-permissions': {
        name: 'Missing API Key permissions',
        value: 'Your preferred API Key does not have all the permissions it needs to have for this command.\nPlease add or switch to an API Key which has the following permissions:\n',
        inline: false
    }
}

export default ERROR_FIELDS;
