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


export class Button implements IMessageHandler {



	public object: SimObject;
	private sprite: SpriteComponent;

	private _isMouseOn: boolean = false;

	private _delegate: () => void;


	private _width: number;
	private _height: number;

	constructor(parent: SimObject, globalId: number, width: number, height: number, materialName: string, isActive: boolean) {

		this._width = width;
		this._height = height;

		this.init(parent, globalId, materialName, isActive);


		Message.subscribe("Mouse_Move", this);
		Message.subscribe("MOUSE_UP", this);
	}


	public onMessage(message: Message): void {
		if (message.code === "Mouse_Move") {
			this.onMove(message.context);
		} else if (message.code === "MOUSE_UP") {
			this.onClick(message.context);
		}


		
	}


	public setDelegate(delegate: () => void): void {
		this._delegate = delegate;
	}





	private init(parent: SimObject, globalId: number, materialName: string, isActive: boolean): void {


		this.object = new SimObject(globalId, materialName);
		this.sprite = new SpriteComponent(materialName, materialName, this._width, this._height, new Vector3(0.5, 0.5));
		this.sprite.dayNightEffect = false;

		this.object.addComponent(this.sprite);

		if (!isActive) {
			this.object.isActive(false);
		}
		parent.addChild(this.object);
	}



	public onMove(event: any): void {

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

			AudioManager.play("onButton");
			this._isMouseOn = true;
			this.sprite.sprite.material.tint = new Color(220, 220, 220, 200);

		} else {
			if (!this._isMouseOn) {
				return;
			}

			this._isMouseOn = false;
			this.sprite.sprite.material.tint = new Color(255, 255, 255, 255);
		}


	}





	public onClick(event: MouseContext): void {
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
				console.log("Dakhel");
				if (this._delegate != null) {
					this._delegate();
				}

			}
		}

	}



} 

