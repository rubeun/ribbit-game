// CONSTANTS
const PLAYER_START_X = 200; 
const PLAYER_START_Y = 440;
const PLAYER_MOVE_INCREMENTS = 20;
const NUM_ENEMIES = 4;
const ENEMY_TOP_BOUNDARY = 50;
const ENEMY_BOTTOM_BOUNDARY = 300;
const ENEMY_MIN_SPEED = 50;
const ENEMY_MAX_SPEED = 150;

// UTILITIES
// Create a random number in between 2 numbers
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// ENEMY 
// Enemies our player must avoid
var Enemy = function(initialX, initialY, enemySpeed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // Enemy coordinates
    this.x = initialX;
    this.y = initialY;

    // Keeps track of players coords for collision detection
    this.playerX = 0;
    this.playerY = 0;

    // Enemy speed
    this.speed = enemySpeed;

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
    // If enemy moves off the width of the board, move it back to start
    if (this.x < 500) {
        this.x += (this.speed * dt);
    } else {
        this.x = -100;
    }

    // Collision handling
    let playerX = player.playerXCoord();
    let playerY = player.playerYCoord();
    //console.log("Enemy coords: " + this.x + ", " + this.y);
    //console.log("Player coords: " + playerX + ", " + playerY);
    if ((this.x > (playerX - 20)) && (this.x < (playerX + 20)) && ((this.y > (playerY - 20)) && (this.y < (playerY + 20)))) {
        console.log("Player Dies - Player coords: " + playerX + "," + playerY + " Enemy coords: " + this.x + "," + this.y);
        player.playerDies();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// PLAYER
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // Score
    this.wins = 0;
    this.deaths = 0;

    // Player coordinates
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;

    this.sprite = 'images/char-boy.png';

    this.playerXCoord = function() {
        return this.x;
    }
    this.playerYCoord = function() {
        return this.y;
    }

    this.playerDies = function() {
        this.x = PLAYER_START_X;
        this.y = PLAYER_START_Y;
    }
}

// Update player's location
Player.prototype.update = function(action) {

    // Player reaches water. Toggle win.
    if (this.y < 0) {
        // Player Wins!
        console.log("Player Wins!");
        // Reset to start
        this.x = PLAYER_START_X;
        this.y = PLAYER_START_Y; 
    }
}

// Render player on screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Handle keyboard directional input for player
Player.prototype.handleInput = function(direction) {

    switch(direction) {
        case 'up' :
            this.y -= PLAYER_MOVE_INCREMENTS;
            break;
        case 'down' :
            this.y += PLAYER_MOVE_INCREMENTS;
            break;
        case 'left' :
            this.x -= PLAYER_MOVE_INCREMENTS;
            break;
        case 'right' :
            this.x += PLAYER_MOVE_INCREMENTS;
            break;
        default:
            console.log("Input direction invalid: ", direction);
    }

}


// INIT
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let player = new Player();

let allEnemies = [];
let enemySpacing = 0;
let enemyStartY = ENEMY_TOP_BOUNDARY;

if (NUM_ENEMIES > 1) {
    enemySpacing = Math.floor((ENEMY_BOTTOM_BOUNDARY - ENEMY_TOP_BOUNDARY) / (NUM_ENEMIES - 1));
} 

for (let i = 0; i < NUM_ENEMIES; i++) {
    let enemySpeed = randomNum(ENEMY_MIN_SPEED, ENEMY_MAX_SPEED);
    let newEnemy = new Enemy(-100, enemyStartY, enemySpeed);
    allEnemies.push(newEnemy);
    enemyStartY += enemySpacing;
}


// EVENT LISTENERS
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
