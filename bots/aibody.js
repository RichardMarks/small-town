var Body = require("../body.js");
var core = require("../core.js");
var format = require("util").format;

//  AIBody class
//  All AI systems either run through
//  run through Reactions or Idle Actions. Reactions occur
//  immediately after a message is received. Idle Actions
//  occur on a set time frequency.
//      - parameters are the same as the Body class. AIBody is
//                          a subclass of Body
function AIBody(db, roomId, hp, items, equipment, id) {
    Body.call(this, db, id, roomId, hp, items, equipment);
    this.startHP = hp;
    this.dt = Math.floor(Math.random() * 5) * 200 + 5000;
    this.lastTime = Date.now();
    this.targetId = null;
    this.socket = this;
    this.isPerson = false;
}

AIBody.prototype = Object.create(Body.prototype);
module.exports = AIBody;

AIBody.prototype.saveDirectory = function(){
    return "npcs";
};

// occurs as quickly as possible. Allows the AI unit
// to react to actions against it immediately, and
// take actions when it is time to.
//
// The update function only generates commands and
// adds them to the character's input queue. There
// after, the rest of the game logic for characters
// takes over, making AI characters only able to
// interact with the world in the same way that users
// do. However, AI characters can see everything
// in the game.
AIBody.prototype.update = function () {
    this.dumpMessageQueue();
    this.generateCommand();
    this.dumpInputQueue();
};

AIBody.prototype.generateCommand = function(){
    var now = Date.now();
    if ((now - this.lastTime) >= this.dt) {
        if (this.hp > 0)
            this.idleAction();
        this.lastTime = now;
    }
};

// simplifies adding commands to the command queue.
// - parameters are the same as for format(template, [args...])
AIBody.prototype.cmd = function (msg) {
    core.test(">>>> AICMD", this.id, msg);
    this.inputQ.push(msg);
};

AIBody.prototype.idleAction = function () {
    var rm = this.db.rooms[this.roomId];
    var exit = core.selectRandom(rm.exits);
    if (exit)
        this.cmd(exit.description);
}

// checks to see if there is a reaction registered
// for the message type, then fires the reaction
AIBody.prototype.react = function (m) {
    var handler = "react_" + m.message;
    if (this[handler]){
        core.test(">>>> REACT", this.id, handler, m);
        this[handler](m);
    }
}

AIBody.prototype.react_damage = function (m) {
    this.cmd(format("yell Ouch! Stop it, %s!", m.fromId));
}

AIBody.prototype.react_attack = function (m) {
    this.cmd(format("say Whoa, settle down, %s!", m.fromId));
}

// A friendly greeting!
AIBody.prototype.react_say = function (m) {
    if (m.payload[0] == "hello")
        this.cmd("say Hi!");
}

AIBody.prototype.react_msg = function (m) {
    this.cmd(format("msg %s I heard you say \"%s\"", m.fromId, m.payload[0]));
};

AIBody.prototype.react_yell = function (m) {
    if (!(this.db.users[m.fromId] instanceof AIBody))
        this.cmd("yell SHADDAP!");
}
