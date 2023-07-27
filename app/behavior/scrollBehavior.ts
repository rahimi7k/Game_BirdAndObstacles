import { Vector2 } from "../math/vector2";
import { Message } from "../message/message";
import { Behavior } from "./behavior";



export class ScrollBehavior extends Behavior {

	private _velocity: Vector2 = Vector2.zero;
	private _minPosition: Vector2 = Vector2.zero;
	private _resetPosition: Vector2 = Vector2.zero;

	private _isScrolling: boolean = false;
	private _initialPosition: Vector2 = Vector2.zero;
	private _delegate: () => void;
	private _difference: number;
	private _log: boolean;




	public constructor(velocity: Vector2, minPosition: Vector2, resetPosition: Vector2, delegate: () => void, difference: number = 0, log: boolean = false) {
		super();
		this._difference = difference;

		this._velocity = new Vector2(velocity.x + this._difference, 0);
		this._minPosition.copyFrom(minPosition);
		this._resetPosition.copyFrom(resetPosition);

		this._delegate = delegate;
		this._log = log;
	}


	public updateReady(): void {
		super.updateReady();

		Message.subscribe("Game_Start", this);
		Message.subscribe("Player_Died", this);
		Message.subscribe("Game_Continue", this);
		Message.subscribe("Game_Restart", this);
		Message.subscribe("Game_Speed", this);


		this._initialPosition.copyFrom(this._owner.transform.position.toVector2());

	}


	public update(time: number): void {
		if (this._isScrolling) {
			this._owner.transform.position.add(this._velocity.clone().scale(time / 1000).toVector3());
		}

		/*if (this._log) {
			console.log("x", this._owner.transform.position.x);
			console.log("y", this._owner.transform.position.y);
		}*/
		if (this._owner.transform.position.x <= this._minPosition.x && this._owner.transform.position.y <= this._minPosition.y) {
			this.reset();
		}
	}

	public onMessage(message: Message): void {
		if (message.code === "Game_Start") {
			this._isScrolling = true;
		} else if (message.code === "Player_Died") {
			this._isScrolling = false;
		} else if (message.code === "Game_Continue") {
			this.initial();
		} else if (message.code === "Game_Restart") {
			this.initial();
			this._isScrolling = true;

		} else if (message.code === "Game_Speed") {
			this._velocity = new Vector2(message.context + this._difference, 0);
		}


	}


	private reset(): void {
		if (this._delegate != null) {
			this._delegate();
		} else {
			this._owner.transform.position.copyFrom(this._resetPosition.toVector3());
		}

	}


	private initial(): void {
		if (this._delegate != null) {
			this._delegate();
		} else {
			this._owner.transform.position.copyFrom(this._initialPosition.toVector3());
		}

	}


}
