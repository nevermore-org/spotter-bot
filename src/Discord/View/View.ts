import { ColorResolvable, MessageActionRow, MessageButton, MessageButtonStyleResolvable, MessageEmbed } from "discord.js";
import ViewDefault from "../../Model/Discord/ViewDefault";
import { THUMBNAILS } from "./enum/THUMBNAILS";

/**
 * Acts as a base class for all views
 */
export default class View implements ViewDefault {
    defaultColor: number;
    defaultTitle: string;
    defaultThumbnail: string;
    //This allows us to have ONE view with MULTIPLE embeds and buttons without code magic. Yay!
    embeds: Map<string, MessageEmbed>;
    actionRows: Map<string, MessageActionRow[]>;
    //
    seed: number;

    /**
     * @param seed - might be good to upgrade to something like uuid
     */
    constructor(seed: number = Math.random()) {
        this.defaultColor = 0xBAD4A1;
        this.defaultTitle = "default title";
        this.defaultThumbnail = THUMBNAILS.DEFAULT;
        this.embeds = new Map<string, MessageEmbed>();
        this.actionRows = new Map<string, MessageActionRow[]>();
        this.seed = seed;
    }

    /**
     * Creates a new embed with specified embed id
     * @param id
     * @param title 
     * @param thumbnail 
     * @param color 
     * @returns 
     */
    public createEmbed(
        id: string,
        title: string = this.defaultTitle,
        thumbnail: string = this.defaultThumbnail,
        color: ColorResolvable = this.defaultColor
    ): MessageEmbed {
        const embed = new MessageEmbed();
        embed.setColor(color).setTitle(title).setThumbnail(thumbnail).setTimestamp();
        this.embeds.set(id, embed);
        return embed; //We can return embed object and further update it, because embed map holds references to this object
    }

    /**
     * Returns an embed with specified id
     * @param id
     * @returns 
     */
    public getEmbed(id: string): MessageEmbed {
        const embed = this.embeds.get(id);
        if (embed) return embed;
        throw new ReferenceError(`Invalid embed '${id}'`);
    }

    /**
     * Adds action row to a specified embed id
     * Validates if there are about to be more action rows than 5
     * @param embedId 
     * @returns 
     */
    public addActionRowToEmbed(embedId: string): View {
        let actionRowArray: MessageActionRow[] | undefined = this.actionRows.get(embedId);
        if (!actionRowArray) actionRowArray = [];
        if (actionRowArray.length > 4) throw new RangeError(`Attempted to create a 6th action row at embed ${embedId}. Rows are limited to 5.`);

        const actionRow = new MessageActionRow();
        actionRowArray.push(actionRow);
        this.actionRows.set(embedId, actionRowArray);

        return this; //Here we cannot return created actionRow, because we would lose the validations bellow. 
    }

    /**
     * Returns an action row with specified embed id
     * @param embedId 
     * @param actionRowIndex 
     * @returns 
     */
    public getActionRow(embedId: string, actionRowIndex: number): MessageActionRow {
        const actionRows = this.actionRows.get(embedId);
        if (!actionRows) throw new ReferenceError(`Invalid action rows embed id '${embedId}'.`);
        const actionRow = actionRows[actionRowIndex];
        if (!actionRow) throw new ReferenceError(`Invalid action row index '${actionRowIndex}' at '${embedId}'.`);

        return actionRow;
    }

    // don't like the amount of arguments this function has; buttons are too unique
    /*
    Personally I think it's fine. These arguments will most of the time be different for every button, so it's neccesary to have such amount of parameters.
    + it's nice to be able to edit these values - Kiki 
    */
    /**
     * Adds a button to a specified embed
     * @param embedId 
     * @param actionRowIndex ~ basically a y-axis for buttons
     * @param label
     * @param style 
     * @returns 
     */
    public addButton(embedId: string, actionRowIndex: number, label: string, style: MessageButtonStyleResolvable = 'PRIMARY'): View {
        const actionRow: MessageActionRow = this.getActionRow(embedId, actionRowIndex);
        if (actionRow.components.length > 4) throw new RangeError(`Attempted to create a 6th button at action row '${embedId}'. Buttons are limited to 5.`);
        actionRow.addComponents(
            new MessageButton()
                .setCustomId(`${embedId}${this.seed}`)
                .setLabel(label)
                .setStyle(style)
        );
        return this;
    }
}
