import { SimObject } from "../world/simObject";

export abstract class Behavior {

	protected _name: string;
	protected _owner: SimObject;

	public constructor() {

	}

	public get name(): string {
		return this._name;
	}


	public setOwner(owner: SimObject): void {
		this._owner = owner;
	}

	public updateReady(): void {
	}

	public update(time: number): void {
	}

	public apply(userData: any): void {
	}



}