class Load extends Phaser.Scene {

    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets");

        this.load.atlas("characters", "/Tilesheet/tilemap-characters-packed.png", "/Tilesheet/tilemap-characters-packed.json");

        this.load.image("tiles_ind", "/Tilesheet/platformerPack_industrial_tilesheet.png");
        this.load.image("tiles_basic", "/Tilesheet/tilemap_packed.png");
        this.load.image("tiles_mushroom", "/Tilesheet/Mushrooms.png");
        this.load.image("background_mushroom", "/Tilesheet/bg_shroom.png");

        this.load.tilemapTiledJSON("lvl1", "/Tilesheet/Lvl_one.tmj");
        this.load.tilemapTiledJSON("lvl2", "/Tilesheet/Lvl_two.tmj");

        this.load.spritesheet("tilemap_sheet", "/Tilesheet/tilemap_packed.png", {
            frameWidth: 70,
            frameheight: 70
        });
        
        this.load.multiatlas("kenny-particles", "/Image/kenny-particles.json");
        
    }

    create() {
        this.anims.create({
            key: 'walk',
            defaultTextureKey: "characters",
            frames: [
                {frame: "tile_0021.png"},
                {frame: "tile_0022.png"},
                {frame: "tile_0021.png"},
                {frame: "tile_0022.png"},
                {frame: "tile_0021.png"},
                {frame: "tile_0022.png"},
                {frame: "tile_0023.png"}
            ],
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "characters",
            frames: [
                { frame: "tile_0021.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "characters",
            frames: [
                { frame: "tile_0022.png" }
            ],
        });

        // Animating coins
        this.anims.create({
            key: 'coinAnim',
            frames: this.anims.generateFrameNumbers('tilemap_sheet',
                {start: 151, end: 152}
            ),
            frameRate: 2,
            repeat: -1
        });



        this.scene.start("Scene_One");
    }


    update() {}

}