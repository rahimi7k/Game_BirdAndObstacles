
/**
 * WebGL rendering context
 * */
export var gl: WebGLRenderingContext;


/**
 *	Responsible for setting up a WebGL rendering context
 * */
export class GLUtilities {

	/**
	 * Initialize WebGL
	 * @param elementId The id of the element to search for
	 * */
	public static initialize(elementId?: string): HTMLCanvasElement {
		let canvas: HTMLCanvasElement;

		if (elementId !== undefined) {
			canvas = <HTMLCanvasElement>document.getElementById(elementId);//casting
			if (canvas === undefined) {
				throw new Error("Cannot find canvas element named: " + elementId);
			}
		} else {
			canvas = document.createElement("canvas");
			document.getElementById("Main").appendChild(canvas);
		}

		gl = canvas.getContext("webgl");
		if (gl === undefined || gl == null) {
			gl = canvas.getContext("experimental-webgl") as WebGLRenderingContext;
			if (gl === undefined || gl == null) {
				throw new Error("WEBGL is not supported");
			} else {
				console.warn("WebGL not suppurted, we are using experimental-webgl!");
			}
		}

		return canvas;
	}



}