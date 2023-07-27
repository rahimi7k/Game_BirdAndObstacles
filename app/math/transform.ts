import { Matrix4x4 } from "./matrix4x4";
import { Vector3 } from "./vector3";


export class Transform {

	public position: Vector3 = Vector3.zero;
	public rotation: Vector3 = Vector3.zero;
	public scale: Vector3 = Vector3.one;


	public copyFrom(transform: Transform): void {
		this.position.copyFrom(transform.position);
		this.rotation.copyFrom(transform.position);
		this.scale.copyFrom(transform.position);
	}

	public getTransformationMatrix(): Matrix4x4 {
		const translation: Matrix4x4 = Matrix4x4.translation(this.position);
		const rotation: Matrix4x4 = Matrix4x4.rotationXYZ(this.rotation.x, this.rotation.y, this.rotation.z);
		const scale: Matrix4x4 = Matrix4x4.scale(this.scale);

		//T * R * S
		return Matrix4x4.multiply(Matrix4x4.multiply(translation, rotation), scale);
	}


	public setPosition(x: number = 0, y: number = 0, z: number = 0) {
		this.position.x = x;
		this.position.y = y;
		this.position.z = z;
	}

	public setRotation(x: number = 0, y: number = 0, z: number = 0) {
		this.rotation.x = x;
		this.rotation.y = y;
		this.rotation.z = z;
	}

	public setScale(x: number = 1, y: number = 1, z: number = 1) {
		this.scale.x = x;
		this.scale.y = y;
	}

}
