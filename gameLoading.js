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
      default: "arcade",
    },
  };

  game = new Phaser.Game(gameConfig);
  window.focus();
  window.addEventListener("resize", resize, false);
  resize();
};

class gameLoading extends Phaser.Scene {
  constructor() {
    super("gameLoading");
    
    let currentWeather = "Default";
  }

  async create() {

    let position = await GetLocation();

    this.currentWeather = await GetWeather(position.coords.latitude, position.coords.longitude);

    console.log("current weather in loading: " + currentWeather);
    
    console.log(position);
    
    this.scene.launch("PlayGame", {
      lat: position.coords.latitude,
      long: position.coords.longitude,
      weather: this.currentWeather,
    });
  }
}

function GetLocation() {
  return new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(res, rej);
  });
}

function GetWeather(lat, long) {
  return new Promise((weather) => {
    console.log ("lat in weather: " + lat);
    console.log ("long in weather: " + long);
    fetch(
      "http://api.openweathermap.org/data/2.5/forecast?id=524901" +
      "&appid=" + config.WeatherKey +
      "&lat=" + lat +
      "&lon=" + long +
      "&units=imperial"
    )
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        this.currentWeather = data['list'][0]['weather'][0]['description'];
        console.log("current weather in function: " + currentWeather);

        weather(this.currentWeather);
      });
  });
}

function resize() {
  // Get the game canvas element and the browser window dimensions
  let canvas = game.canvas,
    width = window.innerWidth,
    height = window.innerHeight;
  //// Calculate the scale factor needed to maintain the game's aspect ratio
  let scaleFactor = Math.min(
    width / game.config.width,
    height / game.config.height
  );

  canvas.style.position = "absolute";

  // Set the canvas width and height based on the scale factor
  canvas.style.width = game.config.width * scaleFactor + "px";
  canvas.style.height = game.config.height * scaleFactor + "px";

  // Center the canvas horizontally within the browser window
  canvas.style.left = (width - game.config.width * scaleFactor) / 2 + "px";
  // Center the canvas vertically within the browser window
}
