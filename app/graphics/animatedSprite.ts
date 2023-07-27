import { AssetManager, MESSAGE_ASSET_LOADER_ASSET_LOADED } from "../assets/assetManager";
import { ImageAsset } from "../assets/imageAssetLoader";
import { Vector2 } from "../math/vector2";
import { IMessageHandler } from "../message/IMessageHandler";
import { Message } from "../message/message";
import { MaterialManager } from "./materialManager";
import { Sprite } from "./sprite";



class UVInfo {
	public min: Vector2;
	public max: Vector2;

	public constructor(min: Vector2, max: Vector2) {
		this.min = min;
		this.max = max;
	}
}



export class AnimatedSprite extends Sprite implements IMessageHandler {

	private _frameHeight: number;
	private _frameWidth: number;
	private _frameCount: number;
	private _frameColumnCount: number;
	private _frameSequence: number[];
	private _currentFrame: number = 0;
	private _frameTime: number = 66;
	private _frameUVs: UVInfo[] = [];
	private _currentTime: number = 0;

	private _assetLoaded: boolean = false;
	private _assetWidth: number = 2;
	private _assetHeight: number = 2;
	private _isPlaying: boolean = true;


	/**
	 * Creates a neew sprite.
	 * @param name The name of this sprite
	 * @param materialName The name of the material to use with this sprite
	 * @param width The width of this sprite
	 * @param height The height of this sprite
	 * */
	public constructor(materialName: string, width: number = 100, height: number = 100, frameWidth: number = 10,
		frameHeight: number = 10, frameCount: number = 1,  frameColumnCount: number = 0, frameSequence: number[] = []) {
		super(materialName, width, height);

		this._frameHeight = frameHeight;
		this._frameWidth = frameWidth;
		this._frameHeight = frameHeight;
		this._frameCount = frameCount;
		this._frameColumnCount = frameColumnCount;
		this._frameSequence = frameSequence;

		//console.log(this._material);

		Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + this._material.diffuseTextureName, this);
		let asset = AssetManager.getAsset( this._material.diffuseTextureName);
		if (asset !== undefined) {
			let message: Message = new Message(MESSAGE_ASSET_LOADER_ASSET_LOADED + this._material.diffuseTextureName, null, asset);
			this.onMessage(message);

		}
	}

	public destroy(): void {
		super.destroy();
	}


	/**
	 *The message handler of this sprite
	 * @param message The message to be handled
	 * */
	public onMessage(message: Message): void {
		//console.log("messagemessage", message);

		if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this._material.diffuseTextureName) {
			this._assetLoaded = true;
			let asset = message.context as ImageAsset;
			this._assetWidth = asset.width;
			this._assetHeight = asset.height;
			this.calculateUVs();
		}

	}

	/**
	 * Inndicates if this animated sprite is currently playing.
	 * */
	public get isPlaying(): boolean {
		return this._isPlaying;
	}


	public play(): void {
		this._isPlaying = true;
	}

	public stop(): void {
		this._isPlaying = false;
	}

	public setFrame(frameNumber: number): void {
		if (frameNumber >= this._frameCount) {
			throw new Error("Frame is out of range:" + frameNumber + ", frame count: " + this._frameCount);
		}
		this._currentFrame = frameNumber;
	}



	public load(): void {
		super.load();

		if (!this._assetLoaded) {
			this.setupFromMaterial();
		}

	}


	public update(time: number): void {
		if (!this._assetLoaded) {
			this.setupFromMaterial();
			return;
		}


		if (!this._isPlaying) {
			return;
		}



		this._currentTime += time;
		if (this._currentTime > this._frameTime) {
			this._currentFrame++;
			this._currentTime = 0;


			if (this._currentFrame >= this._frameSequence.length) {
				this._currentFrame = 0;
			}


			let frameUVs: number = this._frameSequence[this._currentFrame];
			this._vertices[0].texCoords.copyFrom(this._frameUVs[frameUVs].min);
			this._vertices[1].texCoords = new Vector2(this._frameUVs[frameUVs].min.x, this._frameUVs[frameUVs].max.y);
			this._vertices[2].texCoords.copyFrom(this._frameUVs[frameUVs].max);
			this._vertices[3].texCoords.copyFrom(this._frameUVs[frameUVs].max);
			this._vertices[4].texCoords = new Vector2(this._frameUVs[frameUVs].max.x, this._frameUVs[frameUVs].min.y);
			this._vertices[5].texCoords.copyFrom(this._frameUVs[frameUVs].min);

			//Refrence
			/*this._vertices = [
				//x,y,z,  u,v
				new Vertex(0, 0, 0, 0, 0),
				new Vertex(0, this._height, 0, 0, 1.0),
				new Vertex(this._width, this._height, 0, 1.0, 1.0),

				new Vertex(this._width, this._height, 0, 1.0, 1.0),
				new Vertex(this._width, 0, 0, 1.0, 0),
				new Vertex(0, 0, 0, 0, 0)
			];*/



			this._buffer.clearData();

			this._buffer.upload(this._vertices);
			this._buffer.unbind();

		}

		super.update(time);
	}



	private calculateUVs(): void {

		let totalWidth: number = 0;
		let yValue: number = 0;
		for (let i = 0; i < this._frameCount; i++) {


			totalWidth = i * this._frameWidth;

			/*
			console.log("i", i);
			console.log("totalWidth", totalWidth);
			console.log("_assetWidth", this._assetWidth);
			console.log("_frameWidth", this._frameWidth);
			*/


			/*if (totalWidth > this._assetWidth) {
				yValue++;
				totalWidth = 0;
			}*/


			let u: number = (i * this._frameWidth) / this._assetWidth;
			let v: number = (yValue * this._frameHeight) / this._assetHeight;
			let min: Vector2 = new Vector2(u, v);


			let uMax: number = ((i * this._frameWidth) + this._frameWidth) / this._assetWidth;
			let vMax: number = ((yValue * this._frameHeight) + this._frameHeight) / this._assetHeight;
			let max: Vector2 = new Vector2(uMax, vMax);


			this._frameUVs.push(new UVInfo(min, max));


			if (yValue < this._frameColumnCount && i === this._frameCount - 1) {
				yValue++;
				totalWidth = 0;
				i = -1;
			}

		}
	}


	private setupFromMaterial(): void {
		if (!this._assetLoaded) {
			let material = MaterialManager.getMaterial(this._materialName);

			if (material.diffuseTexture.isLoaded && AssetManager.isAssetLoaded(material.diffuseTextureName)) {
				this._assetHeight = material.diffuseTexture.height;
				this._assetWidth = material.diffuseTexture.width;
				this._assetLoaded = true;
				this.calculateUVs();
			}
		}
	}


}