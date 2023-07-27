
export { }; //external module" is a file containing an import or export statement, so this makes it an "external module"

declare global {
	interface Window {
		opera: any;
	}
}


if (Object.entries == null) {
	Object.entries = function (obj: any) {
		var props = Object.keys(obj);
		var i = props.length;
		var resArray = new Array(i);

		while (i--) {
			resArray[i] = [props[i], obj[props[i]]];
		}

		return resArray;
	};
}