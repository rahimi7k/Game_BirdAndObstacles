import { Shader } from "../gl/shader";
import { BitmapText } from "../graphics/BitmapText";
import { Vector3 } from "../math/vector3";
import { Component } from "./component";


export class BitmapTextComponent extends Component {

	private _bitmapText: BitmapText;
	private _fontName: string;

	public constructor(name: string, fontName: string, text: string, origin: Vector3 = Vector3.zero) {
		super();

		this._name = name;
		this._fontName = fontName;
		this._bitmapText = new BitmapText(this.name, this._fontName);
		if (!origin.equels(Vector3.zero)) {
			this._bitmapText.origin.copyFrom(origin);
		}
		this._bitmapText.text = text;
	}


	public load(): void {
		this._bitmapText.load();
	}


	public update(time: number): void {
		this._bitmapText.update(time);
	}

	public render(shader: Shader): void {
		this._bitmapText.draw(shader, this.object.worldMatrix);
		super.render(shader);
	}


	public text(text: string): void {
		this._bitmapText.text = text;
	}

}