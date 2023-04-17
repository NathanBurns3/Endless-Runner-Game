// global game options
let gameOptions = {
    platformStartSpeed: 500,
    spawnRange: [100, 500],
    platformSizeRange: [275, 425],
    playerGravity: 1000,
    jumpForce: 500,
    playerStartPosition: 200,
    jumps: 1,
    backgroundSpeed: 5,
    score: 0,
    highScore: 0,
    backgroundChoice: "",
    playerLatitude: 0,
    playerLongitude: 0,
    playerWeather: "",
    platformSpeedIncrease: 0.025,
    maxPlatformSpeed: 1200,
    scoreModifier: 1,
    fastFallForce: 1000,
    spaceReleased: true
};

// 2D array to hold backgrounds
let backgrounds = [
    ["Beach/Beach1.png", "Beach/Beach2.png", "Beach/Beach3.png", "Beach/Beach4.png"],
    ["City/City1.png", "City/City2.png", "City/City3.png", "City/City4.png"],
    ["Desert/Desert1.png", "Desert/Desert2.png", "Desert/Desert3.png", "Desert/Desert4.png"],
    ["Forest/Forest1.png", "Forest/Forest2.png", "Forest/Forest3.png", "Forest/Forest4.png"],
    ["Mountain/Mountain1.png", "Mountain/Mountain2.png", "Mountain/Mountain3.png", "Mountain/Mountain4.png"],
    ["Farm/Farm1.png", "Farm/Farm2.png", "Farm/Farm3.png", "Farm/Farm4.png"]
];

let cityCoordinates = [
    //latitude range, longitude range
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
        if (latitude >= cityCoordinates[i][0] && latitude <= cityCoordinates[i][1] && longitude <= cityCoordinates[i][2] && longitude >= cityCoordinates[i][3]) {
            // set the background to a random background in the cities image array
            backgroundChoice = "Backgrounds/" + backgrounds[1][Math.floor(Math.random() * 4)];
            console.log("The function chose: " + backgroundChoice + " as the background");
            return;
        }
    }
    // Beach area (Coasts)
    if (
        // California coast
        (39 < latitude && latitude < 42 && longitude < -124) ||
        (36 < latitude && latitude < 39 && longitude < -122) ||
        (39 < latitude && latitude < 42 && longitude < -118) ||
        // Texas/Louisiana/Florida/Alaama/Mississippi coast
        (26 < latitude && latitude < 29 && -97 < longitude) ||
        (29 < latitude && latitude < 30.5 && -95 < longitude) ||
        // Georgia/Carolina's/Virginia's/Delaware/Maryland coast
        (30.5 < latitude && latitude < 32.5 && -81.5 < longitude) ||
        (32.5 < latitude && latitude < 33 && -81 < longitude) ||
        (33 < latitude && latitude < 34 && -80 < longitude) ||
        (34 < latitude && latitude < 35 && -78.5 < longitude) ||
        (35 < latitude && latitude < 39.75 && -77 < longitude)
        ) {
            // set the background to a random background in the Beaches image array
            backgroundChoice = "Backgrounds/" + backgrounds[0][Math.floor(Math.random() * 4)];
            console.log("The function chose: " + backgroundChoice + " as the background");
            return;
    }
    // Desert Area (Southwest)
    else if (
        // California/Nevada/Utah/Arizona
        (latitude < 42 && -125 < longitude && longitude < -109) ||
        // Texas/New Mexico/Oklahoma
        (latitude < 37 && -109 < longitude && longitude < -95)
        ) {
            // set the background to a random background in the Desert image array
            backgroundChoice = "Backgrounds/" + backgrounds[2][Math.floor(Math.random() * 4)];
            console.log("The function chose: " + backgroundChoice + " as the background");
            return;
    }
    // Mountain Area (Mountain Time + Dakotas)
    else if (
        (50 < latitude && latitude < 43 && longitude < -97) ||
        (43 < latitude && latitude < 30 && longitude < -103)
        ) {
            // set the background to a random background in the Mountain image array
            backgroundChoice = "Backgrounds/" + backgrounds[4][Math.floor(Math.random() * 4)];
            console.log("The function chose: " + backgroundChoice + " as the background");
            return;
    }
    // Forest Area (Northern areas)
    else if (
        (43 < latitude && longitude > -97)
    ) {
        backgroundChoice = "Backgrounds/" + backgrounds[3][Math.floor(Math.random() * 4)];
        console.log("The function chose: " + backgroundChoice + " as the background");
        return;
    }
    // Farm Area (Default)
    else {
        backgroundChoice = "Backgrounds/" + backgrounds[5][Math.floor(Math.random() * 4)];
        console.log("The function chose: " + backgroundChoice + " as the background");
        return;
    }
}

// Create the main playGame scene class
class playGame extends Phaser.Scene {

    constructor() {
        super("PlayGame");
    }

    init(data) {
        console.log(data);
        this.playerLatitude = data.lat;
        this.playerLongitude = data.long;
        this.playerWeather = data.weather;

        gameOptions.playerLatitude = this.playerLatitude;
        gameOptions.playerLongitude = this.playerLongitude;
        gameOptions.playerWeather = this.playerWeather;

        console.log("gameOptions lat: " + gameOptions.playerLatitude);
        console.log("gameOptions long: " + gameOptions.playerLongitude);
        console.log("gameOptions weather: " + gameOptions.playerWeather);
    }

    // Load assets required for the game
    preload() {  
        pickBackground(gameOptions.playerLatitude, gameOptions.playerLongitude);
        this.load.image("background", backgroundChoice);
        this.load.image("platform", "Sprites/road.png");
        this.load.image("player", "Sprites/player.png"); 

        this.load.image("cloud1", "WeatherIMG/Cloud1.png");
        this.load.image("cloud2", "WeatherIMG/Cloud2.png");
        this.load.image("cloud3", "WeatherIMG/Cloud3.png");

        this.load.image("snow", "WeatherIMG/snow.png");

        this.load.image("raindrop", "WeatherIMG/raindrop.png");

        this.load.image("thunder", "WeatherIMG/Thunder.png");
    }
    // Set up the game objects and initial state
    create() {
        // Create the background image and set its properties
        this.add.image(0, 0, "background").setOrigin(0);
        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "background");
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(0);
        this.background.setDepth(-1);

        // Add weather
        // cloudy
        if (gameOptions.playerWeather == "few clouds" || gameOptions.playerWeather == "scattered clouds" || gameOptions.playerWeather == "broken clouds") {
            console.log("The function is going to perform: " + gameOptions.playerWeather);
    
            this.add.image(150, 175, "cloud1").setScale(.25);
            this.add.image(500, 75, "cloud2").setScale(.25);
            this.add.image(750, 150, "cloud3").setScale(.25);
        }
        // raining
        else if (gameOptions.playerWeather == "shower rain" || gameOptions.playerWeather == "rain" || gameOptions.playerWeather == "mist" || gameOptions.playerWeather == "light rain") {
            
            const particles = this.add.particles("raindrop").setScale(.25)
		    particles.createEmitter({
                x: 0,
                y: 450,
                // emitZone
                emitZone: {
                    source: new Phaser.Geom.Rectangle(-game.config.width * 3, 0, game.config.width * 7, 100),
                    type: 'random',
                    quantity: 70
                },
                speedY: { min: 750, max: 800 },
                speedX: { min: -20, max: 20 },
                accelerationY: { random: [10, 15] },
                // lifespan
                lifespan: { min: 8000, max: 10000 },
                scale: { random: [0.25, 0.75] },
                alpha: { random: [0.1, 0.8] },
                gravityY: 10,
                frequency: 10,
                // follow the player at an offiset
                follow: this.player, 
                followOffset: { x: -game.config.width * 0.5, y: -game.config.height - 100 }
		    })

            this.add.image(150, 175, "cloud1").setScale(.25);
            this.add.image(500, 75, "cloud2").setScale(.25);
            this.add.image(750, 150, "cloud3").setScale(.25);
        }
        // thunderstorms
        else if (gameOptions.playerWeather == "thunderstorm") {
            
            const thunderParticles = this.add.particles("thunder").setScale(.75)
            thunderParticles.createEmitter({
                x: 0,
                y: 200,
                // emitZone
                emitZone: {
                    source: new Phaser.Geom.Rectangle(-game.config.width * 3, 0, game.config.width * 7, 100),
                    type: 'random',
                    quantity: 10000
                },
                speedX: { min: -20, max: 20 },
                accelerationY: { random: [10, 15] },
                // lifespan
                lifespan: { min: 300, max: 500 },
                scale: { random: [0.25, 0.75] },
                alpha: { random: [0.1, 0.8] },
                gravityY: 10,
                frequency: 0,
                count: 1
            })

            const particles = this.add.particles("raindrop").setScale(.25)
		    particles.createEmitter({
                x: 0,
                y: 450,
                // emitZone
                emitZone: {
                    source: new Phaser.Geom.Rectangle(-game.config.width * 3, 0, game.config.width * 7, 100),
                    type: 'random',
                    quantity: 10
                },
                speedY: { min: 750, max: 800 },
                speedX: { min: -20, max: 20 },
                accelerationY: { random: [10, 15] },
                // lifespan
                lifespan: { min: 8000, max: 10000 },
                scale: { random: [0.25, 0.75] },
                alpha: { random: [0.1, 0.8] },
                gravityY: 10,
                frequency: 10,
                // follow the player at an offiset
                follow: this.player, 
                followOffset: { x: -game.config.width * 0.5, y: -game.config.height - 100 }
		    })
            
            this.add.image(150, 75, "cloud1").setScale(.3).setTint(0x305173);
            this.add.image(500, 50, "cloud2").setScale(.3).setTint(0x305173);
            this.add.image(750, 120, "cloud3").setScale(.3).setTint(0x305173);
        }
        // snow
        else if (gameOptions.playerWeather == "snow") {
            const particles = this.add.particles("snow")
		    particles.createEmitter({
                x: 0,
                y: 450,
                // emitZone
                emitZone: {
                    source: new Phaser.Geom.Rectangle(-game.config.width * 3, 0, game.config.width * 7, 100),
                    type: 'random',
                    quantity: 70
                },
                speedY: { min: 50, max: 70 },
                speedX: { min: -20, max: 20 },
                accelerationY: { random: [10, 15] },
                // lifespan
                lifespan: { min: 8000, max: 10000 },
                scale: { random: [0.25, 0.75] },
                alpha: { random: [0.1, 0.8] },
                gravityY: 10,
                frequency: 10,
                blendMode: 'ADD',
                // follow the player at an offiset
                follow: this.player, 
                followOffset: { x: -game.config.width * 0.5, y: -game.config.height - 100 }
		    })

            this.add.image(150, 175, "cloud1").setScale(.25);
            this.add.image(500, 75, "cloud2").setScale(.25);
            this.add.image(750, 150, "cloud3").setScale(.25);
        }

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
        // Listen for spacebar key release
        this.input.keyboard.on("keyup-SPACE", () => {
            gameOptions.spaceReleased = true;
        }, this);
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
            this.platformGroup.add(platform);
        }

        // Calculate the current platform speed based on the score
        let currentPlatformSpeed = Math.min(gameOptions.platformStartSpeed + gameOptions.score * gameOptions.platformSpeedIncrease, gameOptions.maxPlatformSpeed);

        // Update the score modifier based on the current platform speed
        gameOptions.scoreModifier = 1 + (currentPlatformSpeed - gameOptions.platformStartSpeed) / (gameOptions.maxPlatformSpeed - gameOptions.platformStartSpeed);

        // Set the platform's width and calculate the distance to the next platform
        platform.setVelocityX(currentPlatformSpeed * -1);
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
            gameOptions.spaceReleased = false;
        }
        // Check if the player is in the air and the fast fall has not been initiated yet
        else if (!this.player.body.touching.down && gameOptions.spaceReleased) {
            // Apply downward force to simulate a fast fall
            this.player.setVelocityY(gameOptions.fastFallForce);
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
        gameOptions.score += gameOptions.scoreModifier;
        this.scoreText.setText("Score: " + Math.floor(gameOptions.score));
        this.highScoreText.setText("High Score: " + Math.floor(gameOptions.highScore));

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