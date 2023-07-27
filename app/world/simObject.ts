import { Behavior } from "../behavior/behavior";
import { Component } from "../components/component";
import { Shader } from "../gl/shader";
import { Matrix4x4 } from "../math/matrix4x4";
import { Transform } from "../math/transform";
import { Vector3 } from "../math/vector3";



export class SimObject {

	private _id: number;
	private _children: SimObject[] = [];
	private _parent: SimObject;
	private _isLoaded: boolean = false;
	private _components: Component[] = [];
	private _behaviors: Behavior[] = [];
	private _delegate:() => void;



	private _isRemoved: boolean = false;
	private _isenable: boolean = true;

	private _worldMatrix: Matrix4x4 = Matrix4x4.identity();

	public name: string;
	public transform: Transform = new Transform();


	public constructor(id: number, name: string) {
		this._id = id;
		this.name = name;
	}


	public active(): boolean {
		return this._isenable;
	}
	public isActive(isActive: boolean): void {
		this._isenable = isActive;
	}


	public destroy(): void {
		this._isRemoved = true;

		for (let c of this._components) {
			c.destroy();
		}

		for (let c of this._children) {
			c.destroy();
		}
	}



	public get id(): number {
		return this._id;
	}

	public get parent(): SimObject {
		return this._parent;
	}

	public get worldMatrix(): Matrix4x4 {
		return this._worldMatrix;
	}

	public get isLoaded(): boolean {
		return this._isLoaded;
	}





	public addChild(child: SimObject): void {
		child._parent = this;
		this._children.push(child);
	}

	public removeChild(child: SimObject): void {
		let index = this._children.indexOf(child)
		if (index !== -1) {
			child._parent = undefined;
			this._children.splice(index, 1);
		}
	}


	public addComponent(component: Component): void {
		component.setOwner(this);
		this._components.push(component);
	}


	public addBehavior(behavior: Behavior): void {
		behavior.setOwner(this);
		this._behaviors.push(behavior);
	}


	public addDelegate(delegate: () => void): void {
		this._delegate = delegate;
	}

	public removeDelegate(): void {
		this._delegate = null;
	}


	public load(): void {
		this._isLoaded = true;

		for (let c of this._components) {
			c.load();
		}

		for (let c of this._children) {
			c.load();
		}
	}


	public updateReady(): void {
		for (let c of this._components) {
			c.updateReady();
		}

		for (let b of this._behaviors) {
			b.updateReady();
		}

		for (let c of this._children) {
			c.updateReady();
		}
	}


	public update(time: number): void {


		if (!this._isenable || this._isRemoved) {
			return;
		}


		if (this._parent !== undefined) {

			if (this.name === "bird") {
				/*console.log("this._parent.worldMatrix", this._parent.worldMatrix);
				console.log("this.transform.getTransformationMatrix()", this.transform.getTransformationMatrix());*/
			}

			this._worldMatrix = Matrix4x4.multiply(this._parent.worldMatrix, this.transform.getTransformationMatrix());
		} else {
			this._worldMatrix.copyFrom(this.transform.getTransformationMatrix());
		}

		for (let c of this._components) {
			c.update(time);
		}

		for (let b of this._behaviors) {
			b.update(time);
		}

		for (let c of this._children) {
			c.update(time);
		}

		if (this._delegate != null) {
			this._delegate();
		}


	}


	public render(shader: Shader): void {
		if (!this._isenable || this._isRemoved) {
			return;
		}

		for (let c of this._components) {
			c.render(shader);
		}

		for (let c of this._children) {
			c.render(shader);
		}
	}



	/** Returns the world position of this entity. */
	public getWorldPosition(): Vector3 {
		return new Vector3(this._worldMatrix.data[12], this._worldMatrix.data[13], this._worldMatrix.data[14]);
	}





	//Get Names
	public getComponentByName(name: string): Component {
		for (let component of this._components) {
			if (component.name === name) {
				return component;
			}
		}

		for (let child of this._children) {
			let component = child.getComponentByName(name);
			if (component !== undefined) {
				return component;
			}
		}

		return undefined;
	}


	public getBehaviorByName(name: string): Behavior {
		for (let behavior of this._behaviors) {
			if (behavior.name === name) {
				return behavior;
			}
		}

		for (let child of this._children) {
			let behavior = child.getBehaviorByName(name);
			if (behavior !== undefined) {
				return behavior;
			}
		}

		return undefined;
	}


	public getObjectByName(name: string): SimObject {
		if (this.name === name) {
			return this;
		}

		for (let child of this._children) {
			let result = child.getObjectByName(name);
			if (result !== undefined) {
				return result;
			}
		}

		return undefined;
	}




}
