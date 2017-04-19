BasicGame.Preloader = function (game) {
  this.background = null;
  this.preloadBar = null;
};

BasicGame.Preloader.prototype = {
  preload: function () {
    this.stage.backgroundColor = '#2d2d2d';

    this.preloadBar = this.add.sprite(this.game.width / 2 - 100, this.game.height / 2, 'preloaderBar');
    this.add.text(this.game.width / 2, this.game.height / 2 - 30, "로딩중...", { font: "32px monospace", fill: "#fff" }).anchor.setTo(0.5, 0.5);

    this.load.setPreloadSprite(this.preloadBar); //load될때마다 채워진다

    this.load.image('titlepage', 'assets/airwar/airwar.jpg');
    this.load.image('sea', 'assets/airwar/sea.png');
    this.load.image('sea2', 'assets/airwar/sea2.png');
    this.load.image('bullet', 'assets/airwar/bullet.png');
    this.load.image('bullet2', 'assets/airwar/bullet2.png');
    this.load.image('enemyBullet', 'assets/airwar/enemy-bullet.png');
    this.load.image('enemyBullet2', 'assets/airwar/bullet-burst.png');
    this.load.image('powerup1', 'assets/airwar/powerup1.png');
    this.load.image('powerup2', 'assets/airwar/powerup2.png');
    this.load.image('bomb', 'assets/airwar/bomb.png');
    this.load.image('star', 'assets/tutorial/star.png');
    this.load.image('diamond', 'assets/tutorial/diamond.png');
    this.load.image('hero', 'assets/airwar/hero.png');
    this.load.spritesheet('greenEnemy', 'assets/airwar/enemy.png', 32, 32);
    this.load.spritesheet('whiteEnemy', 'assets/airwar/shooting-enemy.png', 32, 32);
    this.load.spritesheet('boss', 'assets/airwar/boss.png', 93, 75);
    this.load.spritesheet('explosion', 'assets/airwar/explosion.png', 32, 32);
    this.load.spritesheet('player', 'assets/airwar/player.png', 64, 64);
    this.load.spritesheet('destroyer', 'assets/airwar/destroyer.png', 32, 174);
    this.load.spritesheet('f01', 'assets/airwar/f01.png', 66, 66);
    this.load.spritesheet('f02', 'assets/airwar/f02.png', 166, 124);
    this.load.audio('explosion', ['assets/airwar/explosion.ogg', 'assets/airwar/explosion.wav']);
    this.load.audio('playerExplosion', ['assets/airwar/player-explosion.ogg', 'assets/airwar/player-explosion.wav']);
    this.load.audio('enemyFire', ['assets/airwar/enemy-fire.ogg', 'assets/airwar/enemy-fire.wav']);
    this.load.audio('playerFire', ['assets/airwar/player-fire.ogg', 'assets/airwar/player-fire.wav']);
    this.load.audio('powerUp', ['assets/airwar/powerup.ogg', 'assets/airwar/powerup.wav']);
  },

  create: function () {
    this.preloadBar.cropEnabled = false;
  },

  update: function () {
      this.state.start('MainMenu');
  }
};
