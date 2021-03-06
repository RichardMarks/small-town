var AIBody = require("./aibody.js");
var core = require("../core.js");

/*
 * Aggressor class
 *  A violent NPC. Will alternate between moving and attacking
 *
 * players.
 *  - roomId: the name of the room in which the Aggressor starts.
 *  - hp: how much health the Aggressor starts with.
 *  - items (optional): an associative array of item IDs to counts,
 *      representing the stuff in the character's pockets.
 *  - equipment (optional): an associative array of item IDs to
 *      counts, representing the stuff in use by the character.
 */
function Aggressor(db, roomId, hp, items, equipment, id) {
    AIBody.call(this, db, roomId, hp, items, equipment, id);
    this.targetId = null;
}

Aggressor.prototype = Object.create(AIBody.prototype);
module.exports = Aggressor;

Aggressor.prototype.idleAction = function () {
    var rm = this.db.rooms[this.roomId];
    if(rm) {
        if(!this.targetId) {
            var people = this.db.getPeopleIn(this.roomId, this.id);
            var realUsers = people.filter(function(p){return p.isPerson;});
            var target = core.selectRandom(realUsers);
            this.targetId = target && target.id;
        }

        if(this.targetId) {
            var target = this.db.getPerson(this.targetId, this.roomId);
            if(target) {
                this.cmd("say RAAAARGH!");
                this.cmd("attack " + this.targetId);
            }
            else
                this.targetId = null;
        }
        else{
            var exit = core.selectRandom(core.keys(rm.exits));
            if(exit)
                this.cmd(exit);
        }
    }
}

Aggressor.prototype.react_attack = function(m){
    this.targetId = m.payload[0];
}