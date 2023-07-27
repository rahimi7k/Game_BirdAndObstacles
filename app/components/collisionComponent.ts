/// <reference path="../graphics/bitmapFont.ts" />
import { CollisionManager } from "../collision/collisionManager";
import { Shader } from "../gl/shader";
import { Circle2D } from "../graphics/shapes2D/circle2D";
import { IShape2D } from "../graphics/shapes2D/IShape2D";
import { Component } from "./component";





export class Collision extends Component {

	private _shape: IShape2D;
	private _static: boolean;

	private _delegate: (d: any) => void;
	private _showLog: boolean;




	public constructor(name: string, shape: IShape2D, isStatic: boolean, delegate: (data: any) => void, log: boolean = false) {
		super();

		this._name = name;
		this._shape = shape;
		this._static = isStatic;
		this._delegate = delegate;
		this._showLog = log;

	}

	public get shape(): IShape2D {
		return this._shape;
	}

	public get isStatic(): boolean {
		return this._static;
	}


	public load(): void {
		super.load();

		//this._shape.position.copyFrom(this.owner.getWorldPosition().toVector2().subtract(this._shape.offset));
		if (this._name === "bird") {
			CollisionManager.registerMain(this);
		} else {
			CollisionManager.register(this);
		}

	}


	public update(time: number): void {

		if (this._isRemoved) {
			return;
		}

		//TODO- Update this to handle nested objects - get world position.
		//this._shape.position.copyFrom(this.owner.transform.position.toVector2().add(this._shape.offset));
		//this._shape.position.copyFrom(this.owner.transform.position.toVector2());

		if (this._name === "bird") {
			/*console.log("getWorldPosition", this.owner.getWorldPosition().toVector2());//X,Y center location of the object in page
			console.log("offset", this._shape.offset);//X,Y center of the object
			console.log("getWorldPosition - subtract", this.owner.getWorldPosition().toVector2().subtract(this._shape.offset));//X,y location of top left*/
		}

		this._shape.position.copyFrom(this.object.getWorldPosition().toVector2().subtract(this._shape.offset));


		super.update(time);
	}



	public render(shader: Shader) {
		//this._sprite.draw(shader, this.owner.worldMatrix);//worldMatrix as model
		if (this._isRemoved) {
			return;
		}


		super.render(shader);
	}



	public onCollisionEntry(other: Collision): void {
		//console.log("onCollisionEntry", this, other);
		if (this._delegate != null) {
			this._delegate(this._name);
		}
	}

	public onCollisionUpdate(other: Collision): void {
		//console.log("onCollisionUpdate", this, other);

	}

	public onCollisionExit(other: Collision): void {
		//console.log("onCollisionExit", this, other);

	}


}
