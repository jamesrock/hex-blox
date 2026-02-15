import '../css/app.css';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { 
	DisplayObject,
	GameBase,
	Rounder,
	Scaler,
	createNode, 
	shuffle,
	makeArray,
	random, 
	formatNumber, 
	limit,
	isValidKey
} from '@jamesrock/rockjs';
// import { BrickMakers } from './BrickMakers';
import { convert } from './utils';

const scaler = new Scaler(window.devicePixelRatio);

class Block {
	constructor(brick, x, y) {

		this.brick = brick;
		this.x = x;
		this.y = y;

	};
	render(ctx) {
		if(!this.visible) {return}; // omit from render if hidden
		ctx.fillStyle = this.flash ? 'transparent' : this.brick.color;
		ctx.fillRect(
			(this.brick.t.inflate(this.brick.x + this.x) + this.brick.t.gap), 
			(this.brick.t.inflate(this.brick.y + this.y) + this.brick.t.gap), 
			(this.brick.t.inflate(1) - (this.brick.t.gap * 2)), 
			(this.brick.t.inflate(1) - (this.brick.t.gap * 2))
		);
		ctx.fillStyle = this.flash ? 'transparent' : '#FFF';
		return this;
	};
	getMatrix() {
		if(!this.visible) {return null}; // omit from matrix if hidden
		return `x${this.brick.x + this.x}y${this.brick.y + this.y}`;
	};
	getMovedMatrix(direction = 'down') {
		if(!this.visible) {return null}; // omit from matrix if hidden
		switch(direction) {
			case 'down':
				return `x${this.brick.x + this.x}y${this.brick.y + (this.y + 1)}`;
			case 'left':
				return `x${this.brick.x + (this.x - 1)}y${this.brick.y + this.y}`;
			case 'right':
				return `x${this.brick.x + (this.x + 1)}y${this.brick.y + this.y}`;
			case 'up':
				return `x${this.brick.x + this.x}y${this.brick.y + (this.y - 1)}`;
		};
	};
	move() {
		this.y += 1;
		this.moved = true;
	};
	getRelativeY() {
		return (this.brick.y + this.y);
	};
	getRelativeX() {
		return (this.brick.x + this.x);
	};
	isHidden() {
		return !this.visible;
	};
	hide() {
		this.visible = false;
		return this;
	};
	moved = false;
	visible = true;
	flash = false;
};

class Brick {
	constructor(t, x, y, blocks, color, falling = true, isBarrier = false) {
		
		this.t = t;
		this.x = x;
		this.y = y;
		this.blocks = blocks;
		this.color = color;
		this.falling = falling;
		this.isBarrier = isBarrier;
		this.state = this.getRandomState();

		this.blocks = this.blocks.map((state) => {
			return state.map((block) => {
				return new Block(this, block[0], block[1]);
			});
		});

	};
	render(ctx) {

		this.getBlocks().forEach((block) => {
			block.render(ctx);
		});

		return this;

	};
	rotate() {

		if(!this.falling) {
			return this;
		};

		if(this.canRotate()) {
			this.state = this.getNextState();
		};

		return this;

	};
	move(direction) {
		
		if(this.isBarrier || !this.falling) {
			return;
		};

		if(this.canMove(direction)) {

			switch(direction) {
				case 'down':
					this.y += 1;
				break;
				case 'left':
					this.x -= 1;
				break;
				case 'right':
					this.x += 1;
				break;
			};

		}
		else if(direction==='down') {

			this.falling = false;
			
			if(this.y===0) {
				this.t.showGameOverScreen();
			};

		};

		return this;

	};
	getMatrix() {
		
		if(this.falling) {return []}; // return empty matrix if falling
		
		return this.getBlocks().map((block) => {
			return block.getMatrix();
		}).filter((item) => {
			return item;
		});

	};
	getMovedMatrix(direction) {
		
		return this.getBlocks().map((block) => {
			return block.getMovedMatrix(direction);
		}).filter((item) => {
			return item;
		});

	};
	getRotatedMatrix() {

		return this.getBlocks(this.getNextState()).map((block) => {
			return block.getMatrix();
		}).filter((item) => {
			return item;
		});

	};
	getYMatrix() {

		if(this.falling || this.isBarrier) {return []}; // return empty matrix where brick is falling or is barrier
		
		return this.getBlocks().map((block) => {
			if(!block.visible) {return null}; // omit from matrix if hidden
			return block.getRelativeY();
		}).filter((item) => {
			return item;
		});

	};
	canMove(direction) {
		
		const matrix = this.t.getMatrix();
		const movedMatrix = this.getMovedMatrix(direction);
		let matches = 0;
		movedMatrix.forEach((coord) => {
			if(matrix.includes(coord)) {
				matches += 1;
			};
		});
		return matches===0;

	};
	canRotate() {
		
		const matrix = this.t.getMatrix();
		const rotatedMatrix = this.getRotatedMatrix();
		let matches = 0;
		rotatedMatrix.forEach((coord) => {
			if(matrix.includes(coord)) {
				matches += 1;
			};
		});
		return matches===0;

	};
	getRandomState() {
		
		return random(0, this.blocks.length-1);

	};
	getBlocks(override) {
		
		const state = override >= 0 ? override : this.state;
		return this.blocks[state];

	};
	getStaticBlocks() {
		
		if(this.falling || this.isBarrier) {return []}; // return empty matrix where brick is falling or is barrier
		
		return this.getBlocks().map((block) => {
			return block;
		}).filter((block) => {
			return block.visible;
		});

	};
	getNextState() {

		let out = 0;
		
		if(this.state===(this.blocks.length-1)) {
			out = 0;
		}
		else {
			out = (this.state + 1);
		};

		return out;

	};
	center() {
		this.x = 3;
		return this;
	};
	x = 0;
	y = 0;
	state = 0;
	blocks = [];
	color = 'red';
	falling = true;
	isBarrier = false;
};

class YellowBrick extends Brick {
	constructor(t) {
		super(t, 0, 0, [
			convert([1,1,1,1])
		], 'gold');
	};
};

class RedBrick extends Brick {
	constructor(t) {
		super(t, 0, 0, [
			convert([0,1,0,1,1,0,1,0,0]),
			convert([1,1,0,0,1,1,0,0,0]),
			convert([0,0,1,0,1,1,0,1,0]),
			convert([0,0,0,1,1,0,0,1,1])
		], 'rgb(237, 0, 73)');
	};
};

class GreenBrick extends Brick {
	constructor(t) {
		super(t, 0, 0, [
			convert([1,0,0,1,1,0,0,1,0]),
			convert([0,1,1,1,1,0,0,0,0]),
			convert([0,1,0,0,1,1,0,0,1]),
			convert([0,0,0,0,1,1,1,1,0])
		], 'limegreen');
	};
};

class PurpleBrick extends Brick {
	constructor(t) {
		super(t, 0, 0, [
			convert([0,1,0,0,1,1,0,1,0]),
			convert([0,0,0,1,1,1,0,1,0]),
			convert([0,1,0,1,1,0,0,1,0]),
			convert([0,1,0,1,1,1,0,0,0])
		], 'rgb(177, 49, 237)');
	};
};

class BlueBrick extends Brick {
	constructor(t) {
		super(t, 0, 0, [
			convert([0,1,0,0,1,0,1,1,0]),
			convert([1,0,0,1,1,1,0,0,0]),
			convert([0,1,1,0,1,0,0,1,0]),
			convert([0,0,0,1,1,1,0,0,1])
		], 'rgb(0, 111, 222)');
	};
};

class OrangeBrick extends Brick {
	constructor(t) {
		super(t, 0, 0, [
			convert([0,0,1,1,1,1,0,0,0]),
			convert([0,1,0,0,1,0,0,1,1]),
			convert([0,0,0,1,1,1,1,0,0]),
			convert([1,1,0,0,1,0,0,1,0])
		], 'rgb(255, 125, 0)');
	};
};

class CyanBrick extends Brick {
	constructor(t) {
		super(t, 0, 0, [
			convert([0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0]),
			convert([0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0])
		], 'cyan');
	};
};

class BottomBarrierBrick extends Brick {
	constructor(t, x, y) {
		super(t, x, y, [
			[[0, 0, 0], [1, 0, 0], [2, 0, 0], [3, 0, 0], [4, 0, 0], [5, 0, 0], [6, 0, 0], [7, 0, 0], [8, 0, 0], [9, 0, 0]]
		], 'red', false, true);
	};
};

class SideBarrierBrick extends Brick {
	constructor(t, x, y) {
		super(t, x, y, [
			[[0, 0, 0], [0, 1, 0], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0], [0, 6, 0], [0, 7, 0], [0, 8, 0], [0, 9, 0], [0, 10, 0], [0, 11, 0], [0, 12, 0], [0, 13, 0], [0, 14, 0], [0, 15, 0], [0, 16, 0], [0, 17, 0], [0, 18, 0], [0, 19, 0]]
		], 'red', false, true);
	};
};

class BrickFactory {
	constructor(t) {

		this.t = t;

	};
	getFirstInQueue() {
		
		const brick = this.queue.shift(0);
		if(this.queue.length===0) {
			this.reset();
		};
		
		return brick;

	};
	getUpNext() {
		
		return this.queue[0];

	};
	reset() {

		const count = 7;

		this.queue = shuffle(shuffle(shuffle([
			...makeArray(count, () => new CyanBrick(this.t)),
			...makeArray(count, () => new BlueBrick(this.t)),
			...makeArray(count, () => new OrangeBrick(this.t)),
			...makeArray(count, () => new YellowBrick(this.t)),
			...makeArray(count, () => new GreenBrick(this.t)),
			...makeArray(count, () => new PurpleBrick(this.t)),
			...makeArray(count, () => new RedBrick(this.t))
		])));

		console.log(this.queue);

		return this;

	};
	queue = [];
};

class UpNext extends DisplayObject {
	constructor(t) {

		super();

		this.t = t;
		
		this.node = createNode('canvas', 'upnext');
		this.ctx = this.node.getContext('2d');
		
		this.node.width = this.t.inflate(this.size);
		this.node.height = this.t.inflate(this.size);
		this.node.style.width = `${scaler.deflate(this.t.inflate(this.size)) * 0.5}px`;

	};
	renderBrick(brick) {
		
		this.node.width = this.t.inflate(this.size);
		brick.render(this.ctx);
		return this;

	};
	size = 4;
};

class Tetris extends GameBase {
	constructor() {

		super('hexblox');

		this.scoreNode = createNode('div', 'stat');
		this.linesNode = createNode('div', 'stat');
		this.levelNode = createNode('div', 'stat');
		this.gameOverNode = createNode('div', 'game-over');
		this.boardNode = createNode('div', 'board');
		this.statsNode = createNode('div', 'stats');
		this.statsTopNode = createNode('div', 'stats-top');
		this.upNext = new UpNext(this);
		this.factory = new BrickFactory(this);

		this.canvas.width = this.inflate(this.width);
		this.canvas.height = this.inflate(this.height);
		this.canvas.style.width = `${scaler.deflate(this.canvas.width)}px`;

		this.upNext.appendTo(this.boardNode);

		this.node.appendChild(this.boardNode);
		this.node.appendChild(this.statsNode);

		this.statsNode.appendChild(this.statsTopNode);

		this.boardNode.appendChild(this.canvas);
		this.boardNode.appendChild(this.gameOverNode);
		
		this.statsTopNode.appendChild(this.scoreNode);
		this.statsTopNode.appendChild(this.linesNode);
		this.statsTopNode.appendChild(this.levelNode);

		this.reset();

	};
	autoMove() {
		
		this.autoMoveTimer = setTimeout(() => {
			if(this.mode === 'standard') {
				this.move('down');
			};
			if(!this.gameOver) {
				this.autoMove();
			};
		}, (1000 - (35 * this.level)));
		
		return this;

	};
	resetAutoMove() {
		
		clearTimeout(this.autoMoveTimer);
		this.autoMove();
		return this;

	};
	render() {

		this.canvas.width = this.inflate(this.width);

		this.bricks.forEach((brick) => {
			brick.render(this.ctx);
		});

		this.upNext.renderBrick(this.factory.getUpNext());

		this.updateStats();
		this.checkForLines();
		this.checkForFallingBrick();
		this.checkForOldBricks();

		this.animationFrame = requestAnimationFrame(() => {
			this.render();
		});

		return this;

	};
	stop() {
		
		cancelAnimationFrame(this.animationFrame);
		return this;

	};
	reset() {

		this.bricks = [
			new BottomBarrierBrick(this, 0, this.height),
			new SideBarrierBrick(this, -1, 0),
			new SideBarrierBrick(this, this.width, 0)
		];

		this.score = 0;
		this.lines = 0;
		this.level = 0;
		this.gameOver = false;

		this.gameOverNode.dataset.active = false;

		this.factory.reset();
		this.addBrick();

		// this.showGameOverScreen();

	};
	rotate() {
		
		this.bricks.forEach((brick) => {
			brick.rotate();
		});

		return this;

	};
	move(direction) {
		
		this.bricks.forEach((brick) => {
			brick.move(direction);
		});

		return this;

	};
	getMatrix() {
		
		return this.bricks.flatMap((brick) => brick.getMatrix());

	};
	getYMatrix() {
		
		return this.bricks.flatMap((brick) => brick.getYMatrix());

	};
	getStaticBlocks() {
		
		return this.bricks.flatMap((brick) => brick.getStaticBlocks());

	};
	addBrick() {

		this.bricks.push(this.factory.getFirstInQueue().center());
		this.resetAutoMove();
		this.checkForEmptyBoard();
		return this;

	};
	destroyBlocks(lines, callback) {

		lines.forEach(([y, blocks], index) => {

			let flash = true;
			const flashHandler = () => {
				
				blocks.forEach((block) => {
					block.flash = flash;
				});

				flash = !flash;

			};

			flashHandler();

			const flashInterval = setInterval(flashHandler, this.flashDuration);

			setTimeout(() => {
				
				blocks.forEach((block) => {
					block.hide();
				});

				clearInterval(flashInterval);
				callback(y, index === lines.length-1);

			}, (this.flashDuration*3));

		});

		return this;

	};
	checkForLines() {

		if(this.destroying) {return this};

		const matrix = this.getYMatrix();
		const blockMatrix = this.getStaticBlocks();
		let fullLines = [];

		for(var y=0;y<this.height;y++) {
			if(matrix.filter((value) => (value===y)).length===10) {
				fullLines.push([y, blockMatrix.filter((block) => (block.getRelativeY()===y))]);
			};
		};

		if(!fullLines.length) {return this};

		this.destroying = fullLines.length;

		this.destroyBlocks(fullLines, (y, updateScore) => {

			blockMatrix.filter((block) => block.getRelativeY()<y).forEach((block) => {
				block.y += 1;
			});

			this.lines += 1;

			if(this.lines % 10 === 0) {
				this.level += 1;
			};

			this.destroying -= 1;

			if(updateScore) {
				
				this.score += (this.scores[fullLines.length] * (this.level + 1));

			};

		});

		return this;

	};
	checkForFallingBrick() {

		const falling = this.bricks.filter((brick) => {
			return brick.falling;
		});

		if(!falling.length&&!this.destroying&&!this.gameOver) {
			this.addBrick();
		};

		return this;

	};
	checkForOldBricks() {

		const empty = this.bricks.filter((brick) => {
			const blocks = brick.getBlocks();
			const emptyBlocks = blocks.filter((block) => {
				return !block.visible;
			});
			return emptyBlocks.length === blocks.length;
		});

		empty.forEach((brick) => {
			this.bricks.splice(this.bricks.indexOf(brick), 1);
		});

		return this;

	};
	checkForEmptyBoard() {
		
		if(this.getYMatrix().length===0) {
			this.score = (this.score * 2);
		};
		return this;

	};
	query(x, y) {
		const blocks = this.getStaticBlocks();
		return blocks.filter((block) => {return block.getRelativeX()===x && block.getRelativeY()===y})[0];
	};
	updateLines() {

		this.linesNode.innerHTML = `<h2>lines</h2><p>${this.lines}</p>`;
		return this;

	};
	updateScore() {

		this.scoreNode.innerHTML = `<h2>score</h2><p>${formatNumber(this.score)}</p>`;
		return this;

	};
	updateLevel() {
		
		this.levelNode.innerHTML = `<h2>level</h2><p>${this.level}</p>`;
		return this;

	};
	updateStats() {
		
		this.updateLines();
		this.updateScore();
		this.updateLevel();
		return this;

	};
	inflate(value) {
		return value * this.scale;
	};
	setMode(mode) {

		this.mode = mode;
		return this;

	};
	setTheme(theme) {
		
		this.theme = theme;
		return this;

	};
	animationFrame = null;
	width = 10;
	height = 20;
	speed = 800;
	bricks = [];
	score = 0;
	lines = 0;
	level = 0;
	best = 0;
	scale = scaler.inflate(Math.floor(limit(window.innerWidth, 500) / 12));
	gap = scaler.inflate(1.5);
	destroying = 0;
	scores = [0, 40, 100, 300, 1200];
	direction = 'right';
	mode = 'standard';
	gameOver = false;
	flashDuration = 300;
	theme = 'light';
};

var 
body = document.body,
root = document.querySelector(':root'),
rotateKeys = ['Space', 'ArrowUp'],
directionKeys = ['ArrowDown', 'ArrowLeft', 'ArrowRight'],
directionKeysMap = {
	'ArrowDown': 'down',
	'ArrowLeft': 'left',
	'ArrowRight': 'right'
},
platform = Capacitor.getPlatform(),
isApp = window.navigator.standalone || platform==='ios',
tetris = window.tetris = new Tetris(),
touch,
xMovement = 0,
yMovement = 0,
// makers = new BrickMakers(),
rounder = new Rounder(40),
brickCount = tetris.bricks.length,
keydown = false,
prevent = () => keydown&&tetris.bricks.length>brickCount;

// tetris.setTheme(isDarkMode() ? 'dark' : 'light');

tetris.appendTo(body).render();
// makers.appendTo(body);

SplashScreen.hide();

console.log('tetris', tetris);

root.style.setProperty('--game-top-padding', isApp ? '30px' : '0');

document.addEventListener('keyup', () => {
	
	brickCount = tetris.bricks.length;
	keydown = false;

});

document.addEventListener('keydown', (e) => {

	if(prevent()) {
		return;
	};

	keydown = true;

	if(isValidKey(e.code, directionKeys)) {
		tetris.move(directionKeysMap[e.code]);
	};

	if(isValidKey(e.code, rotateKeys)) {
		tetris.rotate();
	};

});

document.addEventListener('click', () => {
	
	if(tetris.gameOver) {
		tetris.reset();
	}
	else {
		tetris.rotate();
	};

	console.log('click', this);

});

document.addEventListener('touchstart', (e) => {
	
	touch = e.touches[0];
	xMovement = 0;
	yMovement = 0;
	brickCount = tetris.bricks.length;
	keydown = true;

	e.preventDefault();

});

document.addEventListener('touchmove', function(e) {

	if(prevent()) {
		return;
	};
	
	const {clientX: originalClientX, clientY: originalClientY} = touch;
	const {clientX, clientY} = e.touches[0];
	const x = rounder.round(clientX - originalClientX);
	const y = rounder.round(clientY - originalClientY);

	if(x !== xMovement) {
		document.dispatchEvent(new Event(x > xMovement ? 'drag-right' : 'drag-left'));
	};

	if(y !== yMovement) {
		document.dispatchEvent(new Event(y > yMovement ? 'drag-down' : 'drag-up'));
	};

	xMovement = x;
	yMovement = y;

});

document.addEventListener('touchend', () => {

	// const noMovement = (xMovement===0 && yMovement===0);

	keydown = false;

});

document.addEventListener('drag-down', () => {
	
	tetris.move('down');

});

document.addEventListener('drag-right', () => {
	
	tetris.move('right');

});

document.addEventListener('drag-left', () => {
	
	tetris.move('left');

});

document.addEventListener('visibilitychange', () => {

	if(document.hidden) {
		tetris.stop();
	} 
	else {
		tetris.render();
	};

});
