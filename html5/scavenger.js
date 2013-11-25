function Scavenger(roomId, hp, items, equipment)
{
    AIBody.call(this, roomId, hp, items, equipment);
    this.moving = false;
}

Scavenger.prototype = Object.create(AIBody.prototype);

Scavenger.prototype.idleAction = function ()
{
    var rm = getRoom(this.roomId);
    var items = hashMap(rm.items, key);
    var exits = hashMap(rm.exits, key);
    if(!this.moving && items.length > 0)
    {
        this.take(selectRandom(items));
    }
    else
    {
        this.move(selectRandom(exits));
    }
    this.moving = !this.moving;
}
