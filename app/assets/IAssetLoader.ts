import { IAsset } from "./IAsset";


export interface IAssetLoader {

	readonly supportedExtensions: string[];//.png .jpg .txt

	loadAsset(assetName: string): void;

}