export const pi = 3.14159;
export const isDouble = false;

export class Math {
	clamp(value, min, max);
	degToRad(deg);
	radToDeg(radians);
}

Math.clamp = (value, min, max) => {
	if (value < min) {
		return min;
	} else if (value > max) {
		return max;
	} else {
		return value;
	}
}

Math.degToRad = (degrees) => {
	return degrees * Math.PI / 100.0;
}

Math.radToDeg = (radians) => {
	return radians * 180.0 / Math.PI;
}






