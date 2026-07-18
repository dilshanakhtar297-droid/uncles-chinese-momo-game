import Phaser from 'phaser';

interface GameState {
  score: number;
  timeRemaining: number;
  gameRunning: boolean;
}

class GameScene extends Phaser.Scene {
  private gameState: GameState = {
    score: 0,
    timeRemaining: 60,
    gameRunning: true,
  };

  private basket!: Phaser.Physics.Arcade.Sprite;
  private scoreText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private itemsGroup!: Phaser.Physics.Arcade.Group;
  private isPaused = false;
  private pauseButton!: Phaser.GameObjects.Rectangle;
  private pauseText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Assets will be loaded dynamically
  }

  create() {
    const { width, height } = this.sys.game.canvas;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    // Create groups
    this.itemsGroup = this.physics.add.group();

    // Create basket
    this.basket = this.physics.add.sprite(width / 2, height - 60, null);
    this.basket.setCollideWorldBounds(true);
    this.basket.setBounce(0.2);
    this.basket.setDisplaySize(80, 40);

    // Draw basket
    const basketGraphics = this.make.graphics({
      x: 0,
      y: 0,
      add: false,
    });
    basketGraphics.fillStyle(0xd62828, 1);
    basketGraphics.fillRoundedRect(0, 0, 80, 40, 10);
    basketGraphics.strokePath();
    const basketTexture = basketGraphics.generateTexture('basket', 80, 40);
    basketGraphics.destroy();
    this.basket.setTexture('basket');

    // UI Text
    this.scoreText = this.add.text(20, 20, 'Score: 0', {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#FFD166',
      fontStyle: 'bold',
    });
    this.scoreText.setDepth(100);

    this.timerText = this.add.text(width - 200, 20, 'Time: 60s', {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#FFD166',
      fontStyle: 'bold',
    });
    this.timerText.setDepth(100);

    // Pause button
    this.pauseButton = this.add.rectangle(width - 80, height - 60, 100, 50, 0xd62828);
    this.pauseButton.setInteractive();
    this.pauseButton.setDepth(100);

    this.pauseText = this.add.text(width - 80, height - 60, '⏸️', {
      fontSize: '24px',
    });
    this.pauseText.setOrigin(0.5, 0.5);
    this.pauseText.setDepth(101);

    this.pauseButton.on('pointerdown', () => this.togglePause());

    // Keyboard input
    this.input.keyboard?.on('keydown-LEFT', () => {
      this.basket.setVelocityX(-300);
    });
    this.input.keyboard?.on('keydown-RIGHT', () => {
      this.basket.setVelocityX(300);
    });
    this.input.keyboard?.on('keyup-LEFT', () => {
      this.basket.setVelocityX(0);
    });
    this.input.keyboard?.on('keyup-RIGHT', () => {
      this.basket.setVelocityX(0);
    });
    this.input.keyboard?.on('keydown-SPACE', () => this.togglePause());

    // Touch/Mouse input
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.basket.x = Phaser.Math.Clamp(pointer.x, 40, width - 40);
    });

    // Collision
    this.physics.add.overlap(
      this.basket,
      this.itemsGroup,
      (basket: any, item: any) => this.handleCollision(basket, item),
      null,
      this
    );

    // Spawn items
    this.time.addEvent({
      delay: 500,
      callback: () => this.spawnItem(),
      loop: true,
    });

    // Timer
    this.time.addEvent({
      delay: 1000,
      callback: () => this.updateTimer(),
      loop: true,
    });
  }

  private spawnItem() {
    if (!this.gameState.gameRunning) return;

    const width = this.sys.game.canvas.width;
    const itemTypes = [
      { type: 'vegMomo', value: 10, color: 0xffd166, emoji: '🥟' },
      { type: 'chickenMomo', value: 15, color: 0xffa500, emoji: '🍖' },
      { type: 'goldenMomo', value: 50, color: 0xffed4e, emoji: '✨' },
      { type: 'burntMomo', value: -10, color: 0x8b4513, emoji: '🍌' },
      { type: 'chiliBomb', value: -20, color: 0xff0000, emoji: '💥' },
    ];

    const randomItem = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    const x = Phaser.Math.Between(40, width - 40);

    const item = this.itemsGroup.create(x, -20, null);
    item.setVelocityY(200);
    item.setDisplaySize(40, 40);
    item.setData('type', randomItem.type);
    item.setData('value', randomItem.value);
    item.setData('emoji', randomItem.emoji);

    // Draw item
    const graphics = this.make.graphics(
      {
        x: 0,
        y: 0,
        add: false,
      },
      false
    );
    graphics.fillStyle(randomItem.color, 1);
    graphics.fillCircle(20, 20, 20);
    const texture = graphics.generateTexture(`item-${randomItem.type}`, 40, 40);
    graphics.destroy();
    item.setTexture(`item-${randomItem.type}`);

    // Remove if off screen
    this.time.delayedCall(5000, () => {
      if (item) item.destroy();
    });
  }

  private handleCollision(basket: any, item: any) {
    const value = item.getData('value');
    this.gameState.score += value;
    this.scoreText.setText(`Score: ${this.gameState.score}`);

    // Particle effect
    this.createParticleEffect(item.x, item.y, value > 0);
    
    if (value < 0) {
      this.cameras.main.shake(200, 0.01);
    }
    
    item.destroy();
  }

  private createParticleEffect(x: number, y: number, isPositive: boolean) {
    const particles = this.add.particles(0, {
      speed: { min: -200, max: 200 },
      angle: { min: 240, max: 300 },
      scale: { start: 1, end: 0 },
      lifespan: 600,
    });

    particles.emitParticleAt(x, y, 10);
    this.time.delayedCall(700, () => particles.destroy());
  }

  private updateTimer() {
    if (!this.gameState.gameRunning) return;

    this.gameState.timeRemaining--;
    this.timerText.setText(`Time: ${this.gameState.timeRemaining}s`);

    if (this.gameState.timeRemaining <= 0) {
      this.endGame();
    }
  }

  private togglePause() {
    this.isPaused = !this.isPaused;

    if (this.isPaused) {
      this.physics.pause();
      this.pauseText.setText('▶️');
    } else {
      this.physics.resume();
      this.pauseText.setText('⏸️');
    }
  }

  private endGame() {
    this.gameState.gameRunning = false;
    this.physics.pause();

    const width = this.sys.game.canvas.width;
    const height = this.sys.game.canvas.height;

    // Game over screen
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);
    const gameOverText = this.add.text(
      width / 2,
      height / 2 - 100,
      `GAME OVER!\nFinal Score: ${this.gameState.score}`,
      {
        fontSize: '48px',
        fontFamily: 'Arial',
        color: '#FFD166',
        align: 'center',
        fontStyle: 'bold',
      }
    );
    gameOverText.setOrigin(0.5, 0.5);
    gameOverText.setDepth(110);

    this.time.delayedCall(2000, () => {
      window.dispatchEvent(
        new CustomEvent('gameComplete', {
          detail: { score: this.gameState.score },
        })
      );
    });
  }

  update() {
    const width = this.sys.game.canvas.width;
    if (this.basket.x < 40) this.basket.x = 40;
    if (this.basket.x > width - 40) this.basket.x = width - 40;
  }
}

export default GameScene;
