import { Material } from "./material";


class MaterialRefrenceNode {

	public material: Material;
	public refrenceCount: number = 1;

	public constructor(material: Material) {
		this.material = material;
	}

}


export class MaterialManager {

	private static _materials: { [name: string]: MaterialRefrenceNode } = {};

	private constructor() {

	}

	public static registerMaterial(material: Material): void {
		if (MaterialManager._materials[material.name] === undefined) {
			MaterialManager._materials[material.name] = new MaterialRefrenceNode(material);
		}
	}

	public static getMaterial(name: string): Material {
		if (MaterialManager._materials[name] === undefined) {
			return undefined;
		}

		MaterialManager._materials[name].refrenceCount++;

		return MaterialManager._materials[name].material;
	}


	public static releaseMaterial(name: string): void {
		if (MaterialManager._materials[name] === undefined) {
			console.warn("Cannot release a material which has not been regestered.");
			return;
		}

		MaterialManager._materials[name].refrenceCount++;
		if (MaterialManager._materials[name].refrenceCount < 1) {
			MaterialManager._materials[name].material.destroy();
			MaterialManager._materials[name].material = undefined;
			delete MaterialManager._materials[name];
		}

	}



}