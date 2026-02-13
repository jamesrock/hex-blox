export const convert = (bits) => {
	const base = Math.sqrt(bits.length);
	const out = [];
	let y = 0;
	let x = 0;
	bits.forEach((bit) => {
		if(bit) {
			out.push([x, y]);
		};
		if(x>0&&x%(base-1)===0) {
			y ++;
			x = 0;
		}
		else {
			x ++;
		};
	});
	return out;
};
