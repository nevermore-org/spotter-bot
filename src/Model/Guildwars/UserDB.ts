
export default interface UserDB {
    _id: string; // discord User ID
    API_Keys: string[];
    preferredAPIKey: number;
    // possibly kp.me key in the future
}
