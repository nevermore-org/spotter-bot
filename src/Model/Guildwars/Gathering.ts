import { Location } from "./Daily";

export type Region = 'Ascalon' | 'Kryta' | 'Maguuma' | 'Orr' | 'Shiverpeaks' | 'Maguuma Wastes' | 'Heart of Maguuma' | 'Desert';

const gatherTypes = ['Forager', 'Lumberer', 'Miner', 'Viewer'];
export type GatherType = (typeof gatherTypes)[number];

export type Gathering = Record<string, Record<GatherType, Location>>;
