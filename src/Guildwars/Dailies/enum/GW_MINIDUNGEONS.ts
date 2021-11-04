import EMOJIS from "../../../Discord/View/enum/EMOJIS";
import { DailyData } from "../../../Model/Guildwars/Daily";

const GW_MINIDUNGEONS: DailyData = {
    "Rebel's_Seclusion": {
        waypoint: "Breaktooth's Waypoint",
        chatcode: "[&BBoCAAA=]",
        description: "Northeast, look for a cave entrance guarded by Separatists."
    },
    "Vexa's_Lab": {
        waypoint: "Breaktooth's Waypoint",
        chatcode: "[&BBoCAAA=]",
        description: "Travel west across Sloven Pitch to the vista. Cave with a portal is southwest."
    },
    "Goff's_Loot": {
        waypoint: "Gap Waypoint",
        chatcode: "[&BLoDAAA=]",
        description: `North of the waypoint at ${EMOJIS['POI']}Goff's Bandits.`
    },
    "Bad_Neighborhood": {
        waypoint: "Ojon's Lumbermill Waypoint",
        chatcode: "[&BPkAAAA=]",
        description: "Northwest across Lake Delavan. Look for a door embedded in the wall."
    },
    "Don't_Touch_the_Shiny": {
        waypoint: "Mabon Waypoint",
        chatcode: "[&BDoBAAA=]",
        description: "North of the waypoint, the entrance is above the last 'n' of 'Unseen' on the map."
    },
    "Tears_of_Itlaocol": {
        waypoint: "Falias Thorp Waypoint",
        chatcode: "[&BD4BAAA=]",
        description: "Sound the gong behind the hylek chief south of the waypoint."
    },
    "Grounded": {
        waypoint: "Shipwreck Rock Waypoint",
        chatcode: "[&BOQGAAA=]",
        description: "Head northwest until the shipwreck is on your left."
    },
    "Forgotten_Stream": {
        waypoint: "Verdance Waypoint",
        chatcode: "[&BBsDAAA=]",
        description: "Head northeast into the water. Swim under the wreckage directly ahead and you should surface in a large tunnel."
    },
    "Ship_of_Sorrows": {
        waypoint: "Royal Forum Waypoint",
        chatcode: "[&BPMCAAA=]",
        description: `In a sunken ship west of the ${EMOJIS['POI']}Plaza of Lost Wisdom.`
    },
    "The_Long_Way_Around": {
        waypoint: "Vesper Bell Waypoint",
        chatcode: "[&BPICAAA=]",
        description: "Way too much trouble for a minidungeon honestly."
    },
    "Forsaken_Fortune": {
        waypoint: "Wyrmblood Waypoint",
        chatcode: "[&BGUCAAA=]",
        description: "Way too much trouble for a minidungeon honestly."
    },
    "Magellan's_Memento": {
        waypoint: "Arundon Waypoint",
        chatcode: "[&BHgCAAA=]",
        description: `Northeast, between ${EMOJIS['POI']}Safewatch Vale and ${EMOJIS['POI']}Offering Stone.`
    },
    "Windy_Cave_Treasure": {
        waypoint: "Mistriven Waypoint",
        chatcode: "[&BJkBAAA=]",
        description: "Head south and then make a right going west."
    },
}
    
export default GW_MINIDUNGEONS;
