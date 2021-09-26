import { MessageEmbed } from "discord.js";
import ViewDefault from "../../Model/Discord/ViewDefault";
import { THUMBNAILS } from "./THUMBNAILS";

export default class View implements ViewDefault {
    color: number;
    title: string;
    thumbnail: string;
    embed: MessageEmbed;


    constructor(){
        this.color = 0xBAD4A1;
        this.title = "default title";
        this.thumbnail = THUMBNAILS.DEFAULT;
        this.embed = new MessageEmbed();
    }

    public createDefault(){
        this.embed.setColor(this.color).setTitle(this.title).setThumbnail(this.thumbnail).setTimestamp();
        
        return this;
    }
}
