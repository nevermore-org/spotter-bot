import APIKeyInfo from "./APIKeyInfo";

export default interface UserAPIKeyInfo {
    _id: string;
    api_keys: APIKeyInfo[];
    preferred_key_index: number;
}
