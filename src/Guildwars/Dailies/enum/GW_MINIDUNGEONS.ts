import EMOJIS from "../../../Discord/View/enum/EMOJIS";
import { DailyData } from "../../../Model/Guildwars/Daily";

const GW_MINIDUNGEONS: DailyData = {
    "Rebel's_Seclusion": {
        waypoint: "Breaktooth's Waypoint — [&BBoCAAA=]",
        description: "Northeast, look for a cave entrance guarded by Separatists."
    },
    "Vexa's_Lab": {
        waypoint: "Breaktooth's Waypoint — [&BBoCAAA=]",
        description: "Travel west across Sloven Pitch to the vista. Cave with a portal is southwest."
    },
    "Goff's_Loot": {
        waypoint: "Gap Waypoint — [&BLoDAAA=]",
        description: `North of the waypoint at ${EMOJIS['POI']}Goff's Bandits.`
    },
    "Bad_Neighborhood": {
        waypoint: "Ojon's Lumbermill Waypoint — [&BPkAAAA=]",
        description: "Northwest across Lake Delavan. Look for a door embedded in the wall."
    },
    "Don't_Touch_the_Shiny": {
        waypoint: "Mabon Waypoint — [&BDoBAAA=]",
        description: "North of the waypoint, the entrance is above the last 'n' of 'Unseen' on the map."
    },
    "Tears_of_Itlaocol": {
        waypoint: "Falias Thorp Waypoint — [&BD4BAAA=]",
        description: "Sound the gong behind the hylek chief south of the waypoint."
    },
    "Grounded": {
        waypoint: "Shipwreck Rock Waypoint — [&BOQGAAA=]",
        description: "Head northwest until the shipwreck is on your left."
    },
    "Forgotten_Stream": {
        waypoint: "Verdance Waypoint — [&BBsDAAA=]",
        description: "Head northeast into the water. Swim under the wreckage directly ahead and you should surface in a large tunnel."
    },
    "Ship_of_Sorrows": {
        waypoint: "Royal Forum Waypoint — [&BPMCAAA=]",
        description: `In a sunken ship west of the ${EMOJIS['POI']}Plaza of Lost Wisdom.`
    },
    "The_Long_Way_Around": {
        waypoint: "Vesper Bell Waypoint — [&BPICAAA=]",
        description: "Way too much trouble for a minidungeon honestly."
    },
    "Forsaken_Fortune": {
        waypoint: "Wyrmblood Waypoint — [&BGUCAAA=]",
        description: "Way too much trouble for a minidungeon honestly."
    },
    "Magellan's_Memento": {
        waypoint: "Arundon Waypoint — [&BHgCAAA=]",
        description: `Northeast, between ${EMOJIS['POI']}Safewatch Vale and ${EMOJIS['POI']}Offering Stone.`
    },
    "Windy_Cave_Treasure": {
        waypoint: "Mistriven Waypoint — [&BJkBAAA=]",
        description: "Head south and then make a right going west."
    },
}

export default GW_MINIDUNGEONS;
