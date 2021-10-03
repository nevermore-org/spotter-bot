import { Location } from "./Gathering";

export type DailyResponse = {
    id: number;
    name: string;
}

export interface DailyFormat {
    endOfName: number,
    wantWaypoint: boolean,
    location: (name: string, dailyType: string) => Location,
    prettyFormat: (location: Location, name: string) => string
}
