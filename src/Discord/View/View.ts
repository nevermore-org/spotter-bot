import { MessageActionRow, MessageButton, MessageButtonStyleResolvable, MessageEmbed } from "discord.js";
import ViewDefault from "../../Model/Discord/ViewDefault";
import { THUMBNAILS } from "./THUMBNAILS";

export default class View implements ViewDefault {
    color: number;
    title: string;
    thumbnail: string;
    embed: MessageEmbed;
    actionRows: [MessageActionRow];
    seed: number;


    constructor(){
        this.color = 0xBAD4A1;
        this.title = "default title";
        this.thumbnail = THUMBNAILS.DEFAULT;
        this.embed = new MessageEmbed();
        this.actionRows = [new MessageActionRow()]; // one action row as a default
        this.seed = 0;
    }

    public createDefault(seed: number = 0){
        this.embed.setColor(this.color).setTitle(this.title).setThumbnail(this.thumbnail).setTimestamp();
        this.seed = seed;
        
        return this;
    }

    // need this to create new action row at the lowest possible index
    // TODO: add check so we dont create more than 5 action rows
    public addRow(){
        this.actionRows.push(new MessageActionRow());
        return this;
    }

    public getRow(rowIndex: number){
        return this.actionRows[rowIndex];
    }

    // TODO: add check so it can't add buttons to rows which don't exist
    // don't like the amount of arguments this function has; buttons are too unique
    public addButton(rowIndex: number, buttonId: string, label: string, style: MessageButtonStyleResolvable = 'PRIMARY'){
        this.actionRows[rowIndex]?.addComponents(
            new MessageButton()
                .setCustomId(`${buttonId}${this.seed}`)
                .setLabel(label)
                .setStyle(style)
        );
        return this;
    }


}
