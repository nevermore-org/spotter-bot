import BaseItem from "./BaseItem";


export default interface Item extends BaseItem {
    description: string,
    type: string,
    level: number,
    rarity: string,
    vendor_value: number,
    game_types: string[],
    flags: string[],
    restrictions: string[],
    chat_link: string,
    details?: { // details: { type: 'Unlock', unlock_type: 'Dye', color_id: 698 }
        type: string,
        unlock_type?: string,
        color_id?: number
    }
}
