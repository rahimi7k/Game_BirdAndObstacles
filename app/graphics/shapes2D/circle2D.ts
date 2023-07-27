import { Vector2 } from "../../math/vector2";
import { IShape2D } from "./IShape2D";
import { Rectangle2D } from "./rectangle2D";


export class Circle2D implements IShape2D {

	public position: Vector2 = Vector2.zero;
	public origin: Vector2 = new Vector2(0.5, 0.5);
	public radius: number;

	public get offset(): Vector2 {
		return new Vector2(this.radius + (this.radius * this.origin.x), this.radius + (this.radius * this.origin.y));
		//return Vector2.zero;
	}


	public constructor(radius: number, position: Vector2 = Vector2.zero, origin: Vector2 = Vector2.zero) {
		this.radius = radius;
		this.position = position;
		this.origin = origin;
	}


	public intersects(other: IShape2D): boolean {

		if (other instanceof Circle2D) {
			let distance: number = Math.abs(Vector2.distance(other.position, this.position));
			let radiusLengths = this.radius + other.radius;
			if (distance <= radiusLengths) {
				return true;
			}

		} else if (other instanceof Rectangle2D) {
			//console.log("B");
			//console.log("other", other);
			//console.log("this", this, this.offset);
			let deltaX = this.position.x - Math.max(other.position.x, Math.min(this.position.x, other.position.x + other._width));
			let deltaY = this.position.y - Math.max(other.position.y, Math.min(this.position.y, other.position.y + other._height));
			if (((deltaX ** 2) + (deltaY ** 2)) < (this.radius ** 2)) {
				return true;
			}
		}



		return false;
	}



	public pointInShape(point: Vector2): boolean {

		let absDistance: number = Math.abs(Vector2.distance(this.position, point));
		if (absDistance <= this.radius) {
			return true;
		}

		return false;
	}



	public checkCollision(shape: Rectangle2D): boolean {

		return false;
	}



}