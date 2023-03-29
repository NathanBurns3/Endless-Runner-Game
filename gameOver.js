class gameOver extends Phaser.Scene {
    constructor() {
        super("gameOver");
    }

    create(data) {
        // Create a semi-transparent black background
        let background = this.add.rectangle(0, 0, game.config.width, game.config.height, 0x000000);
        background.setOrigin(0, 0);
        background.alpha = 0.7;

        // Display score and high score
        let scoreText = this.add.text(game.config.width / 2, game.config.height / 2 - 80, "Score: " + data.score, {
            font: "32px Arial",
            fill: "#ffffff"
        }).setOrigin(0.5);

        let highScoreText = this.add.text(game.config.width / 2, game.config.height / 2 - 30, "High Score: " + data.highScore, {
            font: "32px Arial",
            fill: "#ffffff"
        }).setOrigin(0.5);

        // Display "Game Over" text
        let gameOverText = this.add.text(game.config.width / 2, game.config.height / 2 - 150, "Game Over", {
            font: "48px Arial",
            fill: "#ffffff"
        }).setOrigin(0.5);

        // Add a "Play Again" button
        let playAgainButton = this.add.rectangle(game.config.width / 2, game.config.height / 2 + 50, 200, 50, 0xffffff);
        playAgainButton.setOrigin(0.5);
        playAgainButton.setInteractive();

        let playAgainText = this.add.text(game.config.width / 2, game.config.height / 2 + 50, "Play Again", {
            font: "24px Arial",
            fill: "#000000"
        }).setOrigin(0.5);

        // Restart the game when the button is clicked
        playAgainButton.on("pointerdown", () => {
            // Stop and remove the game over overlay
            this.scene.stop();

            // Restart the PlayGame scene
            this.scene.get("PlayGame").scene.restart();
        });
    }
}