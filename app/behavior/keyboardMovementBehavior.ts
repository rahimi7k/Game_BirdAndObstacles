import { InputManager, Keys } from "../input/inputManager";
import { IMessageHandler } from "../message/IMessageHandler";
import { Message } from "../message/message";
import { Behavior } from "./behavior";


export class KeyboardMovement extends Behavior implements IMessageHandler {

	public speed: number = 1;
	private _isActive: boolean = false;


	public constructor(speed: number) {
		super();




		Message.subscribe("Player_Died", this);
		Message.subscribe("Game_Start", this);
		Message.subscribe("Game_Restart", this);
		this.speed = speed;
	}

    public onMessage(message: Message): void {
		if (message.code === "Player_Died") {
			this._isActive = false;
		} else if (message.code === "Game_Start" || message.code === "Game_Restart") {
			this._isActive = true;
		}
	}


	public update(time: number): void {
		if (!this._isActive) {
			return;
		}

		if (InputManager.isKeyDown(Keys.LEFT)) {
			this._owner.transform.position.x -= this.speed;
		}
		if (InputManager.isKeyDown(Keys.RIGHT)) {
			this._owner.transform.position.x += this.speed;
		}
		if (InputManager.isKeyDown(Keys.UP)) {
			this._owner.transform.position.y -= this.speed;
		}
		if (InputManager.isKeyDown(Keys.DOWN)) {
			this._owner.transform.position.y += this.speed;
		}
		if (InputManager.isKeyDown(Keys.SPACE)) {
			Message.sendPriority("Press_Space", this);
		}

		super.update(time);
	}


}
