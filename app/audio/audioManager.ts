

export class SoundEffect {

	private _player: HTMLAudioElement;
	public assetPath: string;


	public constructor(assetPath: string, loop: boolean) {
		this._player = new Audio(assetPath);
		this._player.loop = loop;
	}

	public get loop(): boolean {
		return this._player.loop;
	}

	public set loop(value: boolean) {
		this._player.loop = value;
	}

	public destroy(): void {
		this._player = undefined;
	}

	public play(): void {
		if (!this._player.paused) {
			this.stop();
		}

		var promise: Promise<void> = this._player.play();
		if (promise !== undefined) {
			promise.then(() => {
				this._player.play();
			}).catch(error => {
				console.log("Auto-play was prevented");
			});
		}
	}


	public pause(): void {
		this._player.pause();
	}

	public stop(): void {
		this._player.pause();
		this._player.currentTime = 0;
	}
}


export class AudioManager {

	private static _soundEffects: { [name: string]: SoundEffect } = {};


	public static loadSoundFile(name: string, assetPath: string, loop: boolean): void {
		AudioManager._soundEffects[name] = new SoundEffect(assetPath, loop);
	}

	public static play(name: string): void {
		if (AudioManager._soundEffects[name] !== undefined) {
			AudioManager._soundEffects[name].play();
		}
	}

	public static pause(name: string): void {
		if (AudioManager._soundEffects[name] !== undefined) {
			AudioManager._soundEffects[name].pause();
		}
	}

	public static stop(name: string): void {
		if (AudioManager._soundEffects[name] !== undefined) {
			AudioManager._soundEffects[name].stop();
		}
	}

	public static pauseAll(): void {
		for (let sfx in AudioManager._soundEffects) {
			AudioManager._soundEffects[sfx].pause();
		}
	}

	public static stopAll(): void {
		for (let sfx in AudioManager._soundEffects) {
			AudioManager._soundEffects[sfx].stop();
		}
	}
}