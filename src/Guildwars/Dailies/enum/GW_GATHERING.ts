import { Gathering } from "../../../Model/Guildwars/Gathering";

const GW_GATHERING: Gathering = {
    'Ascalon': {
        'Forager': { waypoint: "Loreclaw Waypoint — [&BMcDAAA=]", description: "Potato patch to the south" },
        'Lumberer': { waypoint: "Apostate Waypoint — [&BB0CAAA=]", description: "There are usually quite a few trees in the area around the waypoint." },
        'Miner': { waypoint: "Helliot Mine Waypoint — [&BEsBAAA=]", description: "Rich iron above and to the south" },
    },
    'Kryta': {
        'Forager': { waypoint: "Beetletun Waypoint — [&BPoAAAA=]", description: "Run south, there are lettuce patches in the fields there." },
        'Lumberer': { waypoint: "Wynchona Rally Point Waypoint — [&BKgAAAA=]", description: "There is always a lot of trees around this waypoint, especially to East" },
        'Miner': { waypoint: "Cereboth Waypoint — [&BBIAAAA=]", description: "Rich node, either Iron or Silver, in the cave at the bottom of the waterfall to the north" },
    },
    'Maguuma_Jungle': {
        'Forager': { waypoint: "Akk Wilds Waypoint — [&BEIAAAA=]", description: "To the North is a platform with a farm" },
        'Lumberer': { waypoint: "Broken Arrow Waypoint — [&BNACAAA=]", description: "Usually a fair bunch of trees between this waypoint and Ashen Waypoint — [&BM4CAAA=]." },
        'Miner': { waypoint: "Gallowfields Waypoint — [&BGMAAAA=]", description: "Rich Iron to the west, halfway down the canyon" },
    },
    'Orr': {
        'Forager': { waypoint: "Plinth Timberland Waypoint — [&BFgGAAA=]", description: "Several nodes south. There is a patch of 8 Artichokes to the northeast." },
        'Lumberer': { waypoint: "Pagga's Waypoint — [&BKYCAAA=]", description: "West there are loads of trees near the statue of Melandru" },
        'Miner': { waypoint: "Plinth Timberland Waypoint — [&BFgGAAA=]", description: "Mithril nodes to the south all the way to Thunderhead Waypoint — [&BPACAAA=]." },
    },
    'Shiverpeaks': {
        'Forager': { waypoint: "Demon's Maw Waypoint — [&BOYAAAA=]", description: "Run north, 7 permanent grape nodes west of Greybeard's Landing." },
        'Lumberer': { waypoint: "Serpent Waypoint — [&BEUCAAA=]", description: "Up to five trees around the waypoint" },
        'Miner': { waypoint: "Snowhawk Landing Waypoint — [&BL8AAAA=]", description: "A lot of nodes south and a Rich Iron Vein in cave." },
    },
    'Maguuma_Wastes': {
        'Lumberer': { waypoint: "Camp Resolve Waypoint — [&BH8HAAA=]", description: "No particular area, but follow the south path and look beyond the Red Rock Bastion." },
        'Miner': { waypoint: "Camp Resolve Waypoint — [&BH8HAAA=]", description: "Follow the south path west, usually a rich node near the Vinewrath area." },
        'Forager': { waypoint: "Vine Bridge Waypoint — [&BIYHAAA=]", description: "North, at the skritt farm" },
    },
    'Heart_of_Maguuma': {
        'Forager': { waypoint: "Jaka Itzel Waypoint — [&BOAHAAA=]", description: "Jump off the platform north of the waypoint, then fall and glide to the northeast-east, while avoiding the branches. Deep below, on the ground level there are 8 permanent Flax nodes." },
        'Lumberer': { waypoint: "Eastwatch Waypoint — [&BGwIAAA=]", description: "Should be various nodes in the general area.  However, lots of mobs around as well." },
        'Miner': { waypoint: "Pact Encampment Waypoint — [&BAgIAAA=]", description: "Directly south and far below the waypoint in the ravine, on a platform with Mordrem Snipers." },
    },
    'Desert': {
        'Lumberer': { waypoint: "Highjump Ranch Waypoint — [&BJ0KAAA=]", description: "No particular area, walk around the area in a circle" },
        'Miner': { waypoint: "Augury's Shadow Waypoint — [&BFMKAAA=]", description: "Head east to the Adisa Heart. Mine any regular nodes, but also destroy the Brand Battleshards. Upon destruction they become gathering nodes that count toward the daily." },
        'Forager': { waypoint: "Atholma Waypoint — [&BEMLAAA=]", description: "There are many vegetable fields east of the village." },
    }
}

export default GW_GATHERING;
