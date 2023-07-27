import { Vector2 } from "../../math/vector2";
import { Rectangle2D } from "./rectangle2D";

export interface IShape2D {

	position: Vector2;
	origin: Vector2;

	readonly offset: Vector2;

	intersects(other: IShape2D): boolean;
	pointInShape(point: Vector2, number?: number): boolean;
	checkCollision(point: Rectangle2D): boolean;

}