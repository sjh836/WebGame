
BasicGame.Game2 = function (game) {
	this.game; // a reference to the currently running game
	this.add; // used to add sprites, text, groups, etc
	this.camera; // a reference to the game camera
	this.cache; // the game cache
	this.input; // the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
	this.load; // for preloading assets
	this.math; // lots of useful common math operations
	this.sound; // the sound manager - add a sound, play one, set-up markers, etc
	this.stage; // the game stage
	this.time; // the clock
	this.tweens; // the tween manager
	this.state; // the state manager
	this.world; // the game world
	this.particles; // the particle manager
	this.physics; // the physics manager
	this.rnd; // the repeatable random number generator
};

BasicGame.Game2.prototype = {
  create: function () {
	this.sea = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'sea');

	//플레이어 관련
	this.player = this.add.sprite(this.game.width / 2, this.game.height - 50, 'player');	//플레이어 생성 및 가운데 기준으로 생성
	this.player.anchor.setTo(0.5, 0.5);
	this.player.animations.add('fly', [ 0, 1, 2 ], 20, true);
	this.player.animations.add('ghost', [ 3, 0, 3, 1 ], 20, true); //고스트 상태일 때 깜빡깜빡
	this.player.play('fly');
	this.physics.enable(this.player, Phaser.Physics.ARCADE);
	this.player.speed = BasicGame.PLAYER_SPEED;		//움직일때 속도
	this.player.body.setSize(20, 20, 20, 20); //hitbox 를 작게 만든다
	this.player.body.collideWorldBounds = true;		// 화면밖으로 나가지 못하도록
	this.weaponLevel = 0; //무기레벨은 0부터 시작

	//플레이어 목숨 관련
 	this.lives = this.add.group(); 
 	var firstLifeIconX = this.game.width - 10 - (BasicGame.PLAYER_EXTRA_LIVES * 30); 
 	for (var i = 0; i < BasicGame.PLAYER_EXTRA_LIVES; i++) { 
 		var life = this.lives.create(firstLifeIconX + (30 * i), 30, 'player');
 		life.scale.setTo(0.5, 0.5); 
 		life.anchor.setTo(0.5, 0.5); 
 	}

	//궁극필살 관련
 	this.bombs = this.add.group(); 
 	var firstBombIconX = this.game.width - 790 + (BasicGame.PLAYER_EXTRA_BOMBS * 30); 
 	for (var i = 0; i < BasicGame.PLAYER_EXTRA_BOMBS; i++) { 
 		var bomb = this.bombs.create(firstBombIconX - (30 * i), 30, 'bomb');
 		bomb.anchor.setTo(0.5, 0.5); 
 	}

	//영웅 관련
	this.heroPool = this.add.group();
	this.heroPool.enableBody = true;
	this.heroPool.physicsBodyType = Phaser.Physics.ARCADE;
	this.heroPool.createMultiple(1, 'hero');
	this.heroPool.setAll('anchor.x', 0.5);
	this.heroPool.setAll('anchor.y', 0.5);
	this.heroPool.setAll('outOfBoundsKill', true); 
	this.heroPool.setAll('checkWorldBounds', true);

 	//아이템 관련
 	this.powerUpPool = this.add.group();
 	this.powerUpPool.enableBody = true;
 	this.powerUpPool.physicsBodyType = Phaser.Physics.ARCADE;
 	this.powerUpPool.createMultiple(3, 'powerup1');
 	this.powerUpPool.setAll('anchor.x', 0.5);
 	this.powerUpPool.setAll('anchor.y', 0.5);
 	this.powerUpPool.setAll('outOfBoundsKill', true);
 	this.powerUpPool.setAll('checkWorldBounds', true);
 	this.powerUpPool.setAll('reward', BasicGame.POWERUP_REWARD, false, false, 0, true ); //점수 지급

 	this.starPool = this.add.group();
 	this.starPool.enableBody = true;
 	this.starPool.physicsBodyType = Phaser.Physics.ARCADE;
 	this.starPool.createMultiple(10, 'star');
 	this.starPool.setAll('anchor.x', 0.5);
 	this.starPool.setAll('anchor.y', 0.5);
 	this.starPool.setAll('outOfBoundsKill', true);
 	this.starPool.setAll('checkWorldBounds', true);
 	this.starPool.setAll('reward', BasicGame.STAR_REWARD, false, false, 0, true );

  	this.diamondPool = this.add.group();
 	this.diamondPool.enableBody = true;
 	this.diamondPool.physicsBodyType = Phaser.Physics.ARCADE;
 	this.diamondPool.createMultiple(5, 'diamond');
 	this.diamondPool.setAll('anchor.x', 0.5);
 	this.diamondPool.setAll('anchor.y', 0.5);
 	this.diamondPool.setAll('outOfBoundsKill', true);
 	this.diamondPool.setAll('checkWorldBounds', true);
 	this.diamondPool.setAll('reward', BasicGame.DIAMOND_REWARD, false, false, 0, true );

	//적기 관련
	this.enemyPool = this.add.group();
	this.enemyPool.enableBody = true;
	this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
	this.enemyPool.createMultiple(50, 'f01');
	this.enemyPool.setAll('anchor.x', 0.5);
	this.enemyPool.setAll('anchor.y', 0.5);
	this.enemyPool.setAll('outOfBoundsKill', true); 
	this.enemyPool.setAll('checkWorldBounds', true);
	this.enemyPool.setAll('reward', BasicGame.F01_REWARD, false, false, 0, true); //점수 지급 
	this.enemyPool.setAll('dropRate', BasicGame.ENEMY_DROP_RATE, false, false, 0, true ); //아이템 드랍율

	this.enemyPool.forEach(function (enemy) {
		enemy.animations.add('fly', [ 0 ], 20, true);
		enemy.animations.add('hit', [ 1, 0 ], 20, false); 
		enemy.events.onAnimationComplete.add( function (e) { e.play('fly'); }, this); 
	});
	this.nextEnemyAt = 0;
	this.enemyDelay = BasicGame.SPAWN_ENEMY_DELAY;

	//고급적기 관련
	this.shooterPool = this.add.group();
	this.shooterPool.enableBody = true;
	this.shooterPool.physicsBodyType = Phaser.Physics.ARCADE;
	this.shooterPool.createMultiple(20, 'f02');
	this.shooterPool.setAll('anchor.x', 0.5);
	this.shooterPool.setAll('anchor.y', 0.5);
	this.shooterPool.setAll('outOfBoundsKill', true);
	this.shooterPool.setAll('checkWorldBounds', true);
	this.shooterPool.setAll( 'reward', BasicGame.F02_REWARD, false, false, 0, true );

	this.shooterPool.forEach(function (enemy) { 
		enemy.animations.add('fly', [ 0 ], 20, true);
		enemy.animations.add('hit', [ 1, 0 ], 20, false);
		enemy.events.onAnimationComplete.add( function (e) { e.play('fly'); }, this);
	});

	this.nextShooterAt = this.time.now + Phaser.Timer.SECOND * 5;
	this.shooterDelay = BasicGame.SPAWN_SHOOTER_DELAY;

	//대장적기 관련
	this.bossPool = this.add.group();
	this.bossPool.enableBody = true;
	this.bossPool.physicsBodyType = Phaser.Physics.ARCADE;
	this.bossPool.createMultiple(5, 'boss');
	this.bossPool.setAll('anchor.x', 0.5);
	this.bossPool.setAll('anchor.y', 0.5);
	this.bossPool.setAll('outOfBoundsKill', true);
	this.bossPool.setAll('checkWorldBounds', true);
	this.bossPool.setAll('reward', BasicGame.BOSS_REWARD, false, false, 0, true);
	this.bossPool.setAll('dropRate', BasicGame.BOSS_DROP_RATE, false, false, 0, true );
	this.bossPool.forEach(function (enemy) {
		enemy.animations.add('fly', [ 0, 1, 2 ], 20, true);
		enemy.animations.add('hit', [ 3, 1, 3, 2 ], 20, false);
		enemy.events.onAnimationComplete.add( function (e) { e.play('fly'); }, this);
	});
	this.nextBossAt = this.time.now + Phaser.Timer.SECOND * 10;
	this.bossDelay = BasicGame.SPAWN_BOSS_DELAY;

	//전투함 관련
	this.destroyerPool = this.add.group();
	this.destroyerPool.enableBody = true;
	this.destroyerPool.physicsBodyType = Phaser.Physics.ARCADE;
	this.destroyerPool.createMultiple(10, 'destroyer');
	this.destroyerPool.setAll('anchor.x', 0.5);
	this.destroyerPool.setAll('anchor.y', 0.5);
	this.destroyerPool.setAll('outOfBoundsKill', true);
	this.destroyerPool.setAll('checkWorldBounds', true);
	this.destroyerPool.setAll('reward', BasicGame.DESTROYER_REWARD, false, false, 0, true);
	this.destroyerPool.setAll('dropRate', BasicGame.DESTROYER_DROP_RATE, false, false, 0, true );
	this.destroyerPool.forEach(function (enemy) {
		enemy.animations.add('fly', [ 0, 1 ], 32, true);
		enemy.animations.add('hit', [ 2, 0, 2, 1 ], 32, false);
		enemy.events.onAnimationComplete.add( function (e) { e.play('fly'); }, this);
	});
	this.nextDestroyerAt = this.time.now + Phaser.Timer.SECOND * 7;
	this.destroyerDelay = BasicGame.SPAWN_DESTROYER_DELAY;

	//적기 총알 관련
	this.enemyBulletPool = this.add.group();
	this.enemyBulletPool.enableBody = true;
	this.enemyBulletPool.physicsBodyType = Phaser.Physics.ARCADE;
	this.enemyBulletPool.createMultiple(100, 'enemyBullet');
	this.enemyBulletPool.setAll('anchor.x', 0.5);
	this.enemyBulletPool.setAll('anchor.y', 0.5);
	this.enemyBulletPool.setAll('outOfBoundsKill', true);
	this.enemyBulletPool.setAll('checkWorldBounds', true);
	this.enemyBulletPool.setAll('reward', 0, false, false, 0, true);

	//총알 관련
	this.bulletPool = this.add.group();
	this.bulletPool.enableBody = true;
	this.bulletPool.physicsBodyType = Phaser.Physics.ARCADE;
	this.bulletPool.createMultiple(100, 'bullet');
	this.bulletPool.setAll('anchor.x', 0.5);
	this.bulletPool.setAll('anchor.y', 0.5);
	this.bulletPool.setAll('outOfBoundsKill', true); //화면 밖으로 나가면 삭제 처리
	this.bulletPool.setAll('checkWorldBounds', true);

	this.nextShotAt = 0;
	this.shotDelay = BasicGame.SHOT_DELAY; //총알 간격
	
	//폭발 관련
	this.explosionPool = this.add.group();
	this.explosionPool.enableBody = true;
	this.explosionPool.physicsBodyType = Phaser.Physics.ARCADE;
	this.explosionPool.createMultiple(100, 'explosion');
	this.explosionPool.setAll('anchor.x', 0.5);
	this.explosionPool.setAll('anchor.y', 0.5);
	this.explosionPool.forEach(function (explosion) {
		explosion.animations.add('boom');
	});

	this.cursors = this.input.keyboard.createCursorKeys();  //키보드 입력

	//소리 관련
	this.explosionSFX = this.add.audio('explosion');
	this.playerExplosionSFX = this.add.audio('playerExplosion');
	this.enemyFireSFX = this.add.audio('enemyFire');
	this.playerFireSFX = this.add.audio('playerFire');
	this.powerUpSFX = this.add.audio('powerUp');

	//안내문
	this.instructions = this.add.text(this.game.width / 2, this.game.height - 100, 'Z키나 click으로 발포할 수 있습니다', { font: '20px monospace', fill: '#fff', align: 'center' });
	this.instructions.anchor.setTo(0.5, 0.5);
	this.instExpire = this.time.now + BasicGame.INSTRUCTION_EXPIRE; //안내문구 10초간 생성

	this.score = 50000;
	this.scoreText = this.add.text(this.game.width / 2, 30, '' + this.score, {font: '30px Arial', fill: '#fff', align: 'center'});
	this.scoreText.anchor.setTo(0.5, 0.5);
},

  update: function () {
	this.sea.tilePosition.y += 0.2; //타일을 움직이게 해서 게임진행효과를 낸다
	
	this.physics.arcade.overlap(this.bulletPool, this.enemyPool, this.enemyHit, null, this); //총알과 적기가 충돌 시 enemyHit 호출
	this.physics.arcade.overlap(this.bulletPool, this.shooterPool, this.enemyHit, null, this); //총알과 고급적기가 충돌 시 enemyHit 호출
	this.physics.arcade.overlap(this.player, this.enemyPool, this.playerHit, null, this); //플레이어와 적기가 충돌 시 playerHit 호출
	this.physics.arcade.overlap(this.player, this.powerUpPool, this.playerPowerUp, null, this); //플레이어와 아이템이 충돌 시 playerPowerUp 호출
	this.physics.arcade.overlap(this.player, this.starPool, this.playerGetStar, null, this);
	this.physics.arcade.overlap(this.player, this.diamondPool, this.playerGetDiamond, null, this);
	this.physics.arcade.overlap(this.player, this.shooterPool, this.playerHit, null, this);
	this.physics.arcade.overlap(this.player, this.enemyBulletPool, this.playerHit, null, this); //플레이어와 적 총알이 충돌 시
	this.physics.arcade.overlap(this.bulletPool, this.bossPool, this.enemyHit, null, this);
	this.physics.arcade.overlap(this.player, this.bossPool, this.playerHit, null, this);
	this.physics.arcade.overlap(this.bulletPool, this.destroyerPool, this.enemyHit, null, this);
	this.physics.arcade.overlap(this.player, this.destroyerPool, this.playerHit, null, this);
	this.physics.arcade.overlap(this.heroPool, this.enemyBulletPool, this.heroHit, null, this);
	this.physics.arcade.overlap(this.heroPool, this.bossPool, this.heroHit, null, this);
	this.physics.arcade.overlap(this.heroPool, this.shooterPool, this.heroHit, null, this);
	this.physics.arcade.overlap(this.heroPool, this.enemyPool, this.heroHit, null, this);
	this.physics.arcade.overlap(this.heroPool, this.destroyerPool, this.heroHit, null, this);

	//적기 생성
	if(this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0) {
		this.nextEnemyAt = this.time.now + this.enemyDelay;
		var enemy = this.enemyPool.getFirstExists(false);
		enemy.reset(this.rnd.integerInRange(20, this.game.width - 20), 0, BasicGame.F01_HEALTH); //Math.random()을 쓰지않고 게임에 내장된 rnd를 이용, 5방맞아야 죽는듯
		enemy.body.velocity.y = this.rnd.integerInRange(BasicGame.ENEMY_MIN_Y_VELOCITY, BasicGame.ENEMY_MAX_Y_VELOCITY);
		enemy.play('fly');
	}

	//고급적기 생성
	if(this.nextShooterAt < this.time.now && this.shooterPool.countDead() > 0) {
		this.nextShooterAt = this.time.now + this.shooterDelay;
		var shooter = this.shooterPool.getFirstExists(false);
		shooter.reset(this.rnd.integerInRange(20, this.game.width - 20), 0, BasicGame.F02_HEALTH);
		var target = this.rnd.integerInRange(20, this.game.width - 20);
		shooter.rotation = this.physics.arcade.moveToXY(shooter, target, this.game.height, this.rnd.integerInRange(BasicGame.SHOOTER_MIN_VELOCITY, BasicGame.SHOOTER_MAX_VELOCITY)) - Math.PI / 2;
		shooter.play('fly');
		shooter.nextShotAt = 0;
	}

	//대장적기 생성
	if(this.nextBossAt < this.time.now && this.bossPool.countDead() > 0) {
		this.nextBossAt = this.time.now + this.bossDelay;
		var boss = this.bossPool.getFirstExists(false);
		boss.reset(this.rnd.integerInRange(20, this.game.width - 20), 0, BasicGame.BOSS_HEALTH);
		boss.body.velocity.y = BasicGame.BOSS_Y_VELOCITY;
		boss.play('fly');
		boss.nextShotAt = 0;
	}

	//전투함 생성
	if(this.nextDestroyerAt < this.time.now && this.destroyerPool.countDead() > 0) {
		this.nextDestroyerAt = this.time.now + this.destroyerDelay;
		var destroyer = this.destroyerPool.getFirstExists(false);
		destroyer.reset(this.rnd.integerInRange(20, this.game.width - 20), 0, BasicGame.BOSS_HEALTH);
		destroyer.body.velocity.y = BasicGame.DESTROYER_Y_VELOCITY;
		destroyer.play('fly');
		destroyer.nextShotAt = 0;
	}

	//고급적기 총알 발사
	this.shooterPool.forEachAlive(function (enemy) {
		if (this.time.now > enemy.nextShotAt && this.enemyBulletPool.countDead() > 0) {
			var bullet = this.enemyBulletPool.getFirstExists(false);
			bullet.reset(enemy.x, enemy.y);
			this.physics.arcade.moveToObject(bullet, this.player, BasicGame.ENEMY_BULLET_VELOCITY); //플레이어쪽으로 총알을 보낸다
			enemy.nextShotAt = this.time.now + BasicGame.SHOOTER_SHOT_DELAY; 
		} 
	}, this); 

	//대장적기 총알 발사
	this.bossPool.forEachAlive(function (enemy) {
		if (this.time.now > enemy.nextShotAt && this.enemyBulletPool.countDead() > 0) {
			var bullet = this.enemyBulletPool.getFirstExists(false);
			bullet.reset(enemy.x, enemy.y);
			this.physics.arcade.moveToObject(bullet, this.player, BasicGame.ENEMY_BULLET_VELOCITY);
			enemy.nextShotAt = this.time.now + BasicGame.BOSS_SHOT_DELAY; 
		} 
	}, this); 

	//전투함 총알 발사
	this.destroyerPool.forEachAlive(function (enemy) {
		if (this.time.now > enemy.nextShotAt && this.enemyBulletPool.countDead() > 0) {
			var bullet = this.enemyBulletPool.getFirstExists(false);
			bullet.reset(enemy.x, enemy.y);
			this.physics.arcade.moveToObject(bullet, this.player, BasicGame.ENEMY_BULLET_VELOCITY);
			enemy.nextShotAt = this.time.now + BasicGame.DESTROYER_SHOT_DELAY; 
		} 
	}, this); 

	//플레이어 조작 부분: 이동, 발포
	this.player.body.velocity.x = 0; //평상시엔 이동 0
	this.player.body.velocity.y = 0;
	
	if(this.cursors.left.isDown) { //좌우 이동
		this.player.body.velocity.x = -this.player.speed;		
	}
	else if(this.cursors.right.isDown) {
		this.player.body.velocity.x = this.player.speed;
	}
	if(this.cursors.up.isDown) { //상하 이동
		this.player.body.velocity.y = -this.player.speed;
	}
	else if(this.cursors.down.isDown) {
		this.player.body.velocity.y = this.player.speed;
	}
		
	if(this.input.activePointer.isDown && this.physics.arcade.distanceToPointer(this.player) > 6) { //눌러 진 점에서 6px거리까진 이동 중지
		this.physics.arcade.moveToPointer(this.player, this.player.speed);
	}
	
	if(this.input.keyboard.isDown(Phaser.Keyboard.Z) || this.input.activePointer.isDown) { //z키나 마우스 포인트가 눌리면 fire 함수 호출
		if(this.returnText && this.returnText.exists) { 
			this.quitGame();
		}
		else {
			this.fire();
		}
	}
	if(this.input.keyboard.isDown(Phaser.Keyboard.B)) { //B키를 누르면 bomb 함수 호출
		if(this.returnText && this.returnText.exists) { 
			this.quitGame();
		}
		else {
			this.bomb();
		}
	}
	if(this.instructions.exists && this.time.now > this.instExpire) {
		this.instructions.destroy(); //안내문구 사라진다
	}
	if(this.ghostUntil && this.ghostUntil < this.time.now) { 
		this.ghostUntil = null; 
		this.player.play('fly'); //고스트 모드 해제
	}
	if(this.showReturn && this.time.now > this.showReturn) { //게임끝난후 해당 문구 출력
		this.returnText = this.add.text( this.game.width / 2, this.game.height / 2 + 20, 'Z키 또는 Click하여 메인으로 돌아가십시오', { font: '16px sans-serif', fill: '#fff'} );
		this.returnText.anchor.setTo(0.5, 0.5);
		this.showReturn = false;
	}
 },
 
 fire: function(){
	if(!this.player.alive || this.nextShotAt > this.time.now) { //생존중일때 and 100ms간격으로만 총알 발사
		return;
	}
	if(this.bulletPool.countDead() === 0) {
		return;
	}
	this.nextShotAt = this.time.now + this.shotDelay;
	this.playerFireSFX.play();

	var bullet = this.bulletPool.getFirstExists(false); //pool에서 첫번째 총알을 담는다
	bullet.reset(this.player.x, this.player.y - 20); //플레이이어 앞부분에서 총알발사 위치

	bullet.body.velocity.y = -BasicGame.BULLET_VELOCITY;

	if(this.weaponLevel === 0) {
		if(this.bulletPool.countDead() === 0) {
			return;
		}
		bullet = this.bulletPool.getFirstExists(false);
		bullet.reset(this.player.x, this.player.y - 20);
		bullet.body.velocity.y = -BasicGame.BULLET_VELOCITY;
	}
	else {
		if(this.bulletPool.countDead() < this.weaponLevel * 2) {
			return;
		}
		for(var i = 0; i < this.weaponLevel; i++) { //무기레벨업
			bullet = this.bulletPool.getFirstExists(false); 
			bullet.reset(this.player.x - (10 + i * 8), this.player.y - 20); 
			//this.physics.arcade.velocityFromAngle(-95 - i * 10, BasicGame.BULLET_VELOCITY, bullet.body.velocity); //총알 휘어나감
			bullet.body.velocity.y = -BasicGame.BULLET_VELOCITY;
			bullet = this.bulletPool.getFirstExists(false); 
			bullet.reset(this.player.x + (10 + i * 8), this.player.y - 20);
			//this.physics.arcade.velocityFromAngle(-85 + i * 10, BasicGame.BULLET_VELOCITY, bullet.body.velocity);
			bullet.body.velocity.y = -BasicGame.BULLET_VELOCITY;
		}
	}
 },

 bomb: function () {
	if(!this.player.alive) { //생존중일때 폭탄 발사
		return;
	}
	if(this.heroPool.countDead() === 0) {
		return;
	}
	var bomb = this.bombs.getFirstAlive();
	if (bomb !== null) { 
		bomb.kill();
		this.nextShotAt = this.time.now + this.shotDelay;
		this.playerFireSFX.play();

		var hero = this.heroPool.getFirstExists(false); //영웅을 생성
		hero.reset(this.player.x, this.player.y - 20);
		hero.body.velocity.y = -50;
	}
 },

 enemyHit: function (bullet, enemy) {
	bullet.kill();
	this.damageEnemy(enemy, BasicGame.BULLET_DAMAGE);
 },

 playerHit: function (player, enemy) {
 	if (this.ghostUntil && this.ghostUntil > this.time.now) { 
 		return;
 	}
 	this.playerExplosionSFX.play();
 	this.damageEnemy(enemy, BasicGame.CRASH_DAMAGE);
 	this.explode(player);
	var life = this.lives.getFirstAlive();
	if (life !== null) {
		life.kill();
		this.weaponLevel = 0; //무기레벨을 0으로 초기화
		this.ghostUntil = this.time.now + BasicGame.PLAYER_GHOST_TIME;
		this.player.play('ghost');

		this.bombs.destroy();
		this.bombs = this.add.group(); 
		var firstBombIconX = this.game.width - 790 + (BasicGame.PLAYER_EXTRA_BOMBS * 30); //폭탄 재생
	 	for (var i = 0; i < BasicGame.PLAYER_EXTRA_BOMBS; i++) { 
	 		var bomb = this.bombs.create(firstBombIconX - (30 * i), 30, 'bomb');
	 		bomb.anchor.setTo(0.5, 0.5); 
	 	}
	}
	else {
		this.explode(player);
		player.kill();
		this.displayEnd(false);
	}
 },

 heroHit: function (hero, enemy) { //영웅과 충돌시 모두사망
 	enemy.kill();

 	this.explode(enemy);
 	this.explosionSFX.play(); 
 	this.spawnPowerUp(enemy);
 	this.spawnStar(enemy);
 	this.spawnDiamond(enemy);
 	this.addToScore(enemy.reward);
 },

 damageEnemy: function (enemy, damage) { 
 	enemy.damage(damage); 

 	if (enemy.alive) { 
 		enemy.play('hit'); 
 	}
 	else { 
 		this.explode(enemy); //적기 체력이 다닳아야 폭발한다
 		this.explosionSFX.play(); 
 		this.spawnPowerUp(enemy);
 		this.spawnStar(enemy);
 		this.spawnDiamond(enemy);
 		this.addToScore(enemy.reward); //폭발시 점수 지급
 	} 
 },

 explode: function (sprite) {
 	if(this.explosionPool.countDead() === 0) { 
  		return; 
  	} 

 	var explosion = this.explosionPool.getFirstExists(false); 
 	explosion.reset(sprite.x, sprite.y); 
 	explosion.play('boom', 15, false, true);
 	explosion.body.velocity.x = sprite.body.velocity.x; 
 	explosion.body.velocity.y = sprite.body.velocity.y; 
 },

 addToScore: function (score) {
 	this.score += score;
 	this.scoreText.text = this.score; 224
	if(this.score >= 150000) {
		this.enemyPool.destroy();
		this.shooterPool.destroy();
		this.enemyBulletPool.destroy();
		this.bossPool.destroy();
		this.destroyerPool.destroy();
		this.displayEnd(true);
	}
 },

 playerPowerUp: function (player, powerUp) {
 	this.addToScore(powerUp.reward); 
 	powerUp.kill(); 
 	this.powerUpSFX.play();
 	if(this.weaponLevel < 5) { 
 		this.weaponLevel++; 
 	}
 },

 playerGetStar: function (player, star) {
 	this.addToScore(star.reward); 
 	star.kill(); 
 	this.powerUpSFX.play();
 },

 playerGetDiamond: function (player, diamond) {
 	this.addToScore(diamond.reward); 
 	diamond.kill(); 
 	this.powerUpSFX.play();
 },

 spawnPowerUp: function (enemy) { 
	if (this.powerUpPool.countDead() === 0 || this.weaponLevel === 5) { 
		return; 
	}

	if (this.rnd.frac() < enemy.dropRate) {
		var powerUp = this.powerUpPool.getFirstExists(false);
		powerUp.reset(enemy.x, enemy.y);
		powerUp.body.velocity.y = BasicGame.POWERUP_VELOCITY;
	}
 },

 spawnStar: function (enemy) { 
	if (this.starPool.countDead() === 0) { 
		return; 
	}

	if (this.rnd.frac() < enemy.dropRate) {
		var star = this.starPool.getFirstExists(false);
		star.reset(enemy.x, enemy.y);
		star.body.velocity.y = BasicGame.ITEM_VELOCITY;
	}
 },

 spawnDiamond: function (enemy) { 
	if (this.diamondPool.countDead() === 0) { 
		return; 
	}

	if (this.rnd.frac() < enemy.dropRate) {
		var diamond = this.diamondPool.getFirstExists(false);
		diamond.reset(enemy.x, enemy.y);
		diamond.body.velocity.y = BasicGame.ITEM_VELOCITY;
	}
 },

 displayEnd: function (win) { 

	if (this.endText && this.endText.exists) { // you can't win and lose at the same time 
		return; 
	}

	var msg = win ? 'You Win' : 'Game Over'; 
	this.endText = this.add.text( 
	this.game.width / 2, this.game.height / 2 - 60, msg, {font: '72px serif', fill: '#fff'}); 
	this.endText.anchor.setTo(0.5, 0);
	this.showReturn = this.time.now + BasicGame.RETURN_MESSAGE_DELAY;
 },

 render: function() { //디버그 용도
	//this.game.debug.body(this.bulletPool);
	//this.game.debug.body(this.enemyPool);
	//this.game.debug.body(this.player);
 },

 quitGame: function (pointer) {
	this.sea.destroy();
	this.player.destroy();
	this.enemyPool.destroy();
	this.bulletPool.destroy();
	this.explosionPool.destroy(); 
	this.instructions.destroy();
	this.scoreText.destroy();
	this.endText.destroy();
	this.returnText.destroy();
	this.powerUpPool.destroy();
	this.shooterPool.destroy();
	this.enemyBulletPool.destroy();
	this.starPool.destroy();
	this.diamondPool.destroy();
	this.bossPool.destroy();
	this.destroyerPool.destroy();
	this.heroPool.destroy();
	this.state.start('MainMenu');
  }
};
