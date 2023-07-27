import { Vector2 } from "../../math/vector2";
import { Circle2D } from "./circle2D";
import { IShape2D } from "./IShape2D";


export class Rectangle2D implements IShape2D {

	public _width: number;
	public _height: number;

	public position: Vector2 = Vector2.zero;
	public origin: Vector2 = Vector2.zero;
	private _showLog: boolean;

	public get offset(): Vector2 {
		if (this._showLog) {
			console.log("this.width: " + this._width);
			console.log("this.height: " + this._height);
			console.log("this.origin: ", this.origin);
			console.log("offset: ", this._width * this.origin.x, this._height * this.origin.y);
		}
		return new Vector2(this._width * this.origin.x, this._height * this.origin.y);
	}


	public constructor(width: number, height: number, position: Vector2 = Vector2.zero, origin: Vector2 = Vector2.zero, log: boolean = false) {
		this._width = width;
		this._height = height;
		this.position = position;
		this.origin = origin;
		this._showLog = log;
	}



	public intersects(other: IShape2D): boolean {
		if (other instanceof Rectangle2D) {
			/*if (this.pointInShape(other.position, 1) ||
				this.pointInShape(new Vector2(other.position.x + other.width, other.position.y), 2) ||
				this.pointInShape(new Vector2(other.position.x + other.width, other.position.y + other.height), 3) ||
				this.pointInShape(new Vector2(other.position.x, other.position.y + other.height), 4)) {

				return true;
			}*/


			if (this.checkCollision(other)) {
				return true;
			}


		} else if (other instanceof Circle2D) {
			//Wrong solution
			/*if (other.pointInShape(this.position) ||
				other.pointInShape(new Vector2(this.position.x + this.width, this.position.y)) ||
				other.pointInShape(new Vector2(this.position.x + this.width, this.position.y + this.height)) ||
				other.pointInShape(new Vector2(this.position.x, this.position.y + this.height))) {

				return true; 
			}*/
			let deltaX = other.position.x - Math.max(this.position.x, Math.min(other.position.x, this.position.x + this._width));
			let deltaY = other.position.y - Math.max(this.position.y, Math.min(other.position.y, this.position.y + this._height));
			if ((deltaX * deltaX + deltaY * deltaY) < (other.radius * other.radius)) {
				return true;
			}

		}


		return false;
	}



	public pointInShape(point: Vector2, number: number): boolean {
		//Wrong for negetive
		/*if (this.position.x <= point.x && point.x <= this.position.x + this.width &&
			this.position.y <= point.y && point.y <= this.position.y + this.height) {
			return true;
		}*/

		let x: number = this._width < 0 ? this.position.x - this._width : this.position.x;
		let y: number = this._height < 0 ? this.position.y - this._height : this.position.y;

		let extentX: number = this._width < 0 ? this.position.x : this.position.x + this._width;
		let extentY: number = this._height < 0 ? this.position.y : this.position.y + this._height;


		/*if (number === 1) {
			console.log("x", x);
			console.log("y", y);

			console.log("extentX", extentX);
			console.log("extentY", extentY);
		}

		console.log("point.x-" + number, point.x);
		console.log("point.y-" + number, point.y);
		console.log(point.x >= x && point.x <= extentX && point.y >= y && point.y <= extentY);*/

		if (point.x >= x && point.x <= extentX && point.y >= y && point.y <= extentY) {
			return true;
		}

		return false;
	}


	public checkCollision(shape: Rectangle2D): boolean {

		let x: number = this._width < 0 ? this.position.x - this._width : this.position.x;
		let y: number = this._height < 0 ? this.position.y - this._height : this.position.y;

		let extentX: number = this._width < 0 ? this.position.x : this.position.x + this._width;
		let extentY: number = this._height < 0 ? this.position.y : this.position.y + this._height;


		/*if (((x >= shape.position.x && x <= shape.position.x + shape.width) || (extentX >= shape.position.x && extentX <= shape.position.x + shape.width) ||
			(x >= shape.position.x && extentX <= shape.position.x + shape.width)) &&
			((y >= shape.position.y && y <= shape.position.y + shape.height) || (extentY >= shape.position.y && extentY <= shape.position.y + shape.height) ||
			(y >= shape.position.y && extentY <= shape.position.y + shape.height))) {
			return true;
		}*/


		let otherX: number = shape.position.x;
		let otherY: number = shape.position.y;

		let otherExtentX: number = shape.position.x + shape._width;
		let otherExtentY: number = shape.position.y + shape._height;

		if (
			((otherX <= x && x <= otherExtentX) && (otherY <= y && y <= otherExtentY)) ||//POINT 1 - (x,y)
			((otherX <= extentX && extentX <= otherExtentX) && (otherY <= y && y <= otherExtentY)) ||//POINT 2 - (extentX,y)
			((otherX <= x && x <= otherExtentX) && (otherY <= extentY && extentY <= otherExtentY)) ||//POINT 3 - (x,extentY)
			((otherX <= extentX && extentX <= otherExtentX) && (otherY <= extentY && extentY <= otherExtentY)) ||//POINT 4 - (extentX,extentY)
			((y <= otherY && otherExtentY <= extentY) && ((otherX <= x && x <= otherExtentX) || (otherX <= extentX && extentX <= otherExtentX))) ||//LineX
			((x <= otherX && otherExtentX <= extentX) && ((otherY <= y && y <= otherExtentY) || (otherY <= extentY && extentY <= otherExtentY)) ||//LineY
			((x <= otherX && otherExtentX <= extentX) && (y <= otherY && otherExtentY <= extentY)) ||//Cover Other
			((otherX <= x && extentX <= otherExtentX) && (otherY <= y && extentY <= otherExtentY)))//Cover Original
		) {
			return true;
		}



		return false;
	}






	public set width(value: number) {
		this._width = value;
	}

	public set height(value: number) {
		this._height = value;
	}




}