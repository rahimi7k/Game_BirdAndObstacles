import { Collision } from "../components/collisionComponent";
import { Message } from "../message/message";


export class CollisionData {
	public a: Collision;
	public b: Collision;
	public time: number;

	public constructor(time: number, a: Collision, b: Collision) {
		this.time = time;
		this.a = a;
		this.b = b;
	}

}


export class CollisionManager {

	private static _totalTime: number = 0;
	private static _collisionData: CollisionData[] = [];
	private static _mainComponent: Collision;
	private static _components: Collision[] = [];


	private constructor() {

	}

	public static registerMain(_mainComponent: Collision): void {
		CollisionManager._mainComponent = _mainComponent;
	}


	public static register(component: Collision): void {
		CollisionManager._components.push(component);
	}

	public static unRegister(component: Collision): void {
		let index: number = CollisionManager._components.indexOf(component)
		if (index !== -1) {
			CollisionManager._components.slice(index, 1);
		}
	}

	public static clear(): void {
		CollisionManager._components.length = 0;
	}



	public static update(time: number): void {
		CollisionManager._totalTime += time;

		for (let c = 0; c < CollisionManager._components.length; c++) {
			let comp: Collision = CollisionManager._components[c];

			//console.log(comp.shape.intersects(other.shape));

			if (CollisionManager._mainComponent.shape.intersects(comp.shape)) {

				//We have a collision!
				let exists: boolean = false;
				for (let d = 0; d < CollisionManager._collisionData.length; d++) {
					let data = CollisionManager._collisionData[d];

					if ( (data.a === CollisionManager._mainComponent && data.b === comp)) {
						//We have existing data again, Update it
						CollisionManager._mainComponent.onCollisionUpdate(comp);
						comp.onCollisionUpdate(CollisionManager._mainComponent);
						data.time = CollisionManager._totalTime;
						exists = true;
						break;
					}
				}

				if (!exists) {
					//Create new collision
					//onCollisionEntry
					const col: CollisionData = new CollisionData(CollisionManager._totalTime, CollisionManager._mainComponent, comp);
					console.log("Enter: ", comp.name);
					CollisionManager._mainComponent.onCollisionEntry(comp);
					comp.onCollisionEntry(CollisionManager._mainComponent);
					Message.sendPriority("COLLISION_ENTRY:" + CollisionManager._mainComponent.name, this, col);
					Message.sendPriority("COLLISION_ENTRY:" + comp.name, this, col);
					this._collisionData.push(col);
				}
			}
		}


		//Remove stale(old) collision data
		//This method is because we do not want CollisionManager._collisionData order be messed up
		let removedData: CollisionData[] = [];
		for (let d = 0; d < CollisionManager._collisionData.length; d++) {
			let data: CollisionData = CollisionManager._collisionData[d];

			if (data.time !== CollisionManager._totalTime) {
				//Old collision data
				//onCollisionExit
				removedData.push(data);
			}
		}

		while (removedData.length !== 0) {
			let data = removedData.shift();
			let index: number = CollisionManager._collisionData.indexOf(data);
			CollisionManager._collisionData.splice(index, 1);
			data.a.onCollisionExit(data.b);
			data.b.onCollisionExit(data.a);
			//console.log("Exit: ", data.b.name);
			Message.sendPriority("COLLISION_EXIT:" + data.a.name, this, data);
			Message.sendPriority("COLLISION_EXIT:" + data.b.name, this, data);
		}



		document.title = CollisionManager._collisionData.length + "";
	}



	/*
	public static update(time: number): void {
		CollisionManager._totalTime += time;

		for (let c = 0; c < CollisionManager._components.length; c++) {
			let comp = CollisionManager._components[c];

			for (let o = c + 1; o < CollisionManager._components.length; o++) {
				let other = CollisionManager._components[o];

				// Do not check against collisions with self.
				if (comp === other) {
					continue;
				}

				//If both shapes are static, stop detection
				if (comp.isStatic && other.isStatic) {
					continue;
				}


				//console.log(comp.shape.intersects(other.shape));
				if (comp.shape.intersects(other.shape)) {

					//We have a collision!
					let exists: boolean = false;
					for (let d = 0; d < CollisionManager._collisionData.length; d++) {
						let data = CollisionManager._collisionData[d];

						if ((data.a === comp && data.b === other) || (data.a === other && data.b === comp)) {
							//We have existing data again, Update it
							comp.onCollisionUpdate(other);
							other.onCollisionUpdate(comp);
							data.time = CollisionManager._totalTime;
							exists = true;
							break;
						}
					}

					if (!exists) {
						//Create new collision
						//onCollisionEntry
						let col = new CollisionData(CollisionManager._totalTime, comp, other);
						comp.onCollisionEntry(other);
						other.onCollisionEntry(comp);
						Message.sendPriority("COLLISION_ENTRY:" + comp.name, this, col);
						Message.sendPriority("COLLISION_ENTRY:" + other.name, this, col);
						this._collisionData.push(col);
					}
				}

			}

		}

		//Remove stale(old) collision data
		//This method is because we do not want CollisionManager._collisionData order be messed up
		let removedData: CollisionData[] = [];
		for (let d = 0; d < CollisionManager._collisionData.length; d++) {
			let data = CollisionManager._collisionData[d];

			if (data.time !== CollisionManager._totalTime) {
				//Old collision data
				//onCollisionExit
				removedData.push(data);

			}
		}


		while (removedData.length !== 0) {
			let data = removedData.shift();
			let index: number = CollisionManager._collisionData.indexOf(data);
			CollisionManager._collisionData.splice(index, 1);
			data.a.onCollisionExit(data.b);
			data.b.onCollisionExit(data.a);
			Message.sendPriority("COLLISION_EXIT:" + data.a.name, this, data);
			Message.sendPriority("COLLISION_EXIT:" + data.b.name, this, data);
		}


		//TODO - REMOVE
		document.title = CollisionManager._collisionData.length + "";

	}
	*/






}