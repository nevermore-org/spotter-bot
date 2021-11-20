import axios from "axios"
import { Collection, Document } from "mongodb";
import AccountInfo from "../../Model/Guildwars/AccountInfo";
import APIKeyInfo from "../../Model/Guildwars/APIKeyInfo";
import TokenInfo from "../../Model/Guildwars/TokenInfo";
import UserDB from "../../Model/Guildwars/UserDB";
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
     * Need to check API Keys validity before displaying something
     */
    public getAPIKeyInfo = async(APIKey: string, isPreferred: boolean = false) => {
        const isValid = await this.isAPIKeyValid(APIKey);
        
        if (!isValid) {
           return <APIKeyInfo> {
                account_name: '?',
                key_id: APIKey,
                key_name: 'Invalid API Key',
                key_permissions: [],
                is_valid: false,
                is_preferred: isPreferred
            }
        }

        const accountName = await this.getAccountName(APIKey);
        const keyTokenInfo = await this.getAPIKeyTokenInfo(APIKey);        

        return <APIKeyInfo> {
            account_name: accountName,
            key_id: APIKey,
            key_name: keyTokenInfo.name,
            key_permissions: keyTokenInfo.permissions,
            is_valid: isValid,
            is_preferred: isPreferred
        }
    }

    /**
     * Creates an array of all the juicy APIKey data
     * assumes user actually exists!
     */
    public createAPIKeysInfo = async(userDB: UserDB) => {
        return await Promise.all(userDB.API_Keys.map( async (key, index) => {
            const isPreferred = index === userDB.preferredAPIKey;
            return await this.getAPIKeyInfo(key, isPreferred);
        }));
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

        const userDB = <UserDB> await this.getUserFromDB(userID);
        
        // validate key here first
        if (! await this.isAPIKeyValid(APIKey)) {return 'err-invalid-api-key'}

        // if the user is not in our DB, add their default skeleton object
        if (! userDB){
            await this.addUserToCollection(userID, collection);
        }

        // unless the insert failed, user has to be in the DB
        const userDBNew = <UserDB> await this.getUserFromDB(userID);

        // check if the new api key is unique
        if (userDBNew.API_Keys.includes(APIKey)){return 'err-non-unique-key'}

        // Push the new key to the API_Keys array, and set the preferred key to be the one we just pushed
        const lastIndex = userDBNew.API_Keys.length;
        await collection.updateOne({_id: userID}, {$set: {preferredAPIKey: lastIndex}, $push: {API_Keys: APIKey}});
        return 'success';
    }



    // removeAPIKey
    // changepreferredAPIKeyToUse
    
}

