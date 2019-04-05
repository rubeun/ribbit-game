'use strict';

// ### CONSTANTS ###
const PLAYER_START_X = 200; 
const PLAYER_START_Y = 440;
const PLAYER_MOVE_INCREMENTS = 20;
const PLAYER_SPRITE_SIZE = 60;
const NUM_ENEMIES = 4;
const ENEMY_TOP_BOUNDARY = 50;
const ENEMY_BOTTOM_BOUNDARY = 300;
const ENEMY_MIN_SPEED = 50;
const ENEMY_MAX_SPEED = 150;

const DOM_PLAYER_SCORE_WINS = document.querySelector('#player-wins');
const DOM_PLAYER_SCORE_DEATHS = document.querySelector('#player-deaths');
const DOM_GAME_MESSAGE = document.querySelector('#game-message');

// ### UTILITIES ###
// Create a random number in between 2 numbers
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Sound FX Utility. Plays various game sounds.
// Sound FX downloaded from http://www.classicgaming.cc/classics/frogger/sounds
function playSound(sound) {
    const soundURLs = {
      "jump": "./sounds/sound-frogger-hop.wav",
      "win" : "./sounds/sound-frogger-plunk.wav",
      "die" : "./sounds/sound-frogger-squash.wav"
    };
    var newSound = document.createElement("audio");
    newSound.src = soundURLs[sound];
    newSound.id = "soundfx-" + sound;    
    newSound.volume =.1;
    newSound.play();
  }

// ### ENEMY ### 
// Enemies our player must avoid
var Enemy = function(initialX, initialY, enemySpeed) {

    // Enemy coordinates
    this.x = initialX;
    this.y = initialY;

    // Enemy speed
    this.speed = enemySpeed;

    // Enemy sprite
    this.sprite = 'images/enemy-bug.png';

};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // If enemy moves off the width of the board, move it back to start
    if (this.x < 500) {
        this.x += (this.speed * dt);
    } else {
        this.x = -100;
    }

    // Collision handling taking into account player edges  
    if ((this.x > player.playerLeftEdge()) && (this.x < player.playerRightEdge()) 
        && ((this.y > player.playerTopEdge()) && (this.y < player.playerBottomEdge()))) {
        //console.log("Player Dies - Player coords: " + playerX + "," + playerY + " Enemy coords: " + this.x + "," + this.y);
        player.playerDies();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// ### PLAYER ###
// Player controlled avatar. 
var Player = function() {
    // Score
    this.wins = 0;
    this.deaths = 0;

    // Player initial coordinates
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;

    // Player sprite
    this.sprite = 'images/char-boy.png';

    // Player sprite edge coordinates for collision detection
    this.playerLeftEdge = function() {
        return this.x - PLAYER_SPRITE_SIZE;
    }
    this.playerRightEdge = function() {
        return this.x + PLAYER_SPRITE_SIZE;
    }
    this.playerTopEdge = function() {
        return this.y - PLAYER_SPRITE_SIZE;
    }
    this.playerBottomEdge = function() {
        return this.y + PLAYER_SPRITE_SIZE;
    }

    // Resets the player to starting position
    this.playerResetPosition = function() {
        this.x = PLAYER_START_X;  
        this.y = PLAYER_START_Y;
    }

    // Player Wins
    this.playerWins = function() {
        this.wins += 1;
        playSound("win");
        this.playerResetPosition();
        DOM_GAME_MESSAGE.textContent = "#### YOU WON! ####";
        DOM_PLAYER_SCORE_WINS.classList.add('score-update');
        setTimeout(function(){
            DOM_GAME_MESSAGE.textContent = "Get to the Water!"
            DOM_PLAYER_SCORE_WINS.classList.remove('score-update');
        }, 2000);
        DOM_PLAYER_SCORE_WINS.textContent = this.wins;
    }

    // Player Dies
    this.playerDies = function() {
        this.deaths += 1;
        playSound("die");
        this.playerResetPosition();
        DOM_GAME_MESSAGE.textContent = "#### YOU DIED! ####";
        DOM_PLAYER_SCORE_DEATHS.classList.add('score-update');
        setTimeout(function(){
            DOM_GAME_MESSAGE.textContent = "Get to the Water!"
            DOM_PLAYER_SCORE_DEATHS.classList.remove('score-update');
        }, 2000);
        DOM_PLAYER_SCORE_DEATHS.textContent = this.deaths;
    }
}

// Update player's location
Player.prototype.update = function(action) {

    // If player reaches water, player wins. Also keeps player within game board.
    if (this.y < 0) {
        // Player Wins!
        this.playerWins();
    } else if (this.y > PLAYER_START_Y) {
        this.y = PLAYER_START_Y;
    } else if (this.x < 0) {
        this.x = -10;
    } else if (this.x > 400) {
        this.x = 410;
    }
}

// Render player on screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Handle keyboard directional input for player
Player.prototype.handleInput = function(direction) {
    playSound("jump");
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

// ### INIT ###
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let player = new Player();

let allEnemies = [];
let enemySpacing = 0;
let enemyStartY = ENEMY_TOP_BOUNDARY;

// Calculate enemy spacing between enemies (assuming more than 1 enemy)
if (NUM_ENEMIES > 1) {
    enemySpacing = Math.floor((ENEMY_BOTTOM_BOUNDARY - ENEMY_TOP_BOUNDARY) / (NUM_ENEMIES - 1));
} 

for (let i = 0; i < NUM_ENEMIES; i++) {
    let enemySpeed = randomNum(ENEMY_MIN_SPEED, ENEMY_MAX_SPEED);
    let newEnemy = new Enemy(-100, enemyStartY, enemySpeed); // start enemies off screen by setting x to -100
    allEnemies.push(newEnemy);
    enemyStartY += enemySpacing; 
}


// ### EVENT LISTENERS ###
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
