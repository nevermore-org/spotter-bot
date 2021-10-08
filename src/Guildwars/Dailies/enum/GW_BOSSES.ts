import { DailyData } from "../../../Model/Guildwars/Daily";

// ["Daily Inquest Golem Mark II", "Daily Great Jungle Wurm", "Daily Demolisher", "Daily Claw of Jormag", "Daily Fire Elemental", "Daily Frozen Maw", "Daily Hound Master", "Daily Megadestroyer", "Daily Shadow Behemoth", "Daily Shatterer"]
// don't think there needs to be any description for bosses
const GW_BOSSES: DailyData = {
    "Inquest_Golem_Mark_II": {
        waypoint: "Whitland Flats — [&BNQCAAA=]",
        description: "",
        schedule: ["02:00", "05:00", "08:00", "11:00", "14:00", "17:00", "20:00", "23:00"]
    },
    "Great_Jungle_Wurm": {
        waypoint: "Wychmire Swamp — [&BEEFAAA=]",
        description: "",
        schedule: ["01:15", "03:15", "05:15", "07:15", "09:15", "11:15", "13:15", "15:15", "17:15", "19:15", "21:15", "23:15"]
    },
    "Claw_of_Jormag": {
        waypoint: "Frostwalk Tundra — [&BHoCAAA=]",
        description: "",
        schedule: ["02:30", "05:30", "08:30", "11:30", "14:30", "17:30", "20:30", "23:30"]
    },
    "Demolisher": {
        waypoint: "The Darklands Waypoint — [&BKMKAAA=]",
        description: "",
        schedule: ["1:00", "3:00", "5:00", "7:00", "9:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00", "23:00"]
    },
    "Fire_Elemental": {
        waypoint: "Thaumanova Reactor — [&BEcAAAA=]",
        description: "",
        schedule: ["0:45", "2:45", "4:45", "6:45", "8:45", "10:45", "12:45", "14:45", "16:45", "18:45", "20:45", "22:45"]
    },
    "Frozen_Maw": {
        waypoint: "Hunter's Lake — [&BMIDAAA=]",
        description: "",
        schedule: ["0:15", "2:15", "4:15", "6:15", "8:15", "10:15", "12:15", "14:15", "16:15", "18:15", "20:15", "22:15"]
    },
    "Hound_Master": {
        waypoint: "Vehjin Palace Waypoint — [&BO0KAAA=]",
        description: "",
        schedule: ["0:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]
    },
    "Megadestroyer": {
        waypoint: "Maelstrom's Bile — [&BM0CAAA=]",
        description: "",
        schedule: ["0:30", "3:30", "6:30", "9:30", "12:30", "15:30", "18:30", "21:30"]
    },
    "Shadow_Behemoth": {
        waypoint: "Godslost Swamp — [&BPcAAAA=]",
        description: "",
        schedule: ["1:45", "3:45", "5:45", "7:45", "9:45", "11:45", "13:45", "15:45", "17:45", "19:45", "21:45", "23:45"]
    },
    "Shatterer": {
        waypoint: "Lowland Burns — [&BE4DAAA=]",
        description: "",
        schedule: ["1:00", "4:00", "7:00", "10:00", "13:00", "16:00", "19:00", "22:00"]
    }
}

export default GW_BOSSES;
