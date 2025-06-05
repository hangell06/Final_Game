class end_screen extends Phaser.Scene {
    constructor() {
        super("ending");
    }

    preload() {
        this.load.image("end_screen", "./assets/Image/end_screen.png");
        this.load.audio("victory_music", "./assets/Audio/Win_Music.mp3");
    }

    create() {
        this.add.sprite(game.config.width/2, game.config.height/2, "end_screen").setScale(3);
        document.getElementById('description').innerHTML = '<h2>You win!</h2>Click R to restart!';
        this.rKey = this.input.keyboard.addKey('R');

        this.music = this.sound.add("victory_music", {
            volume: 0.25,
            loop: true
        });
        this.music.play();
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(this.rKey)){
            this.music.pause();
            this.scene.start("Scene");
        }
    }






}