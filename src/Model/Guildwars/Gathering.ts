export interface Location {
    waypoint: string,
    description: string
}

export type Region = 'Ascalon' | 'Kryta' | 'Maguuma' | 'Orr' | 'Shiverpeaks' | 'Maguuma Wastes' | 'Heart of Maguuma' | 'Desert';

const gatherTypes = ['Forager', 'Lumberer', 'Miner', 'Viewer'];
export type GatherType = (typeof gatherTypes)[number];
export const isGatherType = (x: any) : x is GatherType => gatherTypes.includes(x);

export type Gathering = Record<string, Record<GatherType, Location>>;
