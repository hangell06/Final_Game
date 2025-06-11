class first_level extends Phaser.Scene {

    constructor() {
        super("Scene_One");
    }

    init() {
        // Physics
        this.ACCELERATION = 500;
        this.DRAG = 1250;
        this.physics.world.gravity.y = 1500;

            // Velocity
        this.JUMP_VELOCITY = -800;
        this.MAX_VEL_X = 400;
        this.MAX_VEL_Y = 1000;

        // Particles
        this.PARTICLE_X_OFFSET = 16;
        this.PARTICLE_Y_OFFSET = 5;
        this.PARTICLE_VELOCITY = 50;
        this.PARTICLE_JUMP_TIME = 200;
        

        // Scale
        this.PLAYER_SCALE = 2;
        this.SCALE = 0.75

        // Map information
        this.TILE_SIZE = 70;
        this.TILE_WIDTH = 100;
        this.TILE_HEIGHT = 20;

        this.ADJUSTED_TILE_WIDTH = this.TILE_SIZE * this.TILE_WIDTH * this.SCALE;
        this.ADJUSTED_TILE_HEIGHT = this.TILE_SIZE * this.TILE_HEIGHT * this.SCALE;

        this.BIAS = 26

        // Camera
        this.DEADZONE = 50;
        this.XLERP = 0.25; 
        this.YLERP = 0.05;

        // Starting Position
        this.STARTING_X = 230;
        this.STARTING_Y = 705;

        // Wall jump factor
        this.WALL_JUMP_HORZ = 400;


    }

    preload() {
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
        
        // Loading Audio
        this.load.setPath("./assets/Audio/");
        this.load.audio("main_music", "Stage_Music.mp3");
        this.load.audio("coin_sound", "Coin_SFX.wav");
        this.load.audio("jump_sound", "Jump_SFX.wav");
    }

    create() {

        //
        // MAP
        //
        
        this.map = this.add.tilemap("lvl1", this.TILE_SIZE, this.TILE_SIZE, this.TILE_WIDTH, this.TILE_HEIGHT);
        this.animatedTiles.init(this.map);

        // Physics
        this.physics.world.setBounds(0, 0, this.ADJUSTED_TILE_WIDTH, this.ADJUSTED_TILE_HEIGHT);
        this.physics.world.TILE_BIAS = this.BIAS;
        
        // Tilesets
        this.tileset_ind = this.map.addTilesetImage("platformerPack_industrial_tilesheet", "tiles_ind");
        this.tileset_basic = this.map.addTilesetImage("tilemap_packed", "tiles_basic");

        // Music
        this.music = this.sound.add("main_music", {
            volume: 0.25,
            loop: true
        });
        this.music.play();

        // Layers
        this.backgroundLayer = this.map.createLayer("Background", this.tileset_basic, 0, 0).setScale(this.SCALE).setScrollFactor(0.5).setAlpha(0.5);

        this.waterLayer = this.map.createLayer("Water", this.tileset_basic, 0, 0).setScale(this.SCALE);
        
        this.groundLayer = this.map.createLayer("Ground", this.tileset_ind, 0, 0).setScale(this.SCALE);
        this.groundLayer.setCollisionByProperty({ collides: true });

        this.decorLayer = this.map.createLayer("Decor", this.tileset_ind, 0, 0).setScale(this.SCALE);


        // Collectibles
            // Creating coins
        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });

            // Setting coins at scale and position
        for(let coin of this.coins){
            coin.x *= this.SCALE;
            coin.y *= this.SCALE;
            coin.scaleX = this.SCALE;
            coin.scaleY = this.SCALE;
        }
        

        this.coinGroup = this.add.group(this.coins);
        this.anims.play('coinAnim', this.coins);
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        

        // Collision with properties
        let propertyCollider = (ob1, ob2) => {
            // Death Tiles
            if(ob2.properties.danger){
                my.sprite.player.setAccelerationX(0);   // Setting speed to zero
                my.sprite.player.setVelocityX(0);
                my.sprite.player.setAccelerationY(0);
                my.sprite.player.setVelocityY(0);

                my.sprite.player.x = this.STARTING_X;   // Returning to beginning
                my.sprite.player.y = this.STARTING_Y;
            }

            if(ob2.properties.end){
                this.music.pause();
                this.scene.start("Scene_Two");
            }
        }




        // Player
        my.sprite.player = this.physics.add.sprite(this.STARTING_X, this.STARTING_Y, "characters","tile_0021.png").setScale(this.PLAYER_SCALE);
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.player.setMaxVelocity(this.MAX_VEL_X, this.MAX_VEL_Y);

        // Collision
        this.physics.add.collider(my.sprite.player, this.groundLayer, propertyCollider);
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (ob1, ob2) => {
            this.sound.play("coin_sound", {volume: 0.75});
            ob2.destroy();
        });



        // Particles
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_07.png', 'smoke_08.png', 'smoke_09.png', 'smoke_10.png'],
            scale: {start: 0.03, end: 0.15},
            maxAliveParticles: 20,
            lifespan: 350,
            gravityY: -600,
            alpha: {start: 1, end: 0.1}
       });
       my.vfx.walking.stop();

       my.vfx.jumping = this.add.particles(0, 0, "kenny-particles", {  
            frame: ["slash_01.png", "slash_02.png"],
            scale: {start:0.1, end: 0.3},
            maxAliveParticles: 10,
            lifespan: 350,
            gravityY: 200,
            alpha: {start: 1, end: 0.1}
       });
       my.vfx.jumping.stop();



        // I/O
            // Arrow key inputs
        cursors = this.input.keyboard.createCursorKeys();

            // Restart key
        this.rKey = this.input.keyboard.addKey('R');

            // Debugging
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = !this.physics.world.drawDebug;
            this.physics.world.debugGraphic.clear()
        }, this);
        this.physics.world.drawDebug = false;

        // Camera
        this.cameras.main.setBounds(0,0, this.map.widthInPixels * this.SCALE, this.map.heightInPixels * this.SCALE);
        this.cameras.main.setDeadzone(this.DEADZONE, this.DEADZONE);
        this.cameras.main.startFollow(my.sprite.player, true, this.XLERP, this.YLERP);
        this.cameras.main.setZoom(this.SCALE * 1.25) // Extra 1.25 to make it look more zoomed in

        // Description
        document.getElementById('description').innerHTML = '<h2>Use the arrow keys to go left, right, and up!</h2>Click R to restart!';
        

    }


    update(){

        if(cursors.left.isDown) {
            // Player accelerating left
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);

                // Particles
            my.vfx.walking.startFollow(my.sprite.player, this.PARTICLE_X_OFFSET, my.sprite.player.displayHeight/2 - this.PARTICLE_Y_OFFSET, false);
            // Only play smoke effect if touching the ground
            if(my.sprite.player.body.blocked.down) my.vfx.walking.start();


        } else if(cursors.right.isDown) {
            // Player accelerating right
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);

            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

                // Particles
            my.vfx.walking.startFollow(my.sprite.player, - this.PARTICLE_X_OFFSET, my.sprite.player.displayHeight/2 - this.PARTICLE_Y_OFFSET, false);
            // Onlu play smoke effect if touching the ground
            if(my.sprite.player.body.blocked.down) my.vfx.walking.start();

        } else if(cursors.down._justDown){
            // Crouching
            my.sprite.player.setScale(1.5 * this.PLAYER_SCALE, 0.5 * this.PLAYER_SCALE);
        }else {
            // If not moving in a direction, slow down to DRAG speed
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);

            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();
        }

        // Un-crouching
        if(cursors.down._justUp){
            my.sprite.player.setScale(this.PLAYER_SCALE);
        }

        // player jump
        // Checks if player is on the ground
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }

        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.jump();
        }

        // Wall Jumping
        if(Phaser.Input.Keyboard.JustDown(cursors.up)){
            if(!my.sprite.player.body.blocked.down && (my.sprite.player.body.blocked.left || my.sprite.player.body.blocked.right)) {
                this.jump();
                if(my.sprite.player.body.blocked.left) my.sprite.player.body.setVelocityX(this.WALL_JUMP_HORZ);
                if(my.sprite.player.body.blocked.right) my.sprite.player.body.setVelocityX(-this.WALL_JUMP_HORZ);
            }
        }
        




        // Dynamic Deadzones
        if(my.sprite.player.body.velocity.x != 0){
            this.cameras.main.deadzone.width = Phaser.Math.MaxAdd(this.cameras.main.deadzone.width, 1, this.DEADZONE * 3);
        }else {
            this.cameras.main.deadzone.width = this.DEADZONE;
        }



       // Restart 
        if(Phaser.Input.Keyboard.JustDown(this.rKey)){ 
            this.music.stop();
            this.scene.restart();
        }

    }

    jump(factor = 1){
        my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY * factor);
            this.sound.play("jump_sound", {volume: 0.75});
            // Particles
            my.vfx.jumping.startFollow(my.sprite.player, 0, my.sprite.player.displayHeight/2 - this.PARTICLE_Y_OFFSET, false);
            my.vfx.jumping.start();
            this.time.delayedCall(this.PARTICLE_JUMP_TIME, () => {
                my.vfx.jumping.stop();
            });
    }


}