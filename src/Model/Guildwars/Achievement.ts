import { FractalInfo } from "./FractalInfo"

export type AchievementResponse = {
    id: number;
    level: {min: number, max: number},
    required_access?: {product: string, condition: string},
}

// this is what we store in the DB
export interface AchievementMod {
    _id: number;
    id?: number; // only here so we can build our achievement more easily
    name: string;
    special_flag: string;
    description: string;
    requirement: string;
    locked_text: string;
    type: string;
    flags: string[];
    tiers: [
        count: number,
        points: number
    ];
    fractal_info?: FractalInfo;
}

// we get this from GW_API
export type Achievement = {
    id: number;
    name: string;
    description: string;
    requirement: string;
    locked_text: string;
    type: string;
    flags: string[];
    tiers: [
        count: number,
        points: number
    ]
}
