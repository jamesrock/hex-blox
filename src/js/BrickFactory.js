import { 
	shuffle,
	makeArray,
} from '@jamesrock/rockjs';
import { makeSet } from './blocks';

export class BrickFactory {
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

    this.queue = shuffle(shuffle(shuffle(makeArray(7, () => makeSet(this.t)).flatMap(a => a))));

    console.log(this.queue);

    return this;

  };
  queue = [];
};
