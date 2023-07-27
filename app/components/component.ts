import { Shader } from "../gl/shader";
import { SimObject } from "../world/simObject";


export abstract class Component {

	protected _object: SimObject;
	protected _name: string;
	protected _isRemoved: boolean = false

	public constructor() {
	}

	public destroy(): void {
		this._isRemoved = true;
	} 

	public get name(): string {
		return this._name;
	}

	public get object(): SimObject {
		return this._object;
	}

	public setOwner(object: SimObject): void {
		this._object = object;
	}

	public load(): void {

	}

	public updateReady(): void {

	}

	public update(time: number): void {

	} 

	public render(shader: Shader): void {

	} 



}