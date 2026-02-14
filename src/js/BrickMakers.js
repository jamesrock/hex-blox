import { 
	BrickMaker,
	DisplayObject,
	createNode, 
} from '@jamesrock/rockjs';

export class BrickMakers extends DisplayObject {
	constructor() {

		super();
		
		this.node = createNode('div', 'makers');

		this.makers = [
			new BrickMaker('rgb(237, 0, 73)', 3), // red
			new BrickMaker('gold', 2), // yellow
			new BrickMaker('limegreen', 3), // green
			new BrickMaker('rgb(177, 49, 237)', 3), // purple
			new BrickMaker('rgb(255,125,0)', 3), // orange
			new BrickMaker('cyan'),
			new BrickMaker('rgb(0,100,200)', 3) // blue
		];

		this.makers.forEach((maker) => {
			
			maker.appendTo(this.node);

			maker.addEventListener('result', () => {
				console.log(maker.value);
			});

		});

	};
};
