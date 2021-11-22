import APIKeyInfo from "./APIKeyInfo";

export default interface UserAPIKeyInfo {
    _id: string;
    preferred_api_key: string;
    api_keys: APIKeyInfo[];
}
