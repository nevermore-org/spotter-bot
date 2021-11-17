import { Collection, Document } from "mongodb";
import { createAchievements } from "../createAchievements";


export type CollectionCreateFunction = (collection: Collection<Document>) => Promise<void>;
export interface CollectionConfig {
    wantCron: boolean
    createFunction: CollectionCreateFunction
}

export type Collections  = Record<string, CollectionConfig>;

// for drop&update
export const COLLECTIONS: Collections = {
    "achievements": {
        wantCron: true,
        createFunction: createAchievements
    }
}
