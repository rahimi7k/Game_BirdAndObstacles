import { Vector3 } from "../math/vector3";
import { Behavior } from "./behavior";



export class RotationBehavior extends Behavior {

	private _rotation: Vector3;

	public constructor(rotation: Vector3) {
		super();

		this._rotation = rotation;
	}


	public update(time: number): void {
		this._owner.transform.rotation.add(this._rotation);

		super.update(time);
	}


}