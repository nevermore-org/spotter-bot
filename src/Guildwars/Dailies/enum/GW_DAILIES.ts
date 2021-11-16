import { DateTime, Duration } from "luxon";
import EMOJIS from "../../../Discord/View/enum/EMOJIS";
import { DailyFormat, Location } from "../../../Model/Guildwars/Daily";
import { GW_API_URL } from "../../General/enum/GW_API_URL";
import { calcBoss, prettifyDuration } from "../../../Util/util";
import GW_GATHERING from "./GW_GATHERING";
import GW_PUZZLES from "./GW_PUZZLES";
import GW_MINIDUNGEONS from "./GW_MINIDUNGEONS";
import GW_DUNGEONS from "./GW_DUNGEONS";
import GW_ADVENTURES from "./GW_ADVENTURES";
import GW_BOSSES from "./GW_BOSSES";
import GW_VISTAS from "./GW_VISTAS";

const EMPTY_LOCATION: Location = {waypoint: " ", chatcode: " ", description: " "};

export const NORMALIZE_DAILY: Record<string, string> = {
    "Lumberer": "Lumberer",
    "Miner" : "Miner",
    "Forager": "Forager",
    "Viewer": "Vista",
    "Puzzle": "Puzzle",
    "Minidungeon": "Minidungeon",
    "Taskmaster": "Taskmaster",
    "Participation": "Activity",
    "Completer": "Event Completer",
    "Hunter": "Bounty Hunter",
    "Forger": "Mystic Forger",
    "Catacombs": "Dungeon",
    "Manor": "Dungeon",
    "Arbor": "Dungeon",
    "Embrace": "Dungeon",
    "Flame": "Dungeon",
    "Waves": "Dungeon",
    "Eternity": "Dungeon",
    "Arah": "Dungeon",
    "Name": "Adventure",
    "Torchers": "Adventure",
    "Branches": "Adventure",
    "Circus": "Adventure",
    "Gallery": "Adventure",
    "Pit": "Adventure",
    "Lava?": "Adventure",
    "Gold": "Adventure",
    "Scramble": "Adventure",
    "Masks": "Adventure",
    "Us": "Adventure",
    "Run": "Adventure",
    "Race": "Adventure",
    "Feast": "Adventure",
    "Battle": "Adventure",
    "Test": "Adventure",
    "Adventurer": "Adventure",
    "II": "Boss",
    "Wurm": "Boss",
    "Jormag": "Boss",
    "Demolisher": "Boss",
    "Elemental": "Boss",
    "Maw": "Boss",
    "Master": "Boss",
    "Megadestroyer": "Boss",
    "Behemoth": "Boss",
    "Shatterer": "Boss",
    "Spender": "Big Spender"
}

export const GW_DAILY: Record<string, DailyFormat> = {
    "Lumberer": {
        endOfName: -1,
        wantWaypoint: true,
        location: (regionName) => {return GW_GATHERING[regionName]["Lumberer"]},
        prettyFormat: (location) => {
            return `${EMOJIS["Waypoint"]} ${location.waypoint} - ${location.chatcode}\n ${EMOJIS['Lumberer']} *${location.description}*`
        }
    },

    "Miner": {
        endOfName: -1,
        wantWaypoint: true,
        location: (regionName) => {return GW_GATHERING[regionName]["Miner"]},
        prettyFormat: (location) => {
            return `${EMOJIS["Waypoint"]} ${location.waypoint} - ${location.chatcode}\n ${EMOJIS['Miner']} *${location.description}*`
        }
    },

    "Forager": {
        endOfName: -1,
        wantWaypoint: true,
        location: (regionName) => {return GW_GATHERING[regionName]["Forager"]},
        prettyFormat: (location) => {
            return `${EMOJIS["Waypoint"]} ${location.waypoint} - ${location.chatcode}\n ${EMOJIS['Forager']} *${location.description}*`
        }
    },

    "Vista": {
        endOfName: -2,
        wantWaypoint: true,
        location: (regionName) => {return GW_VISTAS[regionName]},
        prettyFormat: (location) => {
            return `${EMOJIS["Waypoint"]} ${location.waypoint} - ${location.chatcode}\n ${EMOJIS['Viewer']} *${location.description}*`
        }
    },

    "Puzzle": {
        endOfName: -2,
        wantWaypoint: true,
        location: (puzzleName) => {return GW_PUZZLES[puzzleName]},
        prettyFormat: (location, puzzleName) => {
            return `${EMOJIS["Waypoint"]} ${location.waypoint} - ${location.chatcode}\n*${EMOJIS['JP']} ${location.description}*\n${EMOJIS['Guide']} [Wiki Guide](${GW_API_URL.WIKI}${puzzleName})`;
        }  
    },

    "Adventure": {
        endOfName: 0,
        wantWaypoint: true,
        location: (name) => {return GW_ADVENTURES[name]},
        prettyFormat: (location) => {
            return `${EMOJIS["Waypoint"]} ${location.waypoint} - ${location.chatcode}\n*${EMOJIS['Adventure']} ${location.description}*`
        }

    },
    
    "Boss": {
        endOfName: 0,
        wantWaypoint: true,
        location: (name) => {return GW_BOSSES[name]},
        prettyFormat: (location) => {
            return `${EMOJIS["Waypoint"]} ${location.waypoint} - ${location.chatcode}\n*${EMOJIS['Boss']} Will be up in ${prettifyDuration(calcBoss(location.schedule))}*`;
        }
    },

    "Dungeon": {
        endOfName: 0,
        wantWaypoint: true,
        location: (name) => {return GW_DUNGEONS[name]},
        prettyFormat: (location) => {
            return `${EMOJIS["Waypoint"]} ${location.waypoint} - ${location.chatcode}\n*${EMOJIS['Dungeon']} ${location.description}*`;
        }

    },

    "Minidungeon": {
        endOfName: -1,
        wantWaypoint: true,
        location: (miniName) => {return GW_MINIDUNGEONS[miniName]},
        prettyFormat: (location) => {
            return `${EMOJIS["Waypoint"]} ${location.waypoint} - ${location.chatcode}\n*${EMOJIS['Dungeon']} ${location.description}*`;
        }
    },

    "Taskmaster": {
        endOfName: -1,
        wantWaypoint: true,
        location: (regionName) => {return GW_HEARTS[regionName]},
        prettyFormat: (location) => {
            return `${EMOJIS["Waypoint"]} ${location.waypoint} - ${location.chatcode}\n*${EMOJIS['Heart']} ${location.description}*`;
        }
    },

    "Activity": {
        endOfName: -1,
        wantWaypoint: true,
        location: () => {return {waypoint:"Gate Hub Plaza Waypoint",chatcode: "[&BBEEAAA=]", description: " "}},
        prettyFormat: (location) => {
            // weekday is indexed from 1
            const weekday: number = DateTime.utc().weekday - 1;
            return `${EMOJIS["Waypoint"]} ${location.waypoint} - ${location.chatcode}\n*${EMOJIS['Activity']} ${GW_ACTIVITIES[weekday]}*`;
        }
    },

    // dailies with simple formatting
    "Event Completer": {
        endOfName: -1,
        wantWaypoint: false,
        location: () => {return EMPTY_LOCATION},
        prettyFormat: () => {
            return `${EMOJIS["Event"]} You sure you really wanna do this daily?`;
        }
    },

    "Bounty Hunter": {
        endOfName: -2,
        wantWaypoint: false,
        location: () => {return EMPTY_LOCATION},
        prettyFormat: () => {
            return `${EMOJIS["Apple"]} Follow your local apple.`;
        }
    },

    "Mystic Forger": {
        endOfName: -1,
        wantWaypoint: false,
        location: () => {return EMPTY_LOCATION},
        prettyFormat: () => {
            return `${EMOJIS['MysticForge']} Easy-peasy.`;
        }
    },
    // only WvW daily implemented so far, kinda the only one we really care for
    "Big Spender": {
        endOfName: 0,
        wantWaypoint: false,
        location: () => {return EMPTY_LOCATION},
        prettyFormat: () => {
            return `${EMOJIS['BadgeOfHonor']} Spend 25 Badges of Honor in World versus World.`;
        }
    },
}


export const GW_HEARTS: Record<string, Location> = {
    "Elon_Riverlands": {
        waypoint: "Olishar's Oasis Camp Waypoint",
        chatcode: "[&BCgKAAA=]",
        description: "Help Ebele prepare the way north for defectors"
    },
    "Desolation": {
        waypoint: "Bonestrand Waypoint",
        chatcode: "[&BNwKAAA=]",
        description: "Help Kisha Odili keep the village running"
    }
}

// each day has a preset activity
export const GW_ACTIVITIES: string[] = ["Crab Toss", "Sanctum Sprint", "Southsun Survival", "Crab Toss", "Sanctum Sprint", "Southsun Survival", "Keg Brawl"];
