export class Block {
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
