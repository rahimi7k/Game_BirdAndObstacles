import { gl } from "../gl/gl";
import { AttributeInfo, GLBuffer } from "../gl/glBuffer";
import { Shader } from "../gl/shader";
import { Matrix4x4 } from "../math/matrix4x4";
import { Vector3 } from "../math/vector3";
import { Zone } from "../world/zone";
import { Material } from "./material";
import { MaterialManager } from "./materialManager";
import { Texture } from "./texture";
import { TextureManager } from "./TextureManager";
import { Vertex } from "./Vertex";


export class Sprite {

	protected _materialName: string;
	protected _width: number;
	protected _height: number;
	protected _origin: Vector3 = Vector3.zero;//new Vector3(0.5, 0.5, 0);//Position of rotation 0.5, 0.5 are in the center


	protected _buffer: GLBuffer;
	protected _material: Material;
	protected _vertices: Vertex[];


	private _modelLocation: WebGLUniformLocation;
	private _colorLocation: WebGLUniformLocation;
	private _diffuseLocation: WebGLUniformLocation;


	private _dayNightEffect: boolean = true;

	/**
	 * Creates a neew sprite.
	 * @param name The name of this sprite
	 * @param materialName The name of the material to use with this sprite
	 * @param width The width of this sprite
	 * @param height The height of this sprite
	 * */
	public constructor(materialName: string, width: number = 100, height: number = 100) {
		this._materialName = materialName;
		this._width = width;
		this._height = height;

		this._material = MaterialManager.getMaterial(this._materialName);
	}


	public destroy(): void {
		this._buffer.destroy();
		//MaterialManager.releaseMaterial(this._materialName);
		this._material = undefined;
		this._materialName = undefined;
	}


	/**
	 * Performs loading routines on this sprite
	 * */
	public load(): void {
		this._buffer = new GLBuffer(); // 3 + 2

		let positionAttribute: AttributeInfo = new AttributeInfo();
		positionAttribute.location = 0; //this._shader.getAttributeLocation("a_position"); //It is zero'th attribute
		positionAttribute.size = 3;
		this._buffer.addAttributeLocation(positionAttribute);


		let textCoorAttribute: AttributeInfo = new AttributeInfo();
		textCoorAttribute.location = 1;
		textCoorAttribute.size = 2;
		this._buffer.addAttributeLocation(textCoorAttribute);



		const minX: number = - (this._width * this.origin.x);
		const maxX: number = this._width * (1.0 - this.origin.x);
		const minY: number = - (this._height * this.origin.y);
		const maxY: number = this._height * (1.0 - this.origin.y);

		this._vertices = [
			//x,y,z,  u,v
			new Vertex(minX, minY, 0, 0, 0),
			new Vertex(minX, maxY, 0, 0, 1.0),
			new Vertex(maxX, maxY, 0, 1.0, 1.0),

			new Vertex(maxX, maxY, 0, 1.0, 1.0),
			new Vertex(maxX, minY, 0, 1.0, 0),
			new Vertex(minX, minY, 0, 0, 0)
		];

		this._buffer.upload(this._vertices);
		//this._buffer.unbind(); //Because we may have another buffer to bind so, after draw remove buffer
	}



	public update(time: number): void {

	}


	public draw(shader: Shader, worldMatrix: Matrix4x4): void {

		//Set uniform locations
		if (this._modelLocation == null) {
			this._modelLocation = shader.getUniformLocation("u_model");

			this._colorLocation = shader.getUniformLocation("u_tint");
			if (this._material.diffuseTexture !== undefined) {
				this._diffuseLocation = shader.getUniformLocation("u_diffuse");
			}
		}

		//Set uniforms values
		gl.uniformMatrix4fv(this._modelLocation, false, worldMatrix.toFloat32Array());


		if (this._dayNightEffect) {
			gl.uniform4f(this._colorLocation, Zone.dayLightCoefficient, Zone.dayLightCoefficient, Zone.dayLightCoefficient, 1);

		} else {
			gl.uniform4fv(this._colorLocation, this._material.tint.toFloat32Array());//v means vector, get a vector in second parameter, instead of 4 value
		}


		if (this._material.diffuseTexture !== undefined) {
			this._material.diffuseTexture.activateAndBind(0);
			gl.uniform1i(this._diffuseLocation, 0);
		}

		if (this._materialName === "bird") {
			this._buffer.bind(/*false, true*/);
			this._buffer.draw(/*true*/);
		} else {
			this._buffer.bind();//Detect buffer and attibitues position and location
			this._buffer.draw();
		}

		this._buffer.unbind();
	}





	private recalculate(): void {

		//Recalculate vertices
		let minX: number = - (this._width * this.origin.x);
		let maxX: number = this._width * (1.0 - this.origin.x);
		let minY: number = - (this._height * this.origin.y);
		let maxY: number = this._height * (1.0 - this.origin.y);

		this._vertices[0].position.set(minX, minY);
		this._vertices[1].position.set(minX, maxY);
		this._vertices[2].position.set(maxX, maxY);
		this._vertices[3].position.set(maxX, maxY);
		this._vertices[4].position.set(maxX, minY);
		this._vertices[5].position.set(minX, minY);

		this._buffer.clearData();

		this._buffer.upload(this._vertices);
		//this._buffer.unbind();
	}




	public get width(): number {
		return this._width;
	}

	public get height(): number {
		return this._height;
	}

	public get origin(): Vector3 {
		return this._origin;
	}



	public set width(value: number) {
		this._width = value;

		this.recalculate();
	}

	public set height(value: number) {
		this._height = value;

		this.recalculate();
	}

	public set origin(value: Vector3) {
		this._origin = value;

		this.recalculate();
	}


	public widthAndHeight(width: number, height: number) {
		this._width = width;
		this._height = height;

		this.recalculate();
	}



	public get material() {
		return this._material;
	}



	public set dayNightEffect(isEnable: boolean) {
		this._dayNightEffect = isEnable;
	}



}