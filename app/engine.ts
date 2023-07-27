import { AssetManager } from "./assets/assetManager";
import { AudioManager } from "./audio/audioManager";
import { CollisionManager } from "./collision/collisionManager";
import { gl, GLUtilities } from "./gl/gl";
import { AttributeInfo, GLBuffer } from "./gl/glBuffer";
import { BasicShader } from "./gl/shader/basicShader";
import { Color } from "./graphics/color";
import { Material } from "./graphics/material";
import { MaterialManager } from "./graphics/materialManager";
import { Sprite } from "./graphics/sprite";
import { InputManager, MouseContext } from "./input/inputManager";
import { Matrix4x4 } from "./math/matrix4x4";
import { IMessageHandler } from "./message/IMessageHandler";
import { Message } from "./message/message";
import { MessageBus } from "./message/messageBus";


import "./math/mathExtensions.ts";
import { BitmapFontManager } from "./graphics/bitmapFontManager";
import { Zone } from "./world/zone";



/**
 * The main engine class
 * */
export class Engine implements IMessageHandler {

	private _canvas: HTMLCanvasElement;
	private _basicShader: BasicShader;
	private _projection: Matrix4x4;
	private _previousTime: number = 0;
	private _gameWidth: number;
	private _gameHeight: number;
	private _zone: Zone;

	private _projectionPosition: WebGLUniformLocation;


	/**
	 * Creates a new engine
	 * @param width The width of the game in pixels.
	 * @param height The height of the game in pixels.
	 * */
	constructor(width?: number, height?: number) {
		this._gameWidth = width;
		this._gameHeight = height;

		this.start();
	}



	private start(): void {

		this._canvas = GLUtilities.initialize("Canvas");
		if (this._gameWidth !== undefined && this._gameHeight !== undefined) {
			this._canvas.style.width = this._gameWidth + "px";
			this._canvas.style.height = this._gameHeight + "px";
			this._canvas.width = this._gameWidth;
			this._canvas.height = this._gameHeight;
		}

		AssetManager.initialize();
		InputManager.initialize();


		//Allow objects to be transparent
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);


		this._basicShader = new BasicShader();
		this._basicShader.use();

		//Load fonts
		BitmapFontManager.addFont("default", "/assets/font/font.txt");
		BitmapFontManager.load();


		//Load materials
		MaterialManager.registerMaterial(new Material("bg", "/assets/image/bg.jpg", Color.white()/*new Color(255, 125, 0, 255)*/));
		MaterialManager.registerMaterial(new Material("space", "/assets/image/space.jpg", Color.white()/*new Color(255, 125, 0, 255)*/));
		MaterialManager.registerMaterial(new Material("pipe_head", "/assets/image/pipe_head.png", Color.white()/*new Color(255, 125, 0, 255)*/));
		MaterialManager.registerMaterial(new Material("pipe_middle", "/assets/image/pipe_middle.png", Color.white()/*new Color(255, 125, 0, 255)*/));
		MaterialManager.registerMaterial(new Material("crate", "/assets/image/crate.png", Color.white()/*new Color(255, 125, 0, 255)*/));
		MaterialManager.registerMaterial(new Material("bird", "/assets/image/bird.png", Color.white()/*new Color(255, 125, 0, 255)*/));
		MaterialManager.registerMaterial(new Material("grass1", "/assets/image/grass1.png", Color.white()/*new Color(255, 125, 0, 255)*/));
		MaterialManager.registerMaterial(new Material("grass2", "/assets/image/grass2.png", Color.white()/*new Color(255, 125, 0, 255)*/));
		MaterialManager.registerMaterial(new Material("grass3", "/assets/image/grass3.png", Color.white()/*new Color(255, 125, 0, 255)*/));
		MaterialManager.registerMaterial(new Material("grass4", "/assets/image/grass4.png", Color.white()/*new Color(255, 125, 0, 255)*/));
		MaterialManager.registerMaterial(new Material("diamond", "/assets/image/gem.png", Color.white()/*new Color(255, 125, 0, 255)*/));
		MaterialManager.registerMaterial(new Material("coin", "/assets/image/coin.png", Color.white()/*new Color(255, 125, 0, 255)*/));
		MaterialManager.registerMaterial(new Material("enemy", "/assets/image/enemy.png", Color.white()/*new Color(255, 125, 0, 255)*/));
		MaterialManager.registerMaterial(new Material("love", "/assets/image/love.png", Color.white()/*new Color(255, 125, 0, 255)*/));
		MaterialManager.registerMaterial(new Material("bullet", "/assets/image/bullet.png", Color.white()/*new Color(255, 125, 0, 255)*/));

		MaterialManager.registerMaterial(new Material("sun", "/assets/image/sun.png", Color.white()/*new Color(255, 125, 0, 255)*/));
		MaterialManager.registerMaterial(new Material("moon", "/assets/image/moon.png", Color.white()/*new Color(255, 125, 0, 255)*/));
		MaterialManager.registerMaterial(new Material("warning", "/assets/image/warning.png", Color.white()/*new Color(255, 125, 0, 255)*/));
		MaterialManager.registerMaterial(new Material("button_play", "/assets/image/button_play.png", Color.white()/*new Color(255, 125, 0, 255)*/));
		MaterialManager.registerMaterial(new Material("button_start", "/assets/image/button_start.png", Color.white()/*new Color(255, 125, 0, 255)*/));
		MaterialManager.registerMaterial(new Material("button_restart", "/assets/image/button_restart.png", Color.white()/*new Color(255, 125, 0, 255)*/));
		MaterialManager.registerMaterial(new Material("glass_blue_background", "/assets/image/glass_blue_background.png", Color.white()/*new Color(255, 125, 0, 255)*/));
		MaterialManager.registerMaterial(new Material("game_over", "/assets/image/game_over.png", Color.white()/*new Color(255, 125, 0, 255)*/));

		MaterialManager.registerMaterial(new Material("input", "/assets/image/input.png", Color.white()/*new Color(255, 125, 0, 255)*/));




		this.resize();

		AudioManager.loadSoundFile("get_coin", "/assets/sound/get_coin.mp3", false);
		AudioManager.loadSoundFile("get_diamond", "/assets/sound/get_diamond.wav", false);
		AudioManager.loadSoundFile("hit", "/assets/sound/hit.wav", false);
		AudioManager.loadSoundFile("life", "/assets/sound/life.wav", false);
		AudioManager.loadSoundFile("green1", "/assets/sound/green1.mp3", true);
		AudioManager.loadSoundFile("green2", "/assets/sound/green2.mp3", true);
		AudioManager.loadSoundFile("green3", "/assets/sound/green3.mp3", true);
		AudioManager.loadSoundFile("orange1", "/assets/sound/orange1.mp3", true);
		AudioManager.loadSoundFile("orange2", "/assets/sound/orange2.mp3", true);
		AudioManager.loadSoundFile("orange3", "/assets/sound/orange3.mp3", true);
		AudioManager.loadSoundFile("red1", "/assets/sound/red1.mp3", true);
		AudioManager.loadSoundFile("red2", "/assets/sound/red2.mp3", true);
		AudioManager.loadSoundFile("red3", "/assets/sound/red3.mp3", true);

		AudioManager.loadSoundFile("onButton", "/assets/sound/onButton.mp3", false);
		AudioManager.loadSoundFile("onButtonClick", "/assets/sound/onButtonClick.mp3", false);
		AudioManager.loadSoundFile("key_press", "/assets/sound/key_press.wmv", false);


		//Load
		//this._projection = Matrix4x4.orthographic(0, this._canvas.width, 0, this._canvas.height, -100.0, 100.0);
		/*const DEG2RAD = Math.PI / 180;

		let fov = 75;
		let aspect = 1;
		let near = 0.1;
		let far = 2000;

		let zoom = 1;
		let focus = 10;
		let filmGauge = 35;	// width of the film (default in millimeters)
		let filmOffset = 0;	// horizontal film offset (same unit as gauge)


		let top = near * Math.tan(DEG2RAD * 0.5 * fov) / zoom;
		let height = 2 * top;
		let width = aspect * height;
		let left = - 0.5 * width;

		let view = {
			enabled: true,
			fullWidth: 1,
			fullHeight: 1,
			offsetX: 0,
			offsetY: 0,
			width: 1,
			height: 1
		};


		if (view != null && view.enabled) {
			const fullWidth = view.fullWidth,
				fullHeight = view.fullHeight;

			left += view.offsetX * width / fullWidth;
			top -= view.offsetY * height / fullHeight;
			width *= view.width / fullWidth;
			height *= view.height / fullHeight;

		}

		const skew = filmOffset;
		if (skew !== 0) left += near * skew / getFilmWidth();

		console.log("left: " + left, "top: " + top, "width: " + width, "height: " + height);
		this._projection = Matrix4x4.perspective(left, left + width, top, top - height, near, far);
		

		function getFilmWidth() {
			return filmGauge * Math.min(aspect, 1);
		}*/


		//this._projection = Matrix4x4.perspective(75, window.innerWidth / window.innerHeight, 1, 100);

		this._projection = Matrix4x4.orthographic(0, this._canvas.width, this._canvas.height, 0, -1, 2000);


		//Begin the preloading phase, which waits for various thing to be loaded before starting the game
		this.preloading();
	}



	public onMessage(message: Message): void {
		if (message.code === "MOUSE_UP") {
			let context = message.context as MouseContext;
			//document.title = `Pos: [${context.position.x},${context.position.y}]`;
			//AudioManager.play("flap");

		}



	}


	private preloading(): void {

		//Make sure to always update the message bus
		MessageBus.update(0);

		if (!BitmapFontManager.updateReady()) {
			requestAnimationFrame(this.preloading.bind(this));
			return;
		}

		this._projectionPosition = this._basicShader.getUniformLocation("u_projection");
		gl.uniformMatrix4fv(this._projectionPosition, false, new Float32Array(this._projection.data));

		this._zone = new Zone(this._canvas.width, this._canvas.height);

		this.loop();// Kick off the loop
	}




	private loop(): void {
		this.update();
		this.render();

		requestAnimationFrame(this.loop.bind(this));
	}




	private update(): void {
		let delta = performance.now() - this._previousTime;//Calculate how much time passed on new execution

		MessageBus.update(delta);
		this._zone.update(delta);
		CollisionManager.update(delta);

		this._previousTime = performance.now();
	}



	private render(): void {
		gl.clear(gl.COLOR_BUFFER_BIT);

		this._zone.render(this._basicShader);
	}









	public resize(): void {
		//i fix it with css not js
		if (gl == null) {
			return;
		}

		if (this._canvas !== undefined) {
			if (this._gameWidth === undefined || this._gameHeight === undefined) {
				this._canvas.width = window.innerWidth;
				this._canvas.height = window.innerHeight;
			}
		}

		gl.viewport(0, 0, this._canvas.width, this._canvas.height);

		this._projection = Matrix4x4.orthographic(0, this._canvas.width, this._canvas.height, 0, -100, 2000);

		//this._projection = Matrix4x4.orthographic(-1, 1, 1, -1, 0.1, 2000.0);

		//this._projection = Matrix4x4.perspective(100, window.innerWidth / window.innerHeight, 0.1, 1000);



	}

}
