// Constants
const PLAYER_START_X = 200; 
const PLAYER_START_Y = 400;
const PLAYER_MOVE_INCREMENTS = 10;
const NUM_ENEMIES = 4;
const ENEMY_TOP_BOUNDARY = 0;
const ENEMY_BOTTOM_BOUNDARY = 150;

// Enemies our player must avoid
var Enemy = function(initialX, initialY) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // Enemy coordinates
    this.x = initialX;
    this.y = initialY;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {

    // Player coordinates
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;

    this.sprite = 'images/char-boy.png';
}

Player.prototype.update = function(action) {
    switch(action) {
        case 'moveUp' :  
            this.y -= PLAYER_MOVE_INCREMENTS;
            break;
        case 'moveDown' :  
            this.y += PLAYER_MOVE_INCREMENTS;
            break;
        case 'moveLeft' :  
            this.x -= PLAYER_MOVE_INCREMENTS;
            break;
        case 'moveRight' :  
            this.x += PLAYER_MOVE_INCREMENTS;
            break;

        case 'reset' :
            this.x = PLAYER_START_X;
            this.y = PLAYER_START_Y; 
            break;
        default:
            console.log("Invalid action:", action);
    }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(direction) {

    switch(direction) {
        case 'up' :
            player.update('moveUp');
            break;
        case 'down' :
            player.update('moveDown');
            break;
        case 'left' :
            player.update('moveLeft');
            break;
        case 'right' :
            player.update('moveRight');
            break;
        default:
            console.log("Input direction invalid: ", direction);
    }

}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [];
for (let i = 0; i < NUM_ENEMIES; i++) {
    allEnemies.push(new Enemy(0, 100));
}

let player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
