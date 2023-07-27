import { AudioManager } from "../audio/audioManager";
import { Behavior } from "../behavior/behavior";
import { KeyboardMovement } from "../behavior/keyboardMovementBehavior";
import { PlayerBehavior } from "../behavior/playerbehavior";
import { ScrollBehavior } from "../behavior/scrollBehavior";
import { AnimatedSpriteComponent } from "../components/animatedSpriteComponent";
import { BitmapTextComponent } from "../components/bitmapTextComponent";
import { Button } from "../components/button";
import { Collision } from "../components/collisionComponent";
import { Component } from "../components/component";
import { Input } from "../components/input";
import { Pipe } from "../components/pipe";
import { SpriteComponent } from "../components/spriteComponent";
import { gl } from "../gl/gl";
import { Shader } from "../gl/shader";
import { Color } from "../graphics/color";
import { Rectangle2D } from "../graphics/shapes2D/rectangle2D";
import { Vector2 } from "../math/vector2";
import { Vector3 } from "../math/vector3";
import { IMessageHandler } from "../message/IMessageHandler";
import { Message } from "../message/message";
import { SimObject } from "./simObject";

export enum ZoneState {
	UNINITIALIZED,
	LOADING,
	UPDATING
}


export class Zone implements IMessageHandler {

	private _root: SimObject;
	private _state: ZoneState = ZoneState.UNINITIALIZED;
	private _globalId: number = 0;

	private  _speed: number = -600;

	private width: number = 0;
	private height: number = 0;

	public static dayLightCoefficient: number = +1;
	public static isDay: boolean = true;


	private _coin: SimObject;
	private _coinToRight: boolean = false;

	private _diamond: SimObject;
	private _diamondToRight: boolean = true;


	private _sun: SimObject;
	private _sunBool: boolean = false;
	private _sunScaling: number = 2;
	private _sunPositionX: number = 0;
	private _sunPositionY: number = 150;


	private _moon: SimObject;
	private _moonBool: boolean = false;
	private _moonPositionX: number = 0;
	private _moonPositionY: number = 150;

	private _coinText: BitmapTextComponent;
	private _countCoin: number = 0;


	private _pipe: Pipe;


	private _enemy: SimObject;
	private _isEnemyGoingDown: boolean = true;

	private _bullet: SimObject;
	private _isBulletGoingDown: boolean = true;



	private _name: string;
	private _nameBitmap: BitmapTextComponent;

	private _life1: SimObject;
	private _life2: SimObject;
	private _life3: SimObject;
	private _life4: SimObject;


	private _status: SimObject;
	private _statusType: number = 0;



	private _lifeObject: SimObject;
	private _isLifeGettingBig: boolean = true;



	private _player: PlayerBehavior;

	private isActive: boolean = false;

	private _soundTrack: number;
	private _soundType: string;


	private _buttonPlay: Button;
	private _buttonRestart: Button;
	private _buttonStart: Button;
	private _input: Input;


	private _menuBackground: SimObject;
	private _gameOver: SimObject;

	private _finalCoinObject: SimObject;
	private _finalCoin: BitmapTextComponent;




	public constructor(width: number, height: number) {
		this.width = width;
		this.height = height;

		this.initialize();
		this.load();


		Message.subscribe("Player_Died", this);
		Message.subscribe("Game_Start", this);

	}


	public onMessage(message: Message): void {
		if (message.code === "Player_Died") {
			this.save();
			this.isActive = false;
			if (message.context === 3) {
				this._life4.isActive(false);
			} else if (message.context === 2) {
				this._life3.isActive(false);
			} else if (message.context === 1) {
				this._life2.isActive(false);
			} else if (message.context === 0) {
				this._life1.isActive(false);
			} else {
				this.onGameOver();
			}

		} else if (message.code === "Game_Start") {
			this.isActive = true;
		}
	}



	private initialize(): void {

		this._root = new SimObject(0, "__ROOT__");
		console.log("this.width", this.width);
		console.log("this.height", this.height);


		let object: SimObject = new SimObject(this._globalId++, "space");
		object.transform.setPosition(0, 0);
		object.addComponent(new SpriteComponent("space", "space", this.width, this.height / 2, null));
		this._root.addChild(object);


		this._sunPositionX = this.width - 150;
		this._sun = new SimObject(this._globalId++, "sun");
		this._sun.transform.setPosition(this._sunPositionX, this._sunPositionY);
		this._sun.transform.setScale(1.0, 1.0);
		this._sun.addComponent(new SpriteComponent("sun", "sun", 150, 150, new Vector3(0.5, 0.5)));
		this._root.addChild(this._sun);


		this._moonPositionX = this.width + 150;
		this._moon = new SimObject(this._globalId++, "moon");
		this._moon.transform.setPosition(this._moonPositionX, this._moonPositionY);
		this._moon.transform.setScale(1.0, 1.0);
		const moonSprite: SpriteComponent = new SpriteComponent("moon", "moon", 150, 150, new Vector3(0.5, 0.5));
		moonSprite.dayNightEffect = false;
		this._moon.addComponent(moonSprite);
		this._root.addChild(this._moon);


		object = new SimObject(this._globalId++, "bg");
		object.transform.setPosition(0, this.height / 2);
		object.addComponent(new SpriteComponent("bgSprite", "bg", this.width, this.height / 2, null));
		this._root.addChild(object);


		const pipeObject: SimObject = new SimObject(this._globalId++, "pipe");
		pipeObject.transform.setPosition(Math.max(700, this.width / 2), 0);
		pipeObject.addBehavior(new ScrollBehavior(new Vector2(this._speed, 0), new Vector2(-200, 0), new Vector2(this.width + 200, 0), this.pipeScrolling, 0, true));


		const childObject1: SimObject = new SimObject(this._globalId++, "pipe1_middle_top");
		pipeObject.addChild(childObject1);

		const childObject2: SimObject = new SimObject(this._globalId++, "pipe1_top")
		pipeObject.addChild(childObject2);


		const childObject3: SimObject = new SimObject(this._globalId++, "pipe1_bottom");
		pipeObject.addChild(childObject3);

		const childObject4: SimObject = new SimObject(this._globalId++, "pipe1_middle_bottom");
		pipeObject.addChild(childObject4);

		this._root.addChild(pipeObject);


		this._pipe = new Pipe(this.width, this.height, pipeObject, childObject1, childObject2, childObject3, childObject4);



		let grassWidth: number = 1000;
		let grassHeight: number = 60;

		object = new SimObject(this._globalId++, "grass1");
		object.addComponent(new SpriteComponent("grass1", "grass1", grassWidth, grassHeight, null));
		object.addComponent(new Collision("grass", new Rectangle2D(grassWidth, grassHeight), true, null, false));
		object.transform.setPosition(0, this.height - grassHeight);
		object.addBehavior(new ScrollBehavior(new Vector2(this._speed, 0), new Vector2(-grassWidth, this.height - grassHeight), new Vector2(3000, this.height - grassHeight), null));
		this._root.addChild(object);


		grassHeight = 85;
		object = new SimObject(this._globalId++, "grass2");
		object.addComponent(new SpriteComponent("grass2", "grass2", grassWidth, grassHeight, null));
		object.addComponent(new Collision("grass", new Rectangle2D(grassWidth, grassHeight), true, null, false));
		object.transform.setPosition(1000, this.height - grassHeight);
		object.addBehavior(new ScrollBehavior(new Vector2(this._speed, 0), new Vector2(-grassWidth, this.height - grassHeight), new Vector2(3000, this.height - grassHeight), null));
		this._root.addChild(object);


		grassHeight = 100;
		object = new SimObject(this._globalId++, "grass3");
		object.addComponent(new SpriteComponent("grass3", "grass3", grassWidth, grassHeight, null));
		object.addComponent(new Collision("grass", new Rectangle2D(grassWidth, grassHeight), true, null, false));
		object.transform.setPosition(2000, this.height - grassHeight);
		object.addBehavior(new ScrollBehavior(new Vector2(this._speed, 0), new Vector2(-grassWidth, this.height - grassHeight), new Vector2(3000, this.height - grassHeight), null));
		this._root.addChild(object);


		grassHeight = 85;
		object = new SimObject(this._globalId++, "grass4");
		object.addComponent(new SpriteComponent("grass2", "grass2", grassWidth, grassHeight, null));
		object.addComponent(new Collision("grass", new Rectangle2D(grassWidth, grassHeight), true, null, false));
		object.transform.setPosition(3000, this.height - grassHeight);
		object.addBehavior(new ScrollBehavior(new Vector2(this._speed, 0), new Vector2(-grassWidth, this.height - grassHeight), new Vector2(3000, this.height - grassHeight), null));
		this._root.addChild(object);






		this._coin = new SimObject(this._globalId++, "coin");
		this._coin.transform.setPosition(this.width / 2, this.height / 2);
		this._coin.addComponent(new SpriteComponent("coin", "coin", 64, 64, new Vector3(0.5, 0.5)));
		this._coin.addComponent(new Collision("coin", new Rectangle2D(64, 64), true, this.coinCollision, false));
		this._coin.addBehavior(new ScrollBehavior(new Vector2(this._speed, 0), new Vector2(-1000, 940), new Vector2(1000, 940), this.coinScrolling));
		this._root.addChild(this._coin);

		this._diamond = new SimObject(this._globalId++, "diamond");
		this._diamond.transform.setPosition(this.width + 250 + (Math.abs(this.calculateVariance())), (this.height / 2) + this.calculateVariance());
		this._diamond.addComponent(new SpriteComponent("diamond", "diamond", 64, 64, new Vector3(0.5, 0.5)));
		this._diamond.addComponent(new Collision("diamond", new Rectangle2D(64, 64), true, this.coinCollision, false));
		this._diamond.addBehavior(new ScrollBehavior(new Vector2(this._speed, 0), new Vector2(-1000, 940), new Vector2(1000, 940), this.diamondScrolling));
		this._root.addChild(this._diamond);





		object = new SimObject(this._globalId++, "bird");
		object.transform.setPosition(200, 360);
		object.transform.setScale(0.8, 0.8);
		object.addComponent(new AnimatedSpriteComponent("birdAnimatedSprite", "bird", 300, 295, 3, 2, [0, 1, 2, 3, 4, 5, 4, 3, 2, 1], true, new Vector3(0.5, 0.5, 0)));
		object.addComponent(new Collision("bird", new Rectangle2D(300 - 100, 295 - 145, new Vector2(0, 0), new Vector2(0.5, 0.5), false), false, null));
		this._root.addChild(object);
		object.addBehavior(new KeyboardMovement(5));
		this._player = new PlayerBehavior(new Vector2(0, 950), "birdAnimatedSprite", "birdCollision", "groundCollision");
		object.addBehavior(this._player);






		this._enemy = new SimObject(this._globalId++, "enemy");
		this._enemy.transform.setPosition(this.width + 250, 360);
		this._enemy.addComponent(new SpriteComponent("enemy", "enemy", 100, 100, new Vector3(0.5, 0.5)));
		this._enemy.addComponent(new Collision("enemy", new Rectangle2D(64, 64, new Vector2(0, 0), new Vector2(0.5, 0.5), false), false, null));
		this._enemy.addBehavior(new ScrollBehavior(new Vector2(this._speed, 0), new Vector2(-1000, 940), new Vector2(1500, 940), this.enemyScrolling));
		this._root.addChild(this._enemy);

		this._bullet = new SimObject(this._globalId++, "bullet");
		this._bullet.transform.setPosition(this.width + 250, 360);
		this._bullet.addComponent(new SpriteComponent("bullet", "bullet", 130, 100, new Vector3(0.5, 0.5)));
		this._bullet.addComponent(new Collision("bullet", new Rectangle2D(100, 80, new Vector2(0, 0), new Vector2(0.5, 0.5), false), false, null));
		this._bullet.addBehavior(new ScrollBehavior(new Vector2(this._speed, 0), new Vector2(-1000, 940), new Vector2(1500, 940), this.bulletScrolling, -300));
		this._root.addChild(this._bullet);

		this._lifeObject = new SimObject(this._globalId++, "life");
		this._lifeObject.transform.setPosition(this.width + 2000, this.height / 2);
		this._lifeObject.addComponent(new SpriteComponent("life", "love", 64, 64, new Vector3(0.5, 0.5)));
		this._lifeObject.addComponent(new Collision("love", new Rectangle2D(100, 80, new Vector2(0, 0), new Vector2(0.5, 0.5), false), false, this.lifeCollision));
		this._lifeObject.addBehavior(new ScrollBehavior(new Vector2(this._speed, 0), new Vector2(-5500, (this.height / 2) + this.calculateVariance()), new Vector2(10000, (this.height / 2) + this.calculateVariance()), null, - 100));
		this._root.addChild(this._lifeObject);





		



		object = new SimObject(this._globalId++, "text");
		object.transform.setPosition(20, 10);
		this._nameBitmap = new BitmapTextComponent("text1", "default", "");
		object.addComponent(this._nameBitmap);
		this._root.addChild(object);


		object = new SimObject(this._globalId++, "coinText");
		object.transform.setPosition(100, 125);
		const coinText: SpriteComponent = new SpriteComponent("coinText", "coin", 42, 42, new Vector3(0.5, 0.5));
		coinText.dayNightEffect = false;
		object.addComponent(coinText);
		this._root.addChild(object);

		object = new SimObject(this._globalId++, "text");
		object.transform.setPosition(130, 90);
		this._coinText = new BitmapTextComponent("text1", "default", "0")
		object.addComponent(this._coinText);
		this._root.addChild(object);


		this._life1 = new SimObject(this._globalId++, "life1");
		this._life1.transform.setPosition(20, 105);
		const life1Sprite: SpriteComponent = new SpriteComponent("life1", "love", 30, 30, new Vector3(0.5, 0.5));
		life1Sprite.dayNightEffect = false;
		this._life1.addComponent(life1Sprite);
		this._life1.isActive(false);
		this._root.addChild(this._life1);


		this._life2 = new SimObject(this._globalId++, "life2");
		this._life2.transform.setPosition(55, 105);
		const life2Sprite: SpriteComponent = new SpriteComponent("life2", "love", 30, 30, new Vector3(0.5, 0.5));
		life2Sprite.dayNightEffect = false;
		this._life2.addComponent(life2Sprite);
		this._life2.isActive(false);
		this._root.addChild(this._life2);


		this._life3 = new SimObject(this._globalId++, "life3");
		this._life3.transform.setPosition(20, 140);
		const life3Sprite: SpriteComponent = new SpriteComponent("life3", "love", 30, 30, new Vector3(0.5, 0.5));
		life3Sprite.dayNightEffect = false;
		this._life3.addComponent(life3Sprite);
		this._life3.isActive(false);
		this._root.addChild(this._life3);


		this._life4 = new SimObject(this._globalId++, "life4");
		this._life4.transform.setPosition(55, 140);
		const life4Sprite: SpriteComponent = new SpriteComponent("life4", "love", 30, 30, new Vector3(0.5, 0.5));
		life4Sprite.dayNightEffect = false;
		this._life4.addComponent(life4Sprite);
		this._life4.isActive(false);
		this._root.addChild(this._life4);



		this._status = new SimObject(this._globalId++, "status");
		this._status.transform.setPosition(80, 220);
		const _statusSprite: SpriteComponent = new SpriteComponent("status", "warning", 128, 128, new Vector3(0.5, 0.5));
		_statusSprite.dayNightEffect = false;
		this._status.addComponent(_statusSprite);
		this._root.addChild(this._status);
		_statusSprite.sprite.material.tint = new Color(255, 255, 255, 150);
		this._status.isActive(false);



		//AudioManager.play("green1");
		const changeStatusTime: number = 10000;
		setInterval(() => {

			if (!this.isActive) {
				return;
			}

			setTimeout(() => {
				const r: number = Math.random();
				if (r < 0.3) {
					if (this._statusType === 1) {
						this._statusType = 2;
					} else {
						this._statusType = 1;
					}
				} else if (r < 0.6) {
					if (this._statusType === 2) {
						this._statusType = 3;
					} else {
						this._statusType = 2;
					}
				} else {
					if (this._statusType === 3) {
						this._statusType = 1;
					} else {
						this._statusType = 3;
					}
				}

				this._soundTrack = this._statusType;


				if (this._statusType === 1) {
					this._speed = -500;
					this._soundType = "green";
				} else if (this._statusType === 1) {
					this._speed = -900;
					this._soundType = "orange";
				} else {
					this._speed = -1350;
					this._soundType = "red";
				}

	

				AudioManager.pauseAll();

				AudioManager.play(this._soundType + this._soundTrack);
				Message.send("Game_Speed", this, this._speed);
				this._status.isActive(false);
			}, 1500);

			this._status.isActive(true);

		}, changeStatusTime - 1500);



		this._menuBackground = new SimObject(this._globalId++, "Menu Background");
		this._menuBackground.transform.setPosition(0, 0);
		const menuBackgroundSprite: SpriteComponent = new SpriteComponent("Menu Background", "glass_blue_background", this.width, this.height, new Vector3(0, 0));
		menuBackgroundSprite.dayNightEffect = false;
		this._menuBackground.addComponent(menuBackgroundSprite);
		this._root.addChild(this._menuBackground);
		menuBackgroundSprite.sprite.material.tint = new Color(50, 50, 50, 220);
		this._menuBackground.isActive(true);

		this._buttonPlay = new Button(this._root, this._globalId++, 224, 72, "button_play", true);
		this._buttonPlay.object.transform.setPosition(this.width / 2, this.height / 2);
		this._buttonPlay.setDelegate(this.onPlayClick);

		this._buttonStart = new Button(this._root, this._globalId++, 224, 72, "button_start", false);
		this._buttonStart.object.transform.setPosition(this.width / 2, (this.height / 2));
		this._buttonStart.setDelegate(this.onStartClick);

		this._input = new Input(this._root, this._globalId++, 500, 100, "input", false, "Your Name", 10);
		this._input.object.transform.setPosition(this.width / 2, (this.height / 2) - 200);
		this._input.setDelegate(this.onNameChanged);
		this._globalId++;//Input needs double item





		this._gameOver = new SimObject(this._globalId++, "GameOver");
		this._gameOver.transform.setPosition(this.width / 2, (this.height / 2) - 250);
		const gameOverSprite: SpriteComponent = new SpriteComponent("GameOver", "game_over", 500, 90, new Vector3(0.5, 0.5));
		gameOverSprite.dayNightEffect = false;
		this._gameOver.addComponent(gameOverSprite);
		this._root.addChild(this._gameOver);
		this._gameOver.isActive(false);


		this._finalCoinObject = new SimObject(this._globalId++, "finalCoin");
		this._finalCoinObject.transform.setPosition((this.width / 2) - 240, (this.height / 2) - 120);
		this._finalCoin = new BitmapTextComponent("text2", "default", "")
		this._finalCoinObject.addComponent(this._finalCoin);
		this._finalCoinObject.isActive(false);

		this._root.addChild(this._finalCoinObject);
		this._buttonRestart = new Button(this._root, this._globalId++, 224, 72, "button_restart", false);
		this._buttonRestart.object.transform.setPosition(this.width / 2, (this.height / 2) + 100);
		this._buttonRestart.setDelegate(this.onRestartClick);



	}



	private onPlayClick: () => void = (): void => {
		this._buttonStart.object.isActive(true);
		this._input.object.isActive(true);
	}

	private onStartClick: () => void = (): void => {

		if (this._name == null || this._name == "") {
			window.alert("Please input your name!");
			return;
		}

		

		this._buttonPlay.object.isActive(false);
		this._menuBackground.isActive(false);
		Message.send("Player_Start", this);
		this.isActive = true;
		this.loadAccount();
		this.initialLifes();

		this._buttonStart.object.isActive(false);
		this._input.object.isActive(false);
	}

	private onRestartClick: () => void = (): void => {
		this._buttonRestart.object.isActive(false);
		this._menuBackground.isActive(false);
		this._finalCoinObject.isActive(false);
		this._gameOver.isActive(false);
		Message.send("Player_Resetart", this);
		this.isActive = true;
		this._life1.isActive(true);
		this._life2.isActive(true);
		this._life3.isActive(true);

		this._countCoin = 0;
		this._coinText.text(this._countCoin.toString());
	}


	private onGameOver(): void {
		AudioManager.pause(this._soundType + this._soundTrack);
		this._menuBackground.isActive(true);
		this._gameOver.isActive(true);
		this._buttonRestart.object.isActive(true);
		this.isActive = false;

		this._finalCoinObject.isActive(true);
		this._finalCoin.text("Final Score: " + this._countCoin);
		this.save();
	}




	private load(): void {
		this._state = ZoneState.LOADING;

		this._root.load();//Fire load on root simObject (and it all created) -> component, childern   
		this._root.updateReady();//Fire updateReady for root simObject -> component, behaviors and children

		this._state = ZoneState.UPDATING;
	}


	public unload(): void {

	}


	public update(time: number): void {
		if (this._state === ZoneState.UPDATING) {


			if (this.isActive) {


				if (Zone.isDay) {
					Zone.dayLightCoefficient -= 0.001;

					//Sun Out
					if (Zone.dayLightCoefficient < 0.6) {
						if (this._sun.transform.position.x < this.width + 150) {
							this._sun.transform.position.x += 1;
						} else {
							this._sun.transform.position.x = this.width + 150;
						}

						if (this._sun.transform.position.y > -this._sunPositionY) {
							this._sun.transform.position.y -= 1;
						} else {
							this._sun.transform.position.y = -this._sunPositionY;
						}
					}

					//Moon In
					if (Zone.dayLightCoefficient < 0.5) {
						if (this._moon.transform.position.x > this._sunPositionX) {
							this._moon.transform.position.x -= 2;
						} else {
							this._moon.transform.position.x = this._sunPositionX;
						}


						if (this._moon.transform.position.y < this._sunPositionY) {
							this._moon.transform.position.y += 2;
						} else {
							this._moon.transform.position.y = this._sunPositionY;
						}
					}




					if (Zone.dayLightCoefficient <= 0.15) {
						Zone.dayLightCoefficient = 0.15;
						Zone.isDay = false;
					}

				} else {
					Zone.dayLightCoefficient += 0.001;

					//Moon Out
					if (Zone.dayLightCoefficient > 0.4) {
						if (this._moon.transform.position.x < this.width + 150) {
							this._moon.transform.position.x += 2;
						} else {
							this._moon.transform.position.x = this.width + 150;
						}

						if (this._moon.transform.position.y > -this._moonPositionY) {
							this._moon.transform.position.y -= 2;
						} else {
							this._moon.transform.position.y = -this._moonPositionY;
						}
					}


					//Sun In
					if (Zone.dayLightCoefficient > 0.5) {
						if (this._sun.transform.position.x > this._sunPositionX) {
							this._sun.transform.position.x -= 1;
						} else {
							this._sun.transform.position.x = this._sunPositionX;
						}
						if (this._sun.transform.position.y < this._sunPositionY) {
							this._sun.transform.position.y += 1;
						} else {
							this._sun.transform.position.y = this._sunPositionY;
						}
					}




					if (Zone.dayLightCoefficient >= 1) {
						Zone.dayLightCoefficient = 1;
						Zone.isDay = true;
					}
				}

				//gl.clearColor((162 - Zone.dayLightCoefficient * 220) / 255, (218 - Zone.dayLightCoefficient * 280) / 255, (247 - Zone.dayLightCoefficient * 300) / 255, 1);

				//Coin
				if (this._coinToRight) {
					this._coin.transform.rotation.z -= 0.04;

					if (this._coin.transform.rotation.z <= -1) {
						this._coinToRight = false;
					}
				} else {
					this._coin.transform.rotation.z += 0.04;

					if (this._coin.transform.rotation.z >= 1) {
						this._coinToRight = true;
					}
				}


				//Diamond
				if (this._diamondToRight) {
					this._diamond.transform.rotation.z -= 0.04;

					if (this._diamond.transform.rotation.z <= -1) {
						this._diamondToRight = false;
					}
				} else {
					this._diamond.transform.rotation.z += 0.04;

					if (this._diamond.transform.rotation.z >= 1) {
						this._diamondToRight = true;
					}
				}





				//Sun
				if (this._sunBool) {
					this._sun.transform.rotation.z -= 0.01;
					if (this._sun.transform.scale.x < this._sunScaling) {
						this._sun.transform.scale.x += 0.003;
						this._sun.transform.scale.y += 0.003;
					}

					if (this._sun.transform.rotation.z <= -0.5) {
						this._sunBool = false;
					}
				} else {
					this._sun.transform.rotation.z += 0.005;
					if (this._sun.transform.scale.x > 1) {
						this._sun.transform.scale.x -= 0.003;
						this._sun.transform.scale.y -= 0.003;
					}

					if (this._sun.transform.rotation.z >= 0.5) {
						this._sunBool = true;
					}
				}

				//Moon
				if (this._moonBool) {
					this._moon.transform.rotation.z -= 0.01;
					if (this._moon.transform.rotation.z <= -0.3) {
						this._moonBool = false;
					}
				} else {
					this._moon.transform.rotation.z += 0.005;

					if (this._moon.transform.rotation.z >= 0.3) {
						this._moonBool = true;
					}
				}


				this.enemyMovement();
				this.bulletMovement();

			}




			this._root.update(time);
		}
	}

	public render(shader: Shader): void {
		if (this._state === ZoneState.UPDATING) {
			this._root.render(shader);
		}
	}



	public onActivated(): void {

	}

	public onDeActivated(): void {

	}



	private pipeScrolling: () => void = (): void => {
		this._pipe.update();
	}




	//Coin & Diamond
	private coinCollision: (name: string) => void = (name: string) => {

		const v: number = this.calculateVariance();

		if (name === "coin") {
			AudioManager.play("get_coin");
			this._countCoin++;
			this._coin.transform.setPosition(this.width + (Math.abs(v) / 2), (this.height / 3) + v);
		} else {
			AudioManager.play("get_diamond");
			this._countCoin += 2;
			this._diamond.transform.setPosition(this.width + 1200 + (Math.abs(this.calculateVariance())), (this.height / 3) + this.calculateVariance());
		}

		this._coinText.text(this._countCoin.toString());
		this.save();
	}



	private coinScrolling: () => void = () => {
		const v: number = this.calculateVariance();
		this._coin.transform.setPosition(this.width + (Math.abs(v) / 2), (this.height / 3) + v);
	}

	private diamondScrolling: () => void = () => {
		const v: number = this.calculateVariance();
		this._diamond.transform.setPosition(this.width + (Math.abs(v) / 2), (this.height / 3) + v);
	}





	//Enemy
	private enemyScrolling: () => void = () => {
		const v: number = this.calculateVariance();
		this._enemy.transform.setPosition(this.width + (Math.abs(v) / 2), (this.height / 3) + v);
	}

	private enemyMovement(): void {
		if (this._isEnemyGoingDown) {
			this._enemy.transform.position.y += 6;

			if (this._enemy.transform.position.y >= this.height - (this.height / 7)) {
				this._isEnemyGoingDown = false;
			}
		} else {
			this._enemy.transform.position.y -= 6;

			if (this._enemy.transform.position.y <= this.height / 7) {
				this._isEnemyGoingDown = true;
			}
		}
	}



	//Bullet
	private bulletScrolling: () => void = () => {
		const v: number = this.calculateVariance();
		this._bullet.transform.setPosition(this.width + (Math.abs(v) / 2), (this.height / 3) + v);
	}

	private bulletMovement(): void {
		if (this._isBulletGoingDown) {
			this._bullet.transform.position.y += 6;

			if (this._bullet.transform.position.y >= this.height - (this.height / 7)) {
				this._isBulletGoingDown = false;
			}
		} else {
			this._bullet.transform.position.y -= 6;

			if (this._bullet.transform.position.y <= this.height / 7) {
				this._isBulletGoingDown = true;
			}
		}
	}




	//Life
	private lifeCollision: () => void = () => {

		this._lifeObject.transform.setPosition(12000, (this.height / 2) + this.calculateVariance());
		AudioManager.play("life");



		if (this._player.life === 4) {
			return;
		}

		this._player.addLife();
		if (this._player.life === 4) {
			this._life4.isActive(true);
		} else if (this._player.life === 3) {
			this._life3.isActive(true);
		} else if (this._player.life === 2) {
			this._life2.isActive(true);
		} else if (this._player.life === 1) {
			this._life1.isActive(true);
		}

	}





	private onNameChanged: (name: string) => void = (name: string) => {
		this._name = name;
		this._nameBitmap.text(name);
	}






	private calculateVariance(): number {
		const isUp: boolean = (Math.random() > 0.5);
		let variance: number = this.height / 3;
		variance *= Math.random();
		if (isUp) {
			variance = -variance;
		}

		return variance;
	}




	private save(): void {
		const data: { coin: number, life: number } = {
			coin: this._countCoin,
			life: this._player.life,
		};
		localStorage.setItem(this._name, JSON.stringify(data));
	}


	private loadAccount(): void {
		const loadData: string = localStorage.getItem(this._name);
		if (loadData != null && loadData !== "") {
			const data: { coin: number, life: number} = JSON.parse(loadData);
			if (data.coin != null && data.life != null) {
				if (data.life >= 0) {
					this._countCoin = data.coin;
					this._player.setLife(data.life);
					this._coinText.text(this._countCoin.toString());
				} else {
					this.save();
				}
			}
		}
	}

	private initialLifes(): void {
		if (this._player.life >= 1) {
			this._life1.isActive(true);
		}

		if (this._player.life >= 2) {
			this._life2.isActive(true);
		}

		if (this._player.life >= 3) {
			this._life3.isActive(true);
		}

		if (this._player.life == 4) {
			this._life4.isActive(true);
		}

	}




}
