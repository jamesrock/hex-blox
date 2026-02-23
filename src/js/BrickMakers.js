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
			new BrickMaker({color: colors.red, size: 3})
		];

		this.makers.forEach((maker) => {
			
			maker.appendTo(this.node);

			maker.addEventListener('result', () => {
				console.log(maker.value);
			});

		});

	};
};
