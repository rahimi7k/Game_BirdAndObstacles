import { unlinkSync } from "fs";
import { AssetManager, MESSAGE_ASSET_LOADER_ASSET_LOADED } from "../assets/assetManager";
import { ImageAsset } from "../assets/imageAssetLoader";
import { gl } from "../gl/gl";
import { IMessageHandler } from "../message/IMessageHandler";
import { Message } from "../message/message";


const LEVEL: number = 0;
const BORDER: number = 0;
const TEMP_IMAGE_DATA: Uint8Array = new Uint8Array([255, 255, 255, 255]); //One pixel white



export class Texture implements IMessageHandler {

	private _name: string;
	private _texture: WebGLTexture;
	private _isLoaded: boolean = false;
	private _width: number;
	private _height: number;


	public constructor(name: string, width: number = 1, height: number = 1) {
		this._name = name;
		this._width = width;
		this._height = height;


		this._texture = gl.createTexture();

		//I do not know why he called an empty texture first
		//this.bind();
		//gl.texImage2D(gl.TEXTURE_2D, LEVEL, gl.RGBA, 1, 1, BORDER, gl.RGBA, gl.UNSIGNED_BYTE, TEMP_IMAGE_DATA);

		let asset: ImageAsset = AssetManager.getAsset(this.name) as ImageAsset;
		if (asset !== undefined) {
			this.loadTextureFromAsset(asset);
		} else {
			Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + this._name, this);
		}
	}

	public destroy(): void {
		gl.deleteTexture(this._texture);
	}


	public onMessage(message: Message): void {
		if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this._name) {
			this.loadTextureFromAsset(message.context as ImageAsset);
		}
	}


	private loadTextureFromAsset(asset: ImageAsset): void {
		//console.log("asset", asset);
		this._width = asset.width;
		this._height = asset.height;

		this.bind();
		gl.texImage2D(gl.TEXTURE_2D, LEVEL, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, asset.data);

		if (this.isPowerOf2()) {
			gl.generateMipmap(gl.TEXTURE_2D);
		} else {
			// Do not generate a mip map and clamp wrapping to edge
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);//WebGL use S,T INSTEAD OF U,V
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		}

		//TODO Set texture filtering based on configuration
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);


		this._isLoaded = true;
	}


	private isPowerOf2(): boolean {
		return (this.isValuePowerOf2(this._width) && this.isValuePowerOf2(this._height));
	}


	private isValuePowerOf2(value: number): boolean {
		return (value & (value - 1)) === 0;
	}





	public activateAndBind(textureUnit: number = 0): void {
		gl.activeTexture(gl.TEXTURE0 + textureUnit)
		this.bind();
	}


	private bind(): void {
		gl.bindTexture(gl.TEXTURE_2D, this._texture);
	}


	private unbind(): void {
		gl.bindTexture(gl.TEXTURE_2D, undefined);
	}




	public get name(): string {
		return this._name;
	}

	public get isLoaded(): boolean {
		return this._isLoaded;
	}

	public get width(): number {
		return this._width;
	}

	public get height(): number {
		return this._height;
	}




}
