// Initialize game variable
let game;

// global game options
let gameOptions = {
    platformStartSpeed: 500,
    spawnRange: [100, 350],
    platformSizeRange: [300, 500],
    playerGravity: 1000,
    jumpForce: 500,
    playerStartPosition: 200,
    jumps: 1,
    backgroundSpeed: 5,
    score: 0,
    highScore: 0,
    backgroundChoice: "",
    playerLatitude: 0,
    playerLongitude: 0
};

// 2D array to hold backgrounds
let backgrounds = [
    ["Beach1.png", "Beach2.png", "Beach3.png", "Beach4.png"],
    ["City1.png", "City2.png", "City3.png", "City4.png"],
    ["Desert1.png", "Desert2.png", "Desert3.png", "Desert4.png"],
    ["Forest1.png", "Forest2.png", "Forest3.png", "Forest4.png"],
    ["Mountain1.png", "Mountain2.png", "Mountain3.png", "Mountain4.png"],
    ["Farm1.png", "Farm2.png", "Farm3.png", "Farm4.png", ]
];

let cityCoordinates = [
    //latitudes, longitudes
    //New York
    [40,41.5,-73.5,-74.5],
    //LA and San Diego
    [32,35,-116,-120],
    //Chicago
    [41.25,42.5,-87,-89],
    //Houston
    [28.5,30.5,-94.5,-96],
    //Philadelphia
    [39.5,40.5,-74.5,-75.5],
    //Dallas
    [32,33.5,-95,-98],
    //Phoenix
    [32.5,34,-110,-113],
    //Cincinnati
    [38.75,39.25,-84,-85],
    //Columbus
    [39.5,40.5,-82.25,-83.75],
    //San Francisco
    [36.5,39,-120,-124]
]

// function to pick the background
function pickBackground(latitude, longitude) {
    // City Area (Small pinpoints)
    for (let i = 0; i < cityCoordinates.length; i++){
            // latitude is greater than cities most south latitude, less than most north latitude.
            // Longitude is greater than cities most west Longitude, less than most east Longitude.
        if (latitude >= cityCoordinates[i][0] && latitude <= cityCoordinates[i][1] && longitude >= cityCoordinates[i][2] && longitude <= cityCoordinates[i][3]) {
            // set the background to a random background in the cities image array
            backgroundChoice = backgrounds[1][Math.floor(Math.random() * 4)];
            return;
        }
    }
    // Beach area (Coasts)
    if (false) {

    }
    // Desert Area (Southwest)
    // Forest Area (Northern areas)
    // Mountain Area (Mountain Time)
    // Farm Area (Default)
    else {
        backgroundChoice = backgrounds[5][Math.floor(Math.random() * 4)];
        return;
    }
}

// Configure game settings and start the game
window.onload = function () {
    let gameConfig = {
        type: Phaser.AUTO,
        width: 1334,
        height: 750,
        scene: [playGame, gameOver],
        backgroundColor: 0x444444,
        physics: {
            default: "arcade"
        }
    };

    // Gets user's coordinates through the HTML Geolocation API
    const successCallback = (position) => {
        // Successful: prints coordinates to console
        console.log(position);
    };
    const errorCallback = (error) => {
        // Fails: prints error message to console
        console.log(error);
    };
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    playerLatitude = position.coords.latitude;
    playerLongitude = position.coords.longitude;

    game = new Phaser.Game(gameConfig);
    window.focus();
    // * Doesn't like resize
    window.addEventListener("resize", resize, false);
    resize();
};

// Create the main playGame scene class
class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    // Load assets required for the game
    preload() {
        this.load.image("platform", "Sprites/platform.png");
        this.load.image("player", "Sprites/player.png");
        //pickBackground(playerLatitude, playerLongitude);
        //this.load.image("background", backgroundChoice);
        this.load.image("background", "Test.png");
    }
    // Set up the game objects and initial state
    create() {
        // Set the initial score to 0
        gameOptions.score = 0;

        // Create the score text and high score text
        this.scoreText = this.add.text(10, 10, "Score: " + gameOptions.score, { font: "24px Arial", fill: "#ffffff" });
        this.highScoreText = this.add.text(10, 40, "High Score: " + gameOptions.highScore, { font: "24px Arial", fill: "#ffffff" });

        // Create platform group and configure its callback
        this.platformGroup = this.add.group({
            removeCallback: function (platform) {
                platform.scene.platformPool.add(platform);
            }
        });
        // Create platform pool and configure its callback
        this.platformPool = this.add.group({
            removeCallback: function (platform) {
                platform.scene.platformGroup.add(platform);
            }
        });

        // Create the background image and set its properties
        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "background");
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(0);
        this.background.setDepth(-1);

        // Initialize the player's jump count
        this.playerJumps = 0;

        // Add the first platform to the game
        this.addPlatform(game.config.width, game.config.width / 2);

        // Add the player to the game and set its gravity
        this.player = this.physics.add.sprite(gameOptions.playerStartPosition, game.config.height / 2, "player");
        this.player.setGravityY(gameOptions.playerGravity);

        // Set up collision detection between the player and the platforms
        this.physics.add.collider(this.player, this.platformGroup);

        // Listen for spacebar input to trigger the jump action
        this.input.keyboard.on("keydown-SPACE", this.jump, this);
        //prevent spacebar from scrolling the page
        this.input.keyboard.addCapture("SPACE");
    }

    // Function to add new platforms to the game
    addPlatform(platformWidth, posX) {
        let platform;
        // Reuse a platform from the pool if available
        if (this.platformPool.getLength()) {
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.active = true;
            platform.visible = true;
            this.platformPool.remove(platform);
        }
        // Otherwise, create a new platform
        else {
            platform = this.physics.add.sprite(posX, game.config.height * 0.8, "platform");
            platform.setImmovable(true);
            platform.setVelocityX(gameOptions.platformStartSpeed * -1);
            this.platformGroup.add(platform);
        }
        // Set the platform's width and calculate the distance to the next platform
        platform.displayWidth = platformWidth;
        this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);
    }

    // Function to handle the player's jump action
    jump() {
        // Check if the player is on the ground or has remaining jumps available
        if (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps)) {
            // Reset jump count if the player is on the ground
            if (this.player.body.touching.down) {
                this.playerJumps = 0;
            }
            // Apply upward velocity to the player for the jump
            this.player.setVelocityY(gameOptions.jumpForce * -1);
            // Increment the jump count
            this.playerJumps++;
        }
    }

    // The main update loop for the game
    update() {
        // Restart the scene if the player falls off the screen
        if (this.player.y > game.config.height) {
            // Update the high score if necessary
            if (gameOptions.score > gameOptions.highScore) {
                gameOptions.highScore = gameOptions.score;
            }

            this.scene.pause();
            //Show game over overlay
            this.scene.launch("gameOver", {
                score: gameOptions.score,
                highScore: gameOptions.highScore
            });
        }

        // Have the background move
        this.background.tilePositionX += gameOptions.backgroundSpeed;

        // Keep the player at a fixed horizontal position
        this.player.x = gameOptions.playerStartPosition;

        //Update the score
        gameOptions.score += 1;
        this.scoreText.setText("Score: " + gameOptions.score);
        this.highScoreText.setText("High Score: " + gameOptions.highScore);

        // Calculate the minimum distance between the current platform and the right edge of the screen
        let minDistance = game.config.width;
        this.platformGroup.getChildren().forEach(function (platform) {
            let platformDistance = game.config.width - platform.x - platform.displayWidth / 2;
            minDistance = Math.min(minDistance, platformDistance);
            // Remove the platform if it's no longer visible on the screen
            if (platform.x < -platform.displayWidth / 2) {
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
            }
        }, this);

        // If the minimum distance is greater than the next platform distance, add a new platform
        if (minDistance > this.nextPlatformDistance) {
            var nextPlatformWidth = Phaser.Math.Between(gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1]);
            this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2);
        }
    }
}

function resize() {
    // Get the game canvas element and the browser window dimensions
    let canvas = game.canvas, width = window.innerWidth, height = window.innerHeight;
    //// Calculate the scale factor needed to maintain the game's aspect ratio
    let scaleFactor = Math.min(width / game.config.width, height / game.config.height);

    canvas.style.position = 'absolute';

    // Set the canvas width and height based on the scale factor
    canvas.style.width = (game.config.width * scaleFactor) + 'px';
    canvas.style.height = (game.config.height * scaleFactor) + 'px';

    // Center the canvas horizontally within the browser window
    canvas.style.left = (width - game.config.width * scaleFactor) / 2 + 'px';
    // Center the canvas vertically within the browser window
    canvas.style.top = (height - game.config.height * scaleFactor) / 2 + 'px';
}
