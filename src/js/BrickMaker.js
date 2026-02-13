import { 
	createNode, 
	makeArray
} from '@jamesrock/rockjs';

class BrickMakerBase {
	appendTo(to) {

		to.appendChild(this.node);
		return this;

	};
};

export class BrickMakers extends BrickMakerBase {
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
		});

	};
};

export class BrickMaker extends BrickMakerBase {
	constructor(color, size = 4) {

		super();

		this.color = color;
		this.size = size;

		const node = this.node = createNode('div', 'block-maker');
		const bob = 30;
		const gap = 1;
		const bits = [];

		const calculate = () => {
			let total = makeArray(size*size, () => 0);
			bits.forEach((bit, i) => {
				if(bit.dataset.active==='Y') {
					total[i] = Number(bit.dataset.value);
				};
			});
			console.log(JSON.stringify(total));
		};

		node.style.setProperty('--color', this.color);

		node.style.width = node.style.height = `${bob*size + (gap*(size-1))}px`;
		node.style.gap = `${gap}px`;

		makeArray(size).forEach((x) => {
			makeArray(size).forEach((y) => {

				const bit = createNode('div', 'block-maker-bit');
				let active = false;
				bit.style.width = bit.style.height = `${bob}px`;
				bit.dataset.x = x;
				bit.dataset.value = 1;
				bit.dataset.active = 'N';
				node.appendChild(bit);

				bits.push(bit);

				bit.addEventListener('click', () => {
					active = !active;
					bit.dataset.active = active ? 'Y' : 'N';
					calculate();
				});

			});
		});

	};
};