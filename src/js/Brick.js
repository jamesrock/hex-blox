import { random } from '@jamesrock/rockjs';
import { Block } from './Block';

export class Brick {
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
