import { Message } from "../message/message";
import { IAsset } from "./IAsset";
import { IAssetLoader } from "./IAssetLoader";
import { ImageAssetLoader } from "./imageAssetLoader";
import { JsonAssetLoader } from "./jsonAssetLoader";
import { TextAssetLoader } from "./textAssetLoader";


export const MESSAGE_ASSET_LOADER_ASSET_LOADED = "MESSAGE_ASSET_LOADER_ASSET_LOADED";


export class AssetManager {

	private static _loaders: IAssetLoader[] = [];
	private static _loadedAssets: { [name: string]: IAsset } = {};


	private constructor() {

	}



	public static initialize(): void {
		AssetManager._loaders.push(new ImageAssetLoader());
		AssetManager._loaders.push(new JsonAssetLoader());
		AssetManager._loaders.push(new TextAssetLoader());

	}

	public static registerLoader(loader: IAssetLoader): void {
		AssetManager._loaders.push(loader);
	}

	public static onAssetLoaded(asset: IAsset): void {
		AssetManager._loadedAssets[asset.name] = asset;
		Message.send(MESSAGE_ASSET_LOADER_ASSET_LOADED + asset.name, this, asset);
	}

	public static loadAsset(name: string): void {
		let extension = name.split('.').pop().toLowerCase();
		for (let l of AssetManager._loaders) {
			if (l.supportedExtensions.indexOf(extension) !== -1) {

				l.loadAsset(name);
				return;
			}
		}

		console.warn("Unable to load asset with extension " + extension + " because there is no loader associated with it.");
	}


	public static isAssetLoaded(name: string): boolean {
		return AssetManager._loadedAssets[name] !== undefined;
	}



	public static getAsset(name: string): IAsset {

		if (AssetManager.isAssetLoaded(name)) {
			return AssetManager._loadedAssets[name];
		} else {
			AssetManager.loadAsset(name);
		}

		return undefined;
	}



}