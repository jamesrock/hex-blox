import { 
	BrickMaker,
	DisplayObject,
	createNode, 
} from '@jamesrock/rockjs';

const colors = {
	red: 'rgb(237, 0, 73)',
	yellow: 'gold',
	green: 'limegreen',
	purple: 'rgb(177, 49, 237)',
	orange: 'rgb(255,125,0)',
	cyan: 'cyan',
	blue: 'rgb(0,100,200)'
};

export class BrickMakers extends DisplayObject {
	constructor() {

		super();
		
		this.node = createNode('div', 'makers');

		this.makers = [
			new BrickMaker(colors.red, 3),
			new BrickMaker(colors.yellow, 2),
			new BrickMaker(colors.green, 3),
			new BrickMaker(colors.purple, 3),
			new BrickMaker(colors.orange, 3),
			new BrickMaker(colors.cyan),
			new BrickMaker(colors.blue, 3)
		];

		this.makers.forEach((maker) => {
			
			maker.appendTo(this.node);

			maker.addEventListener('result', () => {
				console.log(maker.value);
			});

		});

	};
};
