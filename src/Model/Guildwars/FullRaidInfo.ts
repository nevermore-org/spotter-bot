interface RaidEventInfo {
    id: string, // The event/encounter name; e.g. "vale_guardian"
    type: "Checkpoint" | "Boss"
}

export interface RaidWingInfo {
    id: string, // Name of the "wing" e.g. "spirit_vale" or "bastion_of_the_penitent"
    events: RaidEventInfo[]
}

export interface FullRaidInfo {
    id: string; // Name of the parent raid group e.g. "forsaken_thicket" or "bastion_of_the_penitent"
    wings: RaidWingInfo[]
}
