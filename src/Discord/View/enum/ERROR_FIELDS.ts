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
        value: 'You cannot add the same key twice.',
        inline: false
    },
    'err-no-api-keys': {
        name: 'No GW2 API keys to remove',
        value: 'I either do not have any of your keys stored, or there are no keys matching your criteria.',
        inline: false
    },
    'err-no-user': {
        name: 'No data asocciated with you',
        value: 'I do not have you in my archives.',
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
        name: 'This API Key is already your prefered key',
        value: 'You can switch to any non-preferred key.\nUse **/api-key show** for the list of all your keys.',
        inline: false
    }
}

export default ERROR_FIELDS;
