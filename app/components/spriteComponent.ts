import { Shader } from "../gl/shader";
import { Sprite } from "../graphics/sprite";
import { Vector3 } from "../math/vector3";
import { Component } from "./component";

export class SpriteComponent extends Component {

	private _sprite: Sprite;

	public constructor(name: string, materialName: string, width: number, height: number, origin: Vector3) {
		super();

		this._name = name;
		this._sprite = new Sprite(materialName, width, height);

		if (origin != null) {
			this._sprite.origin.copyFrom(origin);
		}

	}


	public load(): void {

		if (this._isRemoved) {
			return;
		}

		this._sprite.load();
	}



	public render(shader: Shader) {

		if (this._isRemoved) {
			return;
		}

		this._sprite.draw(shader, this.object.worldMatrix);//worldMatrix as model

		super.render(shader);
	}




	public set width(value: number) {
		this._sprite.width = value;
	}

	public set height(value: number) {
		this._sprite.height = value;
	}




	public set dayNightEffect(isEnable: boolean) {
		this._sprite.dayNightEffect = isEnable;
	}


	public get sprite(): Sprite {
		return this._sprite;
	}





}
