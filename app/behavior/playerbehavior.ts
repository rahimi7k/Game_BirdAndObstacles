import { AudioManager } from "../audio/audioManager";
import { CollisionData } from "../collision/collisionManager";
import { AnimatedSpriteComponent } from "../components/animatedSpriteComponent";
import { Vector2 } from "../math/vector2";
import { Vector3 } from "../math/vector3";
import { IMessageHandler } from "../message/IMessageHandler";
import { Message } from "../message/message";
import { Behavior } from "./behavior";




export class PlayerBehavior extends Behavior implements IMessageHandler {

	private _acceleration: Vector2;
	private _velocity: Vector2 = Vector2.zero;
	private _isAlive: boolean = true;
	private _playerCollisionComponent: string;
	private _groundCollisionComponent: string;
	private _animatedSpriteName: string;
	private _isPlaying: boolean = false;
	private _initialPosition: Vector3 = Vector3.zero;

	private _sprite: AnimatedSpriteComponent;

	public static readonly INITIAL_LIFE: number = 3;
	private _lifes: number = PlayerBehavior.INITIAL_LIFE;


	public constructor(acceleration: Vector2, animatedSpriteName: string, playerCollisionComponent: string, groundCollisionComponent: string) {
		super();

		this._acceleration = acceleration;
		this._animatedSpriteName = animatedSpriteName;
		this._playerCollisionComponent = playerCollisionComponent;
		this._groundCollisionComponent = groundCollisionComponent;

		Message.subscribe("MOUSE_DOWN", this);
		Message.subscribe("Press_Space", this);

		Message.subscribe("COLLISION_ENTRY:pipe", this);
		Message.subscribe("COLLISION_ENTRY:enemy", this);
		Message.subscribe("COLLISION_ENTRY:bullet", this);
		Message.subscribe("COLLISION_ENTRY:grass", this);

		Message.subscribe("Player_Resetart", this);
		Message.subscribe("Player_Start", this);

	}


	public onMessage(message: Message): void {
		switch (message.code) {
			case "MOUSE_DOWN":
			case "Press_Space":
				this.onFlap();
				break;
				

			case "COLLISION_ENTRY:pipe":
			case "COLLISION_ENTRY:enemy":
			case "COLLISION_ENTRY:bullet":
			case "COLLISION_ENTRY:grass":
				this.die();
				this.decelerate();
				break;


			case "Player_Resetart":
				this.reset();
				break;

			case "Player_Start":
				this.start();
				break;

		}
	}


	public updateReady(): void {
		super.updateReady();

		//Obtain a refrence to the animated sprite.
		this._sprite = this._owner.getComponentByName(this._animatedSpriteName) as AnimatedSpriteComponent;
		if (this._sprite === undefined) {
			throw new Error("AnimatedSpriteComponent named " + this._animatedSpriteName + " is not attached to the owner of this component.");
		}

		//Make sure the animation plays right away
		this._sprite.setFrame(0);//Shows the picture of first frame of all birds together
		this._initialPosition.copyFrom(this._owner.transform.position);
	}


	public update(time: number): void {


		let seconds: number = time / 1000;

		if (this._isPlaying) {
			this._velocity.add(this._acceleration.clone().scale(seconds));
		}

		//Limit max speed
		if (this._velocity.y > 300) {
			this._velocity.y = 300;
		}

		//Prevent flying too high
		if (this._owner.transform.position.y < -13) {
			this._owner.transform.position.y = -13;
			this._velocity.y = 0
		}

		if (this._owner.transform.position.x < -13) {
			this._owner.transform.position.x = -13;
			this._velocity.x = 0
		}



		this._owner.transform.position.add(this._velocity.clone().scale(seconds).toVector3());

		if (this._velocity.y < 0) {
			this._owner.transform.rotation.z -= Math.degToRad(150.0) * seconds;
			if (this._owner.transform.rotation.z < Math.degToRad(-5)) {
				this._owner.transform.rotation.z = Math.degToRad(-5)
			}
		}

		if (this.isFalling() || !this._isAlive) {
			this._owner.transform.rotation.z += Math.degToRad(150.0) * seconds;
			if (this._owner.transform.rotation.z > Math.degToRad(15)) {
				this._owner.transform.rotation.z = Math.degToRad(15);
			}
		}

		if (this.shouldNotFlap()) {
			this._sprite.stop();
		} else {
			if (!this._sprite.isPlaying) {
				this._sprite.play();
			}
		}

		super.update(time);
	}



	public isFalling(): boolean {
		return this._velocity.y > 220.0;
	}


	public shouldNotFlap(): boolean {
		return !this._isPlaying || this._velocity.y === 220.0 || !this._isAlive;
	}

	private die(): void {
		if (this._isAlive) {
			this._isAlive = false;
			this._sprite.stop();


			this._lifes--;
			Message.send("Player_Died", this, this._lifes);

			AudioManager.play("hit");

			if (this._lifes >= 0) {
				setTimeout(() => {
					this.onRestart();
				}, 1500)
			}
		
		}
	}

	private reset(): void {
		this._lifes = PlayerBehavior.INITIAL_LIFE;
		this._sprite.object.transform.position.copyFrom(this._initialPosition);
		//this._sprite.object.transform.rotation.z = 0;
		this._owner.transform.position.set(150, 360);

		this._velocity.set(0, 0);
		this._acceleration.set(0, 920);
		this._sprite.play();

		Message.sendPriority("Game_Restart", this);

		//It is important isAlive be after Game_Continue, because after being alive Collision occured and because alive is true, it died again
		this._isAlive = true;
		this._isPlaying = true;
	}


	private start(): void {
		this._isPlaying = true;
		Message.send("Game_Start", this);
	}




	private decelerate(): void {
		this._acceleration.y = 0;
		this._velocity.y = 0;
	}

	private onFlap(): void {
		if (this._isAlive && this._isPlaying) {
			this._velocity.y = -350;
			//AudioManager.play("flap");
		}
	}

	private onRestart(): void {
		this._owner.transform.rotation.z = 0;
		this._owner.transform.position.set(150, 360);
		this._velocity.set(0, 0);
		this._acceleration.set(0, 920);
		this._isAlive = true;

		this._sprite.play();
		this.start();
		Message.send("Game_Continue", this);
	}




	public get life(): number {
		return this._lifes;
	}

	public addLife(): void {
		this._lifes++;
	}

	public setLife(count: number): void {
		this._lifes = count;
	}

}
