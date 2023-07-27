import { AssetManager } from "./assetManager";
import { IAsset } from "./IAsset";
import { IAssetLoader } from "./IAssetLoader";


export class JsonAsset implements IAsset {

	public readonly name: string;
	public readonly data: any;

	public constructor(name: string, data: any) {
		this.name = name;
		this.data = data;
	}

}



export class JsonAssetLoader implements IAssetLoader {

	public get supportedExtensions(): string[] {
		return ["json"];
	}

	public loadAsset(assetName: string): void {
		let request: XMLHttpRequest = new XMLHttpRequest();
		request.open("GET", assetName);
		request.addEventListener("load", this.onJsonLoaded.bind(this, assetName, request))
		request.send();
	}


	private onJsonLoaded(assetName: string, request: XMLHttpRequest): void {
		console.log("onJsonLoad assetName/request", assetName, request);

		if (request.readyState === request.DONE) {
			let json = JSON.parse(request.responseText);
			AssetManager.onAssetLoaded(new JsonAsset(assetName, json));
		}
	}

}