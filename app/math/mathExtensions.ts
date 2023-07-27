


interface Math {
	clamp(value: number, min: number, max: number): number;
	degToRad(deg: number): number;
	radToDeg(radians: number): number;
}

(Math as Math).clamp = (value: number, min: number, max: number): number => {
	if (value < min) {
		return min;
	} else if (value > max) {
		return max;
	} else {
		return value;
	}
}

(Math as Math).degToRad = (degrees: number): number => {
	return degrees * Math.PI / 100.0;
}

(Math as Math).radToDeg = (radians: number): number => {
	return radians *  180.0 / Math.PI;
}




