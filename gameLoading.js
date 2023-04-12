// Initialize game variable
let game;

// Configure game settings and start the game
window.onload = function () {
    let gameConfig = {
        type: Phaser.AUTO,
        width: 1334,
        height: 750,
        scene: [gameLoading, playGame, gameOver],
        backgroundColor: 0x444444,
        physics: {
            default: "arcade"
        }
    };

    game = new Phaser.Game(gameConfig);
    window.focus();
    window.addEventListener("resize", resize, false);
    resize();
};

class gameLoading extends Phaser.Scene {
    constructor() {
        super("gameLoading");
    }

    create() {     
        //variables to pass
        let lat = 0;
        let long = 0;
        let currentWeather = "Default";

        // Gets user's coordinates through the HTML Geolocation API
        function getLocation() {
            return new Promise((resolve, reject) => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(setPosition);
                }
                else {
                    reject("Geolocation is not supported by this browser.");
                }
            });
        }
        
        // sets the coordinate variables
        function setPosition(position) {
            lat = position.coords.latitude;
            console.log("player lat in loading: " + lat);
            long = position.coords.longitude;
            console.log("player long in loading: " + long);
            fetch(
                "http://api.openweathermap.org/data/2.5/forecast?id=524901" +
                "&appid=9589b014fb33bd1e3c54c18685a0497a" +
                "&lat=" + lat +
                "&lon=" + long +
                "&units=imperial"
            )
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                currentWeather = data['list'][0]['weather'][0]['description'];
                console.log("current weather in loading: " + currentWeather);
            });
        }

        // Create a semi-transparent black background
        let background = this.add.rectangle(0, 0, game.config.width, game.config.height, 0x000000);
        background.setOrigin(0, 0);

        // Add a "Play Again" button
        let startButton = this.add.rectangle(game.config.width / 2, game.config.height / 2 + 50, 200, 50, 0xffffff);
        startButton.setOrigin(0.5);
        startButton.setInteractive();

        let playAgainText = this.add.text(game.config.width / 2, game.config.height / 2 + 50, "Start", {
            font: "24px Arial",
            fill: "#000000"
        }).setOrigin(0.5);

        getLocation();

        // Start the game when the button is clicked
        startButton.on("pointerdown", () => {

            // Stop and remove the game over overlay
            this.scene.stop();

            // launch the PlayGame scene
            this.scene.launch("PlayGame", {
                lat: lat,
                long: long,
                weather: currentWeather
            });
        });
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
}