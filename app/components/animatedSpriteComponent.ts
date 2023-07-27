import { Shader } from "../gl/shader";
import { AnimatedSprite } from "../graphics/animatedSprite";
import { Vector3 } from "../math/vector3";
import { Component } from "./component";




export class AnimatedSpriteComponent extends Component {

	private _autoPlay: boolean;
	private _sprite: AnimatedSprite;

	private _frameTime: number = 200;
	private _currentTime: number = 0;


	public constructor(name: string, materialName: string, frameWidth: number, frameHeight: number, frameCount: number, frameColumnCount: number, frameSequence: number[], autoPlay: boolean = true, origin?: Vector3) {
		super();

		this._name = name;
		this._autoPlay = autoPlay;
		this._sprite = new AnimatedSprite(materialName, frameWidth, frameHeight, frameWidth, frameHeight, frameCount, frameColumnCount, frameSequence);
		if (origin != null && !origin.equels(Vector3.zero)) {
			this._sprite.origin.copyFrom(origin);
		}
	}


	public get isPlaying(): boolean {
		return this._sprite.isPlaying;
	}


	public load(): void {
		this._sprite.load();
	}


	public updateReady(): void {
		if (!this._autoPlay) {
			this._sprite.stop();
		}
	}

	public update(time: number): void {
		this._sprite.update(time);
		super.update(time);


		this._currentTime += time;
		if (this._currentTime > this._frameTime) {
			this._currentTime = 0;

			let isNegetive: boolean = Math.random() > 0.5;
			let change: number = Math.random() * 2;
			if (isNegetive) {
				change *= -1;
			}

			//this._owner.transform.position.x += change;
			//this._owner.transform.position.y += change;
		}



	}


	public render(shader: Shader) {
		this._sprite.draw(shader, this.object.worldMatrix);//worldMatrix as model 

		super.render(shader);
	}



	public play(): void {
		this._sprite.play();
	}

	public stop(): void {
		this._sprite.stop();
	}

	public setFrame(frameNumber: number): void {
		this._sprite.setFrame(frameNumber);
	}


}
