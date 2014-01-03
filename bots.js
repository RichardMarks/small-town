﻿var ShopKeep = require("./shopkeep.js");
var Scavenger = require("./scavenger.js");
var AIBody = require("./aibody.js");
var Mule = require("./mule.js");

module.exports = function (db) {


    new ShopKeep(db, "Market", 10, { "bird": 10, "steel-wool": 10, "small-potion": 3 }, { "bird": { "gold": 1 }, "steel-wool": { "gold": 2 }, "small-potion": { "gold": 3 } }, null, "Roland");
    new Scavenger(db, "Main-Square", 10, null, null, "Begbie");
    new AIBody(db, "Main-Square", 10,
        {
            "hat": 1, "sunglasses": 1, "towel": 1, "pillow": 1,
            "slacks": 1, "rope": 1, "t-shirt": 1, "sleeve": 2,
            "latex": 2, "shin-guards": 2, "chucks": 1
        },
         null, "Virginia");
    new Mule(db, "Main-Square", 10, "naaay", { "apple": 5, "log": 3 }, null, null, "mule");
};