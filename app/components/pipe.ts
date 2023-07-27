import { ScrollBehavior } from "../behavior/scrollBehavior";
import { Collision } from "../components/collisionComponent";
import { SpriteComponent } from "../components/spriteComponent";
import { Rectangle2D } from "../graphics/shapes2D/rectangle2D";
import { Vector2 } from "../math/vector2";
import { SimObject } from "../world/simObject";


export class Pipe {



	private _pipeObject: SimObject;
	private _childObject1: SimObject;
	private _childObject2: SimObject;

	private _childObject1Sprite: SpriteComponent;
	private _childObject1Rectangle: Rectangle2D;

	private _childObject3: SimObject;
	private _childObject4: SimObject;

	private _childObject4Sprite: SpriteComponent;
	private _childObject4Rectangle: Rectangle2D;



	private _width: number;
	private _height: number;

	constructor(width: number, height: number, pipeObject: SimObject, childObject1: SimObject, childObject2: SimObject, childObject3: SimObject, childObject4: SimObject) {

		this._width = width;
		this._height = height;

		this._pipeObject = pipeObject;
		this._childObject1 = childObject1;
		this._childObject2 = childObject2;
		this._childObject3 = childObject3;
		this._childObject4 = childObject4;

		this.init();


	}



	private init(): void {

		const calculate: Variables = this.calculateVariable();

		this._childObject1.transform.setPosition(0, 0);
		this._childObject1Sprite = new SpriteComponent("pipe_middle", "pipe_middle", 150, calculate.pipeHeight + calculate.variable, null);
		this._childObject1Rectangle = new Rectangle2D(150, calculate.pipeHeight + calculate.variable);
		this._childObject1.addComponent(this._childObject1Sprite);
		this._childObject1.addComponent(new Collision("pipe", this._childObject1Rectangle, true, null, false));


		this._childObject2.transform.setPosition(0, calculate.pipeHeight + calculate.variable + 60);
		this._childObject2.addComponent(new SpriteComponent("pipe_head", "pipe_head", 150, -60, null));
		this._childObject2.addComponent(new Collision("pipe", new Rectangle2D(150, -60), true, null, false));


		this._childObject3.transform.setPosition(0, this._height - (calculate.pipeHeight - calculate.variable + 60));
		this._childObject3.addComponent(new SpriteComponent("pipe_head", "pipe_head", 150, 60, null));
		this._childObject3.addComponent(new Collision("pipe", new Rectangle2D(150, 60), true, null, false));


		this._childObject4.transform.setPosition(0, this._height - calculate.pipeHeight + calculate.variable);
		this._childObject4Sprite = new SpriteComponent("pipe_middle", "pipe_middle", 150, calculate.pipeHeight - calculate.variable, null);
		this._childObject4Rectangle = new Rectangle2D(150, calculate.pipeHeight - calculate.variable);
		this._childObject4.addComponent(this._childObject4Sprite);
		this._childObject4.addComponent(new Collision("pipe", this._childObject4Rectangle, true, null, false));

	}



	public update(): void {
		
		const calculate: Variables = this.calculateVariable();

		this._pipeObject.transform.setPosition(this._width + 150, 0);



		this._childObject1Sprite.height = calculate.pipeHeight + calculate.variable;
		this._childObject1Rectangle.height = calculate.pipeHeight + calculate.variable;



		this._childObject2.transform.setPosition(0, calculate.pipeHeight + calculate.variable + 60);



		this._childObject3.transform.setPosition(0, this._height - (calculate.pipeHeight - calculate.variable + 60));



		this._childObject4.transform.setPosition(0, this._height - calculate.pipeHeight + calculate.variable);
		this._childObject4Sprite.height = calculate.pipeHeight - calculate.variable;
		this._childObject4Rectangle.height = calculate.pipeHeight - calculate.variable;




	}





	private calculateVariable(): Variables {
		let pipeHeight: number = (this._height / 2) - Math.max(270, Math.random() * 460);
		//console.log("pipeHeight", pipeHeight);

		let variable: number = Math.random() * 210;
		if (Math.random() > 0.5) {
			variable *= -1;
		}
		//console.log("variable", variable);

		return new Variables(pipeHeight, variable);
	}




} 


class Variables {
	public pipeHeight: number;
	public variable: number;

	constructor(pipeHeight: number, variable: number) {
		this.pipeHeight = pipeHeight;
		this.variable = variable;
	}
}