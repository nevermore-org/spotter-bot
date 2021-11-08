import Transport, { TransportStreamOptions } from 'winston-transport';
import os from 'os';
import axios from 'axios';
import { MessageEmbed, MessageOptions } from 'discord.js';
import WinstonBaseInfo from '../../Model/Discord/WinstonBaseInfo';
import { THUMBNAILS } from '../View/enum/THUMBNAILS';

// https://github.com/sidhantpanda/winston-discord-transport/blob/master/src/index.ts

interface DiscordTransportOptions extends TransportStreamOptions {
    /** Webhook obtained from Discord */
    webhook: string;
    /** Meta data to be included inside Discord Message */
    defaultMeta: any;
}

export default class DiscordTransport extends Transport {
    /** Webhook obtained from Discord */
    private webhook: string;

    /** Discord webhook id */
    private id: string | null = null;

    /** Discord webhook token */
    private token: string | null = null;

    /** Initialization promise resolved after retrieving discord id and token */
    private initialized: Promise<void> | null = null;

    /** Meta data to be included inside Discord Message */
    private defaultMeta: { [key: string]: string };

    /** Available colors for discord messages */
    private static COLORS: { [key: string]: number } = {
        error: 14362664, // #db2828
        warn: 16497928, // #fbbd08
        info: 2196944, // #2185d0
        verbose: 6559689, // #6435c9
        debug: 2196944, // #2185d0
        silly: 2210373, // #21ba45
    };

    constructor(options: DiscordTransportOptions) {
        super(options);
        this.webhook = options.webhook;
        this.defaultMeta = options.defaultMeta;
        this.initialize();
    }

    /** Helper function to retrieve url */
    private getUrl = () => {
        return `https://discordapp.com/api/v6/webhooks/${this.id}/${this.token}`;
    }

    /**
     * Initialize the transport to fetch Discord id and token
     */
    private initialize = () => {
        this.initialized = new Promise((resolve, reject) => {
            const options = {
                url: this.webhook,
                method: 'GET',
                json: true
            };

            axios.get(options.url)
                .then(response => {
                    this.id = response.data.id;
                    this.token = response.data.token;
                    resolve();
                }).catch(err => {
                    console.error(`Could not connect to Discord Webhook at ${this.webhook}`);
                    reject(err);
                });
        });
    }

    /**
     * Function exposed to winston to be called when logging messages
     * @param info Log message from winston
     * @param callback Callback to winston to complete the log
     */
    log(info: WinstonBaseInfo, callback: { (): void }) {
        if (info.discord !== false) {
            setImmediate(() => {
                this.initialized?.then(() => {
                    this.sendToDiscord(info);
                }).catch(err => {
                    console.log('Error sending message to discord', err);
                });
            });
        }

        callback();
    }

    private createPrettyEmbed (info: WinstonBaseInfo) {
        const messageArray = info.message.split('\n');

        const prettyEmbed = new MessageEmbed()
            .setTitle(messageArray[0])
            .setColor(DiscordTransport.COLORS[info.level])
            .setTimestamp(new Date())
        
        prettyEmbed.addField(messageArray[1], messageArray.slice(2).join('\n'));
        return prettyEmbed;
    }



    /**
     * Sends log message to discord
     */
    private sendToDiscord = async (info: WinstonBaseInfo) => {
        const mainEmbed = this.createPrettyEmbed(info);
        const postBody: MessageOptions = {embeds: [mainEmbed]};

        // if (this.defaultMeta) {
        //     Object.keys(this.defaultMeta).forEach(key => {
        //         postBody.embeds[0].fields.push({
        //             name: key,
        //             value: this.defaultMeta[key]
        //         });
        //     });
        // }

        // if (info.meta) {
        //     Object.keys(info.meta).forEach(key => {
        //         postBody.embeds[0].fields.push({
        //             name: key,
        //             value: info.meta[key]
        //         });
        //     });
        // }

        const options = {
            url: this.getUrl(),
            method: 'POST',
            json: true,
            body: postBody
        };

        try {
            await axios.post(options.url, options.body, { headers: { "Content-Type": "application/json" } })
        } catch (err) {
            console.error('Error sending to discord');
        }
    }
}
