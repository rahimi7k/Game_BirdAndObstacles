import { AudioManager } from "../audio/audioManager";
import { ScrollBehavior } from "../behavior/scrollBehavior";
import { Collision } from "../components/collisionComponent";
import { SpriteComponent } from "../components/spriteComponent";
import { Color } from "../graphics/color";
import { Rectangle2D } from "../graphics/shapes2D/rectangle2D";
import { MouseContext } from "../input/inputManager";
import { Vector2 } from "../math/vector2";
import { Vector3 } from "../math/vector3";
import { IMessageHandler } from "../message/IMessageHandler";
import { Message } from "../message/message";
import { SimObject } from "../world/simObject";
import { BitmapTextComponent } from "./bitmapTextComponent";


export class Input implements IMessageHandler {



	public object: SimObject;
	private sprite: SpriteComponent;

	private _isMouseOn: boolean = false;
	private _isOnInput: boolean = false;
	private _text: string = "";
	private _limit: number = 0;
	private _bitmap: BitmapTextComponent;

	private _delegate: (text: string) => void;


	private _width: number;
	private _height: number;

	constructor(parent: SimObject, globalId: number, width: number, height: number, materialName: string, isActive: boolean, defaultText: string = "", limit: number = 10) {

		this._width = width;
		this._height = height;
		this._limit = limit;

		this.init(parent, globalId, materialName, isActive, defaultText);


		Message.subscribe("Mouse_Move", this);
		Message.subscribe("MOUSE_UP", this);
		Message.subscribe("Key_Press", this);
	}


	public onMessage(message: Message): void {
		if (message.code === "Mouse_Move") {
			this.onMove(message.context);
		} else if (message.code === "MOUSE_UP") {
			this.onClick(message.context);
		} else if (message.code === "Key_Press") {
			this.onKeyPress(message.context);
		}

		
		
	}


	public setDelegate(delegate: (text: string) => void): void {
		this._delegate = delegate;
	}



	private onKeyPress(event: any): void {
		if (this._isOnInput) {
			console.log(event);
			AudioManager.play("key_press");


			if (event.keyCode === 8) { //Backspace
				this._text = this._text.slice(0, this._text.length - 1);
				this._bitmap.text(this._text);
				if (this._delegate != null) {
					this._delegate(this._text);
				}

			} else {
				if (this._text.length > this._limit) {
					return;
				}

				if (32 <= event.keyCode && event.keyCode <= 126) {
					this._text += event.key;
					this._bitmap.text(this._text);
					if (this._delegate != null) {
						this._delegate(this._text);
					}				}
			}


		}
	}



	private init(parent: SimObject, globalId: number, materialName: string, isActive: boolean, defaultText: string): void {


		this.object = new SimObject(globalId, materialName);
		this.sprite = new SpriteComponent(materialName, materialName, this._width, this._height, new Vector3(0.5, 0.5));
		this.sprite.dayNightEffect = false;
		this.object.addComponent(this.sprite);



		const textObject: SimObject = new SimObject(++globalId, "text");
		textObject.transform.setPosition(-(this._width / 2) + 15, -(this._height / 2) + 15);
		this._bitmap = new BitmapTextComponent("text1", "default", defaultText);
		textObject.addComponent(this._bitmap);
		this.object.addChild(textObject);





		if (!isActive) {
			this.object.isActive(false);
		}
		parent.addChild(this.object);
	}









	private onMove(event: any): void {

		if (!this.object.active()) {
			return;
		}

		const offset: Vector2 = new Vector2(this._width * 0.5, this._height * 0.5);
		let worldMatrix: Vector3 = this.object.getWorldPosition();
		worldMatrix.x -= offset.x;
		worldMatrix.y -= offset.y;

		if (worldMatrix.x < event.x && event.x < worldMatrix.x + this._width &&
			worldMatrix.y < event.y && event.y < worldMatrix.y + this._height) {
			if (this._isMouseOn) {
				return;
			}

			this._isMouseOn = true;
			this.sprite.sprite.material.tint = new Color(200, 200, 200, 230);

		} else {
			if (!this._isMouseOn) {
				return;
			}

			this._isMouseOn = false;
			if (this._isOnInput) {
				this.sprite.sprite.material.tint = new Color(220, 220, 220, 240);
			} else {
				this.sprite.sprite.material.tint = new Color(255, 255, 255, 255);
			}
		}
	}





	private onClick(event: MouseContext): void {
		//			AudioManager.play("onButtonClick");
		if (!this.object.active()) {
			return;
		}

		if (event.leftDown) {

			const offset: Vector2 = new Vector2(this._width * 0.5, this._height * 0.5);
			let worldMatrix: Vector3 = this.object.getWorldPosition();
			worldMatrix.x -= offset.x;
			worldMatrix.y -= offset.y;

			if (worldMatrix.x < event.position.x && event.position.x < worldMatrix.x + this._width &&
				worldMatrix.y < event.position.y && event.position.y < worldMatrix.y + this._height) {

				this._isOnInput = true;
				this.sprite.sprite.material.tint = new Color(220, 220, 220, 240);
				/*if (this._delegate != null) {
					this._delegate();
				}*/

			} else {
				this._isOnInput = false;
				this.sprite.sprite.material.tint = new Color(255, 255, 255, 255);
			}
		} else {
			this._isOnInput = false;
			this.sprite.sprite.material.tint = new Color(255, 255, 255, 255);
		}

	}






} 

