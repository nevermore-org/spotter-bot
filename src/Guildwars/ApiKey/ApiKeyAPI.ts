import axios from "axios"
import { Collection, Document } from "mongodb";
import AccountInfo from "../../Model/Guildwars/AccountInfo";
import APIKeyInfo from "../../Model/Guildwars/APIKeyInfo";
import TokenInfo from "../../Model/Guildwars/TokenInfo";
import UserAPIKeyInfo from "../../Model/Guildwars/UserAPIKeyInfo";
import { collectionExists, getCollection, getDb, insertMany, insertOne } from "../../Mongo/Mongo";
import { GW_API_URL } from "../General/enum/GW_API_URL";


export default class ApiKeyAPI {

    /**
     * Returns either the user's Document or null/undefined
    */    
    public getUserFromDB = async (userID: string) => {
        const collection = await getCollection('users');
        const userInfo = await collection?.findOne({_id: userID});
        return userInfo;
    }
    
    public getAPIKeyTokenInfo = async(APIKey: string) => {
        const keyResponse = await axios.get(`${GW_API_URL.TOKENINFO}?access_token=${APIKey}`);
        return (<TokenInfo> keyResponse.data);
    }

    public getAccountName = async(APIKey: string) => {
        const accountResponse = await axios.get(`${GW_API_URL.ACCOUNT}?access_token=${APIKey}`);
        const accountInfo: AccountInfo = accountResponse.data;
        return accountInfo.name;
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


    public insertDefaultUserSkeleton = async (userID: string, collection: Collection<Document>) => {
        const userSkeleton: UserAPIKeyInfo = {
            _id: userID,
            api_keys: [],
            preferred_key_index: -1
        }
    
        await insertOne(userSkeleton, collection);
    }

    /**
     * Replaces the original array with a validated one
     * i.e. if the key is valid it just copies the original
     * if the key is now invalid, it uses the invalidKeySkeleton
     * @param userInfo 
     * @returns 
     */
    public validateAPIKeys = async (userInfo: UserAPIKeyInfo | undefined) => {
        if (! userInfo) {return undefined};
        
        const invalidKeySkeleton = (APIKey: string) => {
            return <APIKeyInfo> {
                account_name: '?',
                key_id: APIKey,
                key_name: 'Invalid API Key',
                key_permissions: [],
                is_valid: false,
            }
        }

        const updatedKeys = await Promise.all(userInfo.api_keys.map(async key => {
            const isValid = await this.isAPIKeyValid(key.key_id);
            return isValid ? key : invalidKeySkeleton(key.key_id);
        }));

        return <UserAPIKeyInfo> {
            _id: userInfo._id,
            preferred_key_index: userInfo.preferred_key_index,
            api_keys: updatedKeys
        };
    }

    /**
     * ! Assumes the key is valid
     */
    public getValidAPIKeyInfo = async (APIKey: string) => {
        const accountName = await this.getAccountName(APIKey);
        const keyTokenInfo = await this.getAPIKeyTokenInfo(APIKey);        

        return <APIKeyInfo> {
            account_name: accountName,
            key_id: APIKey,
            key_name: keyTokenInfo.name,
            key_permissions: keyTokenInfo.permissions,
            is_valid: true,
        }
    }
    
    /**
     * adds new API key for the specified user
     * @param userID
     * @param APIKey 
     */
    public addAPIKeyToDB = async (userID: string, APIKey: string) => {
        const collection = await getCollection('users');
        if(!collection) {return 'err-default'}; // Ahhhh
        
        // validate key here first
        if (! await this.isAPIKeyValid(APIKey)) {return 'err-invalid-api-key'}

        const userDB = <UserAPIKeyInfo> await this.getUserFromDB(userID);

        // if the user is not in our DB, add their default skeleton object
        if (! userDB){
            await this.insertDefaultUserSkeleton(userID, collection);
        }

        // unless the insert failed, user has to be in the DB
        const userDBNew = <UserAPIKeyInfo> await this.getUserFromDB(userID);

        // check if the new api key is unique
        if (userDBNew.api_keys.some(key => key.key_id === APIKey)){return 'err-non-unique-key'}

        // Push the new key to the API_Keys array, and set the preferred key to be the one we just pushed
        const lastIndex = userDBNew.api_keys.length;

        // need to transform apikey to the obj
        const apiKeyInfo = await this.getValidAPIKeyInfo(APIKey);

        await collection.updateOne({_id: userID}, {$set: {preferred_key_index: lastIndex}, $push: {api_keys: apiKeyInfo}});
        return 'success';
    }



    // removeAPIKey
    // changepreferredAPIKeyToUse
    
}

