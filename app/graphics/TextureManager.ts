import { Texture } from "./texture";


class TextureRefrenceNode {

	public texture: Texture;
	public refrenceCount: number = 1;

	public constructor(texture: Texture) {
		this.texture = texture;
	}
}




export class TextureManager {

	private static _textures: { [name: string]: TextureRefrenceNode } = {};

	private constructor() {

	}

	public static getTexture(name: string): Texture {
		if (TextureManager._textures[name] === undefined) {
			const texture: Texture = new Texture(name);
			TextureManager._textures[name] = new TextureRefrenceNode(texture);
		} else {
			TextureManager._textures[name].refrenceCount++;
		}

		return TextureManager._textures[name].texture;
	}


	public static releaseTexture(name: string): void {
		if (TextureManager._textures[name] === undefined) {
			console.warn("A texture named " + name + " is not exist and therefore cannot be released.");
		} else {
			TextureManager._textures[name].refrenceCount--;
			if (TextureManager._textures[name].refrenceCount < 1) {
				TextureManager._textures[name].texture.destroy();
				TextureManager._textures[name] = undefined;//Remove the object
				delete TextureManager._textures[name];//Remove the key in the list
			}
		}
	}


}