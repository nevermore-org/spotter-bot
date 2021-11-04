import { DailyData } from "../../../Model/Guildwars/Daily";

// ffs, they really couldnt have done one single style of daily names...
// why are some things Daily NameOfMiniD Minidungeon, some are Daily NameOfTheDungeon
// and adventures have to have the special treatment of Daily Adventure: Name...
const GW_ADVENTURES: DailyData = {
    "Adventure:_Tendril_Torchers": {
        waypoint: "Shipwreck Peak Waypoint",
        chatcode: "[&BN4HAAA=]",
        description: "Burn tendrils and avoid unexploded shot before time runs out!"
    },
    "Adventure:_Bugs_in_the_Branches": {
        waypoint: "Jaka Itzel Waypoint",
        chatcode: "[&BOAHAAA=]",
        description: "Jump and glide to collect bugs before time runs out!"
    },
    "Adventure:_Flying_Circus": {
        waypoint: "Mellaggan's Valor Waypoint",
        chatcode: "[&BNUHAAA=]",
        description: "Glide through the glowing rings before time runs out!"
    },
    "Adventure:_Shooting_Gallery": {
        waypoint: "Faren's Flyer Waypoint",
        chatcode: "[&BO8HAAA=]",
        description: "Shoot as many target dummies as you can before time runs out!"
    },
    "Adventure:_Salvage_Pit": {
        waypoint: "Shrouded Ruins Waypoint",
        chatcode: "[&BAEIAAA=]",
        description: "Gather supplies and avoid tendrils before time runs out!"
    },
    "Adventure:_The_Floor_Is_Lava?": {
        waypoint: "Wanderer's Waypoint",
        chatcode: "[&BNYHAAA=]",
        description: "Kick rockvine fruit and retrieve as many spores as you can before time runs out!"
    },
    "Adventure:_On_Wings_of_Gold": {
        waypoint: "Forgotten City Waypoint",
        chatcode: "[&BMYHAAA=]",
        description: "Deliver collected shield anomalies by gliding near the collection device."
    },
    "Adventure:_Sanctum_Scramble": {
        waypoint: "Forgotten City Waypoint",
        chatcode: "[&BMYHAAA=]",
        description: "Jump, launch, and glide your way through the checkpoints and across the finish line!"
    },
    "Adventure:_Fallen_Masks": {
        waypoint: "Forgotten City Waypoint",
        chatcode: "[&BMYHAAA=]",
        description: "Soothe the tormented spirits of the fallen Exalted."
    },
    "Adventure:_A_Fungus_Among_Us": {
        waypoint: "Southwatch Waypoint",
        chatcode: "[&BAIIAAA=]",
        description: "Use mushroom skills to reach checkpoints."
    },
    "Adventure:_The_Ley-Line_Run": {
        waypoint: "Dragon's Passage Waypoint",
        chatcode: "[&BIgIAAA=]",
        description: "Race across a ley-line as a spark."
    },
    "Adventure:_Drone_Race": {
        waypoint: "SCAR Camp Waypoint",
        chatcode: "[&BAAIAAA=]",
        description: "Race your way through the checkpoints!"
    },
    "Adventure:_Beetle_Feast": {
        waypoint: "Teku Nuhoch Waypoint",
        chatcode: "[&BAwIAAA=]",
        description: "Collect mushrooms and use beetle skills to reach the end."
    },
    "Adventure:_Haywire_Punch-o-Matic_Battle": {
        waypoint: "Rata Novus Waypoint",
        chatcode: "[&BAMIAAA=]",
        description: "Kill as many chak as you can before the timer runs out."
    },
    "Adventure:_Scrap_Rifle_Field_Test": {
        waypoint: "SCAR Camp Waypoint",
        chatcode: "[&BAAIAAA=]",
        description: "Kill as many chaks as you can with scrap rifle!"
    },
    "Desert_Adventurer": {
        waypoint: "Don't have a WP for you, want a cookie instead? :cookie:",
        chatcode: "[?]",
        description: "Needs some research which desert adventure is the fastest"
    },
}
    
export default GW_ADVENTURES;
