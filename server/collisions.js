module.exports = {
    isCollision: function(collisionThreshold, collisionDistance) {
        if (!collisionThreshold || !collisionDistance){
            console.warn('isCollision: undefined')
        }
        return collisionThreshold > collisionDistance;
    },
    getCollisionOverlap: function(collisionThreshold, collisionDistance) {
        if (!collisionThreshold || !collisionDistance){
            console.warn('isCollision: undefined')
        }
        let overlap = 0;
        const isCollision = this.isCollision(collisionThreshold, collisionDistance);
        if (isCollision) {
            overlap = collisionThreshold - collisionDistance;
        }
        return overlap;
    }
}