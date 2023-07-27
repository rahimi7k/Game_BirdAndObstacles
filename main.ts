import { Engine } from "./app/engine";
import "./main.scss";

var engine: Engine;

class Main {

	public static readonly MAIN_ELEMENT_ID: string = "Main";
	

	constructor() {
		const mainElement: HTMLDivElement = <HTMLDivElement>document.getElementById(Main.MAIN_ELEMENT_ID);


		engine = new Engine();




		var variable1: string = null;
		var variable2: string = undefined;

		if (variable1 == variable2) {
			console.log("The value of the variables is equal");
		}

		if (variable1 === variable2) {

		} else {
			console.log("The type of the variables is not equal");
		}




		window.onresize = function () {
			engine.resize();
		}

	}
}

new Main();

