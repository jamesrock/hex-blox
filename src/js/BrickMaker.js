export class BrickMaker {
	constructor(color, size = 4) {

		super();

		this.color = color;
		this.size = size;

		const maps = {
			'size4': [8, 4, 2, 1],
			'size3': [4, 2, 1],
			'size2': [2, 1],
		};

		const node = this.node = createNode('div', 'block-maker');
		const bob = 30;
		const gap = 1;
		const bitmap = maps[`size${size}`];
		const bits = [];
		const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

		const calculate = () => {
			let total = makeArray(size, () => 0);
			makeArray(size).forEach((i) => {
				bits.filter((bit) => Number(bit.dataset.x)===i).forEach((bit) => {
					if(bit.dataset.active==='Y') {
						total[i] += Number(bit.dataset.value);
					};
				});
				total[i] = values[total[i]];
			});
			console.log(`0x${total.join('')}`);
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
				bit.dataset.value = bitmap[y];
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
  appendTo(to) {

		to.appendChild(this.node);
		return this;

	};
};