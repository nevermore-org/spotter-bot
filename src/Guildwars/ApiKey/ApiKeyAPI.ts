import axios from "axios"
import { Collection, Document } from "mongodb";
import UserDB from "../../Model/Guildwars/UserDB";
import { collectionExists, getCollection, getDb, insertMany, insertOne } from "../../Mongo/Mongo";
import { GW_API_URL } from "../General/enum/GW_API_URL";


export default class ApiKeyAPI {

    /**
     * Returns either [] if the user is not our DB
     * or an array of one Document if the user is found since _id is unique
     * 
    */    
    public getUserInfoFromDB = async (userID: string) => {
        const collection = await getCollection('users');
        const userInfo = await collection?.find({_id: userID}).toArray();
        return userInfo ? userInfo : [];
    }

    /** 
     * Or rather add the default skeleton of an user object
    */
    public addUserToCollection = async (userID: string, collection: Collection<Document>) => {
        const userDefault: UserDB = {
            _id: userID,
            API_Keys: [],
            preferredAPIKey: -1
        }
        
        await insertOne(userDefault, collection);
    }

    /**
     * Axios errors out with 401 if the key is invalid
     * @param APIKey 
     * @returns 
     */
    public isAPIKeyValid = async (APIKey: string) => {
        try {
            await axios.get(`${GW_API_URL.TOKENINFO}?access_token=${APIKey}`);
        }
        catch {
            return false;
        }
        return true;
    }

    
    /**
     * adds new API key for the specified user
     * should replace those returns with an enum prolly
     * @param userID
     * @param APIKey 
     */
    public addAPIKeyToDB = async (userID: string, APIKey: string) => {
        const collection = await getCollection('users');
        if(!collection) {return 'err-default'}; // Ahhhh

        const userInfo = <UserDB[]> await this.getUserInfoFromDB(userID);
        
        // validate key here first
        if (! await this.isAPIKeyValid(APIKey)) {return 'err-invalid-api-key'}

        // if the user is not in our DB, add their default skeleton object
        if (! userInfo || userInfo.length === 0){
            await this.addUserToCollection(userID, collection);
        }

        // unless the insert failed, user has to be in the DB
        const userInfoNew = <UserDB[]> await this.getUserInfoFromDB(userID);

        // check if the new api key is unique
        if (userInfoNew[0].API_Keys.includes(APIKey)){return 'err-non-unique-key'}

        // Push the new key to the API_Keys array, and set the preferred key to be the one we just pushed
        const lastIndex = userInfoNew[0].API_Keys.length;
        await collection.updateOne({_id: userID}, {$set: {preferredAPIKey: lastIndex}, $push: {API_Keys: APIKey}});
        return 'success';
    }



    // removeAPIKey
    // changepreferredAPIKeyToUse
    
}

