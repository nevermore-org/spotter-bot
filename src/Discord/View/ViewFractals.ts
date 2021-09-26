import Fractal from "../../Model/Guildwars/Fractal";
import { THUMBNAILS } from "./THUMBNAILS";
import View from "./View";


export default class ViewFractals extends View{
    thumbnail = THUMBNAILS.FRACTAL;    

    constructor(today: boolean){
        super();
        this.title = `Fractal dailies - ${today ? "Today" : "Tomorrow"}`
    }

    public getEmbed(data: Fractal[]){
        this.embed.addFields(
            { name: "T4 Fractals", value: `${data[6].name}\n${data[10].name}\n${data[14].name}` },
            { name: "Recommended fractals", value: `${data[2].name}\n${data[1].name}\n${data[0].name}` },
        )
        return this.embed;
    }

}
