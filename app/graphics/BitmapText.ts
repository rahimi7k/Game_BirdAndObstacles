import { gl } from "../gl/gl";
import { AttributeInfo, GLBuffer } from "../gl/glBuffer";
import { Shader } from "../gl/shader";
import { Matrix4x4 } from "../math/matrix4x4";
import { Vector3 } from "../math/vector3";
import { BitmapFont } from "./bitmapFont";
import { BitmapFontManager } from "./bitmapFontManager";
import { Color } from "./color";
import { Material } from "./material";
import { Vertex } from "./Vertex";


export class BitmapText {

	private _fontName: string;
	private _isDirty: boolean = false;

	protected _name: string;
	protected _origin: Vector3 = Vector3.zero;

	protected _buffer: GLBuffer;
	protected _material: Material;
	protected _bitmapFont: BitmapFont;
	protected _vertices: Vertex[] = [];
	protected _text: string;


	public constructor(name: string, fontName: string) {
		this._name = name;
		this._fontName = fontName;
	}


	public destroy(): void {
		this._buffer.destroy();
		this._material.destroy();
		this._material = undefined;
	}


	public get name(): string {
		return this._name;
	}


	public get text(): string {
		return this._text;
	}

	public set text(value: string) {
		if (this._text !== value) {
			this._text = value;
			this._isDirty = true;
		}
	}

	public get origin(): Vector3 {
		return this._origin;
	}

	public set origin(value: Vector3) {
		this._origin = value;
		this.calculateVertices();
	}


	public load(): void {
		this._bitmapFont = BitmapFontManager.getFont(this._fontName);

		this._material = new Material(`BITMAP_FONT_${this.name}_${this._bitmapFont.size}`, this._bitmapFont.textureName, Color.white());

		this._buffer = new GLBuffer();

		let positionAttribute = new AttributeInfo();
		positionAttribute.location = 0;
		positionAttribute.size = 3;
		this._buffer.addAttributeLocation(positionAttribute);


		let textCoordAttribute = new AttributeInfo();
		textCoordAttribute.location = 1;
		textCoordAttribute.size = 2;
		this._buffer.addAttributeLocation(textCoordAttribute);

	}



	public update(time: number): void {
		if (this._isDirty && this._bitmapFont.isLoaded) {
			this.calculateVertices();
			this._isDirty = false;
		}
	}




	public draw(shader: Shader, model: Matrix4x4): void {
		let modelLocation = shader.getUniformLocation("u_model");
		gl.uniformMatrix4fv(modelLocation, false, model.toFloat32Array());

		let colorLocation = shader.getUniformLocation("u_tint");
		gl.uniform4fv(colorLocation, this._material.tint.toFloat32Array());

		if (this._material.diffuseTexture !== undefined) {
			this._material.diffuseTexture.activateAndBind(0);
			let diffuseLocation = shader.getUniformLocation("u_diffuse");
			gl.uniform1i(diffuseLocation, 0);
		}

		this._buffer.bind();
		this._buffer.draw();
	}




	private calculateVertices(): void {
		this._vertices.length = 0;
		this._buffer.clearData();

		let x: number = 0;
		let y: number = 0;

		for (let c of this._text) {
			if (c === '\n') {
				x = 0;
				y += this._bitmapFont.size;
				continue;
			}

			let g = this._bitmapFont.getGlyph(c);

			let minX: number = x + g.xOffset;
			let minY: number = y + g.yOffset;

			let maxX: number = minX + g.width;
			let maxY: number = minY + g.height;

			let minU = g.x / this._bitmapFont.imageWidth;
			let minV = g.y / this._bitmapFont.imageheight;

			let maxU = (g.x + g.width) / this._bitmapFont.imageWidth;
			let maxV = (g.y + g.height) / this._bitmapFont.imageheight;


			this._vertices.push(new Vertex(minX, minY, 0, minU, minV));
			this._vertices.push(new Vertex(minX, maxY, 0, minU, maxV));
			this._vertices.push(new Vertex(maxX, maxY, 0, maxU, maxV));
			this._vertices.push(new Vertex(maxX, maxY, 0, maxU, maxV));
			this._vertices.push(new Vertex(maxX, minY, 0, maxU, minV));
			this._vertices.push(new Vertex(minX, minY, 0, minU, minV));

			x += g.xAdvance;
		}

		this._buffer.upload(this._vertices);
		this._buffer.unbind();
	}





}