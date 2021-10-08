export type DailyResponse = {
    id: number;
    name: string;
}

export interface Location {
    waypoint: string,
    description: string,
    schedule?: string[]
}

export type DailyData = Record<string, Location>;

export interface DailyFormat {
    endOfName: number,
    wantWaypoint: boolean,
    location: (name: string, dailyType: string) => Location,
    prettyFormat: (location: Location, name: string) => string
}
