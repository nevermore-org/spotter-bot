export type AchievementResponse = {
    id: number;
    level: {min: number, max: number},
    required_access?: {product: string, condition: string},
}

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
