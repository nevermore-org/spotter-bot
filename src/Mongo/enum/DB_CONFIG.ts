import { Collection, Document } from "mongodb";
import { createAchievements, isAchievAPIAvailable } from "../createAchievements";


export type CollectionCreateFunction = (collection: Collection<Document>) => Promise<void>;
export type PreUpdateCheckFunction = () => Promise<boolean>;

export interface CollectionConfig {
    wantCron: boolean
    createFunction: CollectionCreateFunction,
    preUpdateCheck?: PreUpdateCheckFunction
}

export type Collections  = Record<string, CollectionConfig>;

// for drop&update
export const COLLECTIONS: Collections = {
    "achievements": {
        wantCron: true,
        createFunction: createAchievements,
        preUpdateCheck: isAchievAPIAvailable
    }
}
